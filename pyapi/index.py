from flask import Flask
from redled import RedLed
import json

RED_LED_CHANNEL = 27 
TEMPERATURE_CHANNEL = 4
VIBRATION_CHANNEL = 17

# init vars
app = Flask(__name__)
redLed = RedLed(RED_LED_CHANNEL)

@app.route("/")
def hello():
  return "Hello World!"

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

