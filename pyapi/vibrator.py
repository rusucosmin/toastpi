import RPi.GPIO as GPIO
import time

class Vibrator:
  def __init__(self, callback, channel = 17):
    self.channel = channel
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(channel, GPIO.IN)
    # let us know when the pin goes HIGH or LOW
    GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=300)
    # assign method to GPIO PIN, run function on change
    GPIO.add_event_callback(channel, callback)
