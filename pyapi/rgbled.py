import RPi.GPIO as GPIO

class RgbLed:
  def __init__(self, channelR, channelG, channelB):
    self.state = "000"
    self.isOn = False 
    self.channelR = channelR
    self.channelG = channelG
    self.channelB = channelB
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(self.channelR, GPIO.OUT)
    GPIO.setup(self.channelG, GPIO.OUT)
    GPIO.setup(self.channelB, GPIO.OUT)

  def setRGB(self, rgb):
    self.state = rgb
    self.isOn = False if rgb == "111" else True
    GPIO.output(self.channelR, int(rgb[1]))
    GPIO.output(self.channelG, int(rgb[0]))
    GPIO.output(self.channelB, int(rgb[2]))

