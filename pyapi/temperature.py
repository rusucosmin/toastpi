import Adafruit_DHT
import sys
import RPi.GPIO as GPIO

class Temperature:
  def __init__(self, channel):
    self.channel = channel

  def getStats(self):
    stats = {}
    sensor = Adafruit_DHT.AM2302
    h,t = Adafruit_DHT.read_retry(sensor,self.channel)
    stats['temperature'] = t
    stats['humidity'] = h
    return stats
