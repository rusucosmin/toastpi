import RPi.GPIO as GPIO

class RedLed:
  def __init__(self, channel):
    self.isOn = False 
    self.channel = channel

  def turnOn(self):
    self.isOn = True
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(self.channel, GPIO.OUT)
    GPIO.output(self.channel, GPIO.HIGH)

  def turnOff(self):
    self.isOff = False
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(self.channel, GPIO.OUT)
    GPIO.output(self.channel, False)
