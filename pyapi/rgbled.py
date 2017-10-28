import RPi.GPIO as GPIO
from redled import RedLed

class RgbLed:
  def __init__(self, channelR, channelG, channelB):
    self.state = "001"
    self.isOn = False 
    self.channelR = channelR
    self.channelG = channelG
    self.channelB = channelB
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(self.channelR, GPIO.OUT)
    GPIO.setup(self.channelG, GPIO.OUT)
    GPIO.setup(self.channelB, GPIO.OUT)
    self.updateState()

  def setRGB(self, rgb):
    self.state = rgb
    self.isOn = False if rgb == "111" else True
    GPIO.output(self.channelR, int(rgb[1]))
    GPIO.output(self.channelG, int(rgb[0]))
    GPIO.output(self.channelB, int(rgb[2]))

  def updateState(self):
    if not self.isOn:
      print("update off")
      GPIO.output(self.channelR, 0)
      GPIO.output(self.channelG, 0)
      GPIO.output(self.channelB, 0)
    else:
      print("update on")
      GPIO.output(self.channelR, int(self.state[1]))
      GPIO.output(self.channelG, int(self.state[0]))
      GPIO.output(self.channelB, int(self.state[2]))

  def turnOff(self):
    self.isOn = False
    self.updateState()

  def turnOn(self):
    self.isOn = True
    self.updateState()
    

