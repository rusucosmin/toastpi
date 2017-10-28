import RPi.GPIO as GPIO

class RedLed:
  def __init__(self, channel):
    self.isOn = False 
    self.channel = channel

  def turnOn():
    self.isOn = True
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(17,GPIO.OUT)
    GPIO.output(17,GPIO.HIGH)

  def turnOff():
    self.isOff = False
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(17,GPIO.OUT)
    GPIO.output(17,False)
