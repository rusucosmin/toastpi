from flask import Flask, request, send_from_directory
from redled import RedLed
from rgbled import RgbLed
from subprocess import call
from temperature import Temperature
from vibrator import Vibrator
from chart import Chart
import json
import os
import requests
import threading
import time
import RPi.GPIO as GPIO
import atexit

RED_LED_CHANNEL = 27
TEMPERATURE_CHANNEL = 4
VIBRATION_CHANNEL = 17
RGB_CHANNELS = [5, 6, 13]

TEMPERATURE_THRESHOLD = 30

last_temp = {
  "temperature": "27.5",
  "humidity": "70.1",
}
#callback for onVibrate
last_callback = 0
def sendNotif():
  photojson = json.loads(save_image())
  start_cam()
  print("sendNotif() called")
  url = "https://fcm.googleapis.com/fcm/send"
  headers = {
    'content-type': "application/json",
    'authorization': "key=AAAAs02QjEg:APA91bF9JYE1j4wgNXE8EEIwhUSgpw9AXrewCC9A4q7f0V7wybr38-WjQCj9psyNnRJJm9DLWx_h5GaOYcLd8CYj3P9POdLqMu86vDWLFIt9xYoldnM79BJOcB_u10L-9Xlk2SnRKpTQ"
  }
  payload = json.dumps({
    "to": "/topics/news",
    "data": {
      "message": "This is a Firebase Cloud Messaging Topic Message!",
      "url": photojson["url"]
    }
  })
  response = requests.request("POST", url, data=payload, headers=headers)
  print("got responde from notif: " + response.text)

def onVibrate(channel):
  print("onVibrate(" + str(channel) + ") called")
  ticks = time.time()
  global last_callback
  if ticks - last_callback > 5:
    if GPIO.input(channel):
      sendNotif()
    else:
      sendNotif()
    last_callback = ticks

# init vars
app = Flask(__name__)
redLed = RedLed(RED_LED_CHANNEL)
temperature = Temperature(TEMPERATURE_CHANNEL)
rgbLed = RgbLed(RGB_CHANNELS[0], RGB_CHANNELS[1], RGB_CHANNELS[2])
vibrator = Vibrator(onVibrate, VIBRATION_CHANNEL)
chart = Chart()

@app.route("/")
def hello():
  return "Hello World!"

#red led
@app.route("/redled/on")
def turnRedLedOn():
  print("turnRedLedOn() called")
  redLed.turnOn()
  response = {"message": "ok"}
  print("turnRedLedOn() ended")
  return json.dumps(response)

@app.route("/redled/off")
def turnRedLedOff():
  print("turnRedLedOff() called")
  redLed.turnOff()
  response = {"message": "ok"}
  print("turnRedLedOff() ended")
  return json.dumps(response)

#RGB led
def check(rgb):
  for i in rgb:
    if i != '0' and i != '1':
      return False
  return True

@app.route("/rgbled/get")
def getRgbState():
  print("getRgbState() called")
  response = {'rgb': rgbLed.state}
  print("getRgbState() ended")
  return json.dumps(response)

@app.route("/rgbled/set")
def setRgbLed():
  print("setRgbLed() called")
  rgb = request.args.get('rgb')
  response = {"message": "error"}
  if len(rgb) == 3 and check(rgb):
    response = {"message": "ok"}
    rgbLed.setRGB(rgb)
  print("setRgbLed() ended")
  return json.dumps(response)

# temperature
@app.route("/stats")
def stats():
  global last_temp
  print("stats() called")
  response = temperature.getStats()
  if int(response["temperature"]) < 0 or int(response["temperature"] > 100):
    response = last_temp
  last_temp = response
  print("stats() returned: " + str(response))
  return json.dumps(response)

def check_temperature_periodically():
  print('check_temperature_periodically started')
  while True:
    act = json.loads(stats())
    chart.addTemp(float(act['temperature']))
    print("current temperature: " + str(act["temperature"]))
    print("current humidity: " + str(act["humidity"]))
    if act["temperature"] <= TEMPERATURE_THRESHOLD:
      print("rgbLed.turnOn()")
      rgbLed.turnOn()
    else:
      print("rgbLed.turnOff()")
      rgbLed.turnOff()
    time.sleep(5)

# webcamera
@app.route("/start_cam")
def start_cam():
  print('start_cam() started')
  os.system("sudo motion && sudo service motion start")
#  t = threading.Thread(target = lambda: os.system("sudo motion && sudo service motion start"))
#  t.start()
  print('start_cam() ended')
  return "ok"

@app.route("/end_cam")
def end_cam():
  print('end_cam() started')
  os.system("sudo service motion stop")
#  t = threading.Thread(target = lambda: os.system("sudo service motion stop"))
#  t.start()
  print('end_cam() ended')
  return "ok"

@app.route("/save_image")
def save_image():
  print('save_image() started')
  end_cam()
  url = "photos/" + str(int(time.time())) + ".jpg"
  os.system("fswebcam -r 640x480 --no-banner " + url)
#  t = threading.Thread(target = lambda: os.system("fswebcam -r 640x480 --no-banner " + url))
#  t.start()
  start_cam()
  print('save_image() ended')
  return json.dumps({"url": "/" + url})

@app.route("/averages")
def getAverages():
    return json.dumps(chart.getAverages())

@app.route("/mock_average")
def mockAverage():
    chart.addTemperature(1,23)
    chart.addTemperature(7,21)
    chart.addTemperature(13,18)
    chart.addTemperature(19,26)
    return getAverages()

@app.route("/photos/<path:path>")
def getPhoto(path):
  print('getPhoto() started')
  return send_from_directory("photos", path)

def waitThread():
    print('waiting thread')
    t.join()

if __name__ == "__main__":
  # starte thread
  t = threading.Thread(target=check_temperature_periodically)
  t.start()

  atexit.register(waitThread)

  app.run(host='0.0.0.0')
