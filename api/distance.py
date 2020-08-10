import Jetson.GPIO as GPIO
import time
GPIO.setmode(GPIO.BOARD)
GPIO_TRIGGER = 18
GPIO_ECHO = 24
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)
 
def distance():
    GPIO.output(GPIO_TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
    StartTime = time.time()
    StopTime = time.time()
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()
    TimeElapsed = StopTime - StartTime
    distance = (TimeElapsed * 34300) / 2
    return distance

def is_someone_in_front():
    distance_store = [9999,9999,9999]
    counter = 0
    while True:
        dist = distance()
        print ("Measured Distance = %.1f cm" % dist)
        if dist < 1000:
            distance_store[counter] = dist
        counter += 1
        if counter >= 3:
            counter = 0
        if sum(distance_store)/len(distance_store) <= 50:
            return True


if __name__ == '__main__':

    is_someone_in_front()