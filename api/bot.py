from telethon import TelegramClient, events, sync
import Jetson.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

"""
Binmax Caretaker Bot
"""
api_id = 123456567
api_hash = ''
bot_token = ''

caretaker_password = 'binbin'
caretaker_auth = {}

bot = TelegramClient('bot', api_id, api_hash).start(bot_token=bot_token)

"""
GPIO
"""
# Recyclable Ultrasonic Sensor
GPIO_TRIGGER_RECYCLABLE = 15
GPIO_ECHO_RECYCLABLE = 16
GPIO.setup(GPIO_TRIGGER_RECYCLABLE, GPIO.OUT)
GPIO.setup(GPIO_ECHO_RECYCLABLE, GPIO.IN)

# Non-Recyclable Ultrasonic Sensor
GPIO_TRIGGER_NON_RECYCLABLE = 31
GPIO_ECHO_NON_RECYCLABLE = 32
GPIO.setup(GPIO_TRIGGER_NON_RECYCLABLE, GPIO.OUT)
GPIO.setup(GPIO_ECHO_NON_RECYCLABLE, GPIO.IN)

def distance(location):
    if location == 'front':
        GPIO_TRIGGER = GPIO_TRIGGER_FRONT
        GPIO_ECHO = GPIO_ECHO_FRONT
    elif location == 'recyclable':
        GPIO_TRIGGER = GPIO_TRIGGER_RECYCLABLE
        GPIO_ECHO = GPIO_ECHO_RECYCLABLE
    elif location == 'non_recyclable':
        GPIO_TRIGGER = GPIO_TRIGGER_NON_RECYCLABLE
        GPIO_ECHO = GPIO_ECHO_NON_RECYCLABLE

    maxTime = 0.04
    GPIO.output(GPIO_TRIGGER, False)
    time.sleep(0.01)
    GPIO.output(GPIO_TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    StartTime = time.time()
    timeout = StartTime + maxTime
    while GPIO.input(GPIO_ECHO) == 0 and StartTime < timeout:
        StartTime = time.time()

    StopTime = time.time()
    timeout = StopTime + maxTime
    while GPIO.input(GPIO_ECHO) == 1 and StopTime < timeout:
        StopTime = time.time()
    TimeElapsed = StopTime - StartTime
    distance = (TimeElapsed * 34300) / 2
    if distance<0:
        distance = 1
    if distance>1000:
        distance = 300
    return distance

def fillMeter(location):
    distance_store = [9999,9999,9999]
    total_distance = 95
    counter = 0
    while any(i > 100 for i in distance_store):
        distance_now = distance(location)
        print(f'Location: {location} Distance: {distance_now}')
        distance_store[counter]=distance_now
        counter += 1
        if counter >= 3:
            counter = 0
    
    return (sum(distance_store)/len(distance_store))/total_distance*100


def check_auth(id):
    return caretaker_auth[id]

@bot.on(events.NewMessage(pattern='/start'))
async def start(event):
    caretaker_auth[event.message.to_id.user_id] = False
    await event.respond("Hello, I'm Binmax! Your public recycling companion! Please authenticate yourself using the /auth command.")
    raise events.StopPropagation

@bot.on(events.NewMessage(pattern='/auth'))
async def auth(event):
    if (event.message.message == '/auth'):
        await event.respond(f"Please enter your password following this format: /auth password")
        raise events.StopPropagation 
    elif (event.message.message[6:] == caretaker_password):
        caretaker_auth[event.message.to_id.user_id] = True
        await event.respond(f"Authenticated")
        raise events.StopPropagation
        
    else:
        await event.respond(f"Wrong password, please try again.")
        raise events.StopPropagation


@bot.on(events.NewMessage(pattern='/checkfill'))
async def checkfill(event):
    if check_auth(event.message.to_id.user_id):
        recyclable = 100-fillMeter('recyclable')
        non_recyclable = 100-fillMeter('non_recyclable')
        #recyclable = 40
        #non_recyclable = 60
        await event.respond(f"The recyclable bin is currently {recyclable}% full!\n The non-recyclable bin is currently {non_recyclable}% full!")
        raise events.StopPropagation
    else:
        await event.respond(f"Please authenticate yourself first using the /auth command.")
        raise events.StopPropagation

@bot.on(events.NewMessage(pattern='/checkcamera'))
async def checkcamera(event):
    if check_auth(event.message.to_id.user_id):
        await event.respond(file='current.jpg')
        raise events.StopPropagation
    else:
        await event.respond(f"Please authenticate yourself first using the /auth command.")
        raise events.StopPropagation

@bot.on(events.NewMessage)
async def echo(event):
    await event.respond(event.text)

def main():
    bot.run_until_disconnected()

if __name__ == '__main__':
    main()
