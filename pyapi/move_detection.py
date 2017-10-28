import RPi.GPIO as GPIO
import time

channel = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.IN)

def callback(channel):
  if GPIO.input(channel):
      print "Movement detected!"
  else:
      print "Movement detected!";

# let us know when the pin goes HIGH or LOW
GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime=300)
# assign method to GPIO PIN, run function on change
GPIO.add_event_callback(channel, callback)

while True:
  time.sleep(1)

