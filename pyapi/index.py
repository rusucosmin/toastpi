from flask import Flask, request, send_from_directory
from redled import RedLed
from rgbled import RgbLed
from subprocess import call
from temperature import Temperature
from vibrator import Vibrator

import json
import os
import requests
import time
import RPi.GPIO as GPIO

RED_LED_CHANNEL = 27 
TEMPERATURE_CHANNEL = 4
VIBRATION_CHANNEL = 17
RGB_CHANNELS = [5, 6, 13]

TEMPERATURE_THRESHOLD = 27

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

@app.route("/")
def hello():
  return "Hello World!"

#red led
@app.route("/redled/on")
def turnRedLedOn():
  redLed.turnOn()
  response = {"message": "ok"}
  return json.dumps(response)

@app.route("/redled/off")
def turnRedLedOff():
  redLed.turnOff()
  response = {"message": "ok"}
  return json.dumps(response)

#RGB led
def check(rgb):
  for i in rgb:
    if i != '0' and i != '1':
      return False
  return True

@app.route("/rgbled/get")
def getRgbState():
  response = {'rgb': rgbLed.state}
  return json.dumps(response)

@app.route("/rgbled/set")
def setRgbLed():
  rgb = request.args.get('rgb')
  response = {"message": "error"}
  if len(rgb) == 3 and check(rgb):
    response = {"message": "ok"}
    rgbLed.setRGB(rgb)
  return json.dumps(response)

# temperature
@app.route("/stats")
def stats():
  response = temperature.getStats()
  return json.dumps(response)

def check_temperature_periodically(arg):
  stats = json.loads(stats())
  if stats["temperature"] >= TEMPERATURE_THRESHOLD:


# webcamera

@app.route("/start_cam")
def start_cam():
  os.system("sudo motion && sudo service motion start")
  return "ok"

@app.route("/end_cam")
def end_cam():
  os.system("sudo service motion stop")
  return "ok"

@app.route("/save_image")
def save_image():
  end_cam()
  url = "photos/" + str(int(time.time())) + ".jpg"
  os.system("fswebcam -r 640x480 --no-banner " + url)
  start_cam()
  return json.dumps({"url": "/" + url}) 
 
@app.route("/photos/<path:path>")
def getPhoto(path):
  return send_from_directory("photos", path)

if __name__ == "__main__":
  app.run(host='0.0.0.0')

