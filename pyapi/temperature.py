import pigpio
import DHT22

from time import sleep 

class Temperature:
  def __init__(self, channel):
    self.channel = channel

  def getStats(self):
    pi = pigpio.pi()
    s = DHT22.sensor(pi, self.channel)
    s.trigger()
    sleep(.1)
    stats = {}
    stats['temperature'] = s.temperature()
    stats['humidity'] = s.humidity()
    s.cancel()
    pi.stop()
    return stats

while False:
  t = Temperature(4)
  x = t.getStats()
  print(x["temperature"])
  print(x["humidity"])
  sleep(2)
