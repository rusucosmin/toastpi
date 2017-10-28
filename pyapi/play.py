import RPi.GPIO as GPIO

import time

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(17,GPIO.OUT)

index=0;
while(True):
	time.sleep(1)
	index = index +1
	if index % 2 ==0 :
		GPIO.output(17,True)
	else:
		GPIO.output(17,False)

