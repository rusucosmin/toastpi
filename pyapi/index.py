from flask import Flask, request
from redled import RedLed
from rgbled import RgbLed
from temperature import Temperature
from vibrator import Vibrator

import json
import requests
import time
import RPi.GPIO as GPIO

RED_LED_CHANNEL = 27 
TEMPERATURE_CHANNEL = 4
VIBRATION_CHANNEL = 17
RGB_CHANNELS = [5, 6, 13]


#callback for onVibrate
def startBroadcasting():
  
last_callback = 0
def sendNotif():
  startBroadcasting()
  print("sendNotif() called")
  url = "https://fcm.googleapis.com/fcm/send"
  headers = {
    'content-type': "application/json",
		'authorization': "key=AAAAs02QjEg:APA91bF9JYE1j4wgNXE8EEIwhUSgpw9AXrewCC9A4q7f0V7wybr38-WjQCj9psyNnRJJm9DLWx_h5GaOYcLd8CYj3P9POdLqMu86vDWLFIt9xYoldnM79BJOcB_u10L-9Xlk2SnRKpTQ"
  }
  payload = json.dumps({
    "to": "/topics/news",
    "data": {
      "message": "This is a Firebase Cloud Messaging Topic Message!"
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

if __name__ == "__main__":
  app.run(host='0.0.0.0')

