import asyncio
import tornado.ioloop
import tornado.web
import tornado.websocket
import threading
import base64
import os
import jetson.inference
import jetson.utils
import PIL
import numpy as np
import cv2
import Jetson.GPIO as GPIO
import time
from playsound import playsound

material_item_num_dict = {
  'metal': 1,
  'glass': 2,
  'paper': 3,
  'plastic': 4,
  'others': 5,
};

plastic_item_num_dict = {
  'cd': 1,
  'drinking_straw': 2,
  'plastic_bag': 3,
  'plastic_clothes_hanger': 4,
  'plastic_container_or_bottle': 5,
  'plastic_disposable': 6,
  'plastic_packaging': 7,
  'plastic_packaging_with_foil': 8,
  'styrofoam': 9,
}
glass_item_num_dict = {
  'ceramic': 1,
  'glassware': 2,
  'lightbulb': 3,
}
metal_item_num_dict = {
  'aerosol_can': 1,
  'aluminum_tray_foil': 2,
  'metal_can_or_container': 3,
}
others_item_num_dict = {
  'battery': 1,
  'electronic_waste': 2,
  'stationery': 3,
}
paper_item_num_dict = {
  'beverage_carton': 1,
  'cardboard': 2,
  'chopsticks': 3,
  'disposables': 4,
  'paper_bag': 5,
  'paper_packaging': 6,
  'paper_product':7,
  'paper_receipt': 8,
  'paper_roll': 9,
  'paper_sheet': 10,
  'tissue_box': 11,
  'tissue_paper': 12,
}

"""
GPIO
"""
# Front Ultrasonic Sensor
GPIO.setmode(GPIO.BOARD)
GPIO_TRIGGER_FRONT = 18
GPIO_ECHO_FRONT = 24
GPIO.setup(GPIO_TRIGGER_FRONT, GPIO.OUT)
GPIO.setup(GPIO_ECHO_FRONT, GPIO.IN)

# LED Strips
GPIO_RECYCLABLE = 23
GPIO_NON_RECYCLABLE = 21
GPIO.setup(GPIO_RECYCLABLE, GPIO.OUT)
GPIO.setup(GPIO_NON_RECYCLABLE, GPIO.OUT)
GPIO.output(GPIO_RECYCLABLE, False)  
GPIO.output(GPIO_NON_RECYCLABLE, False)  

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
    print(location)
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
    total_distance = 100
    counter = 0
    while any(i > 100 for i in distance_store):
        distance_store[counter]=distance(location)
        counter += 1
        if counter >= 3:
            counter = 0
    return (sum(distance_store)/len(distance_store))/total_distance*100

def is_someone_in_front():
    distance_store = [9999,9999,9999]
    counter = 0
    while True:
        dist = distance('front')
        time.sleep(0.75)
        print ("Measured Distance = %.1f cm" % dist)
        if dist < 1000:
            distance_store[counter] = dist
        counter += 1
        if counter >= 3:
            counter = 0
        if sum(distance_store)/len(distance_store) <= 90:
            return True

"""
Voice Lines
"""
flag = False
def play_sound(status):
    global flag
    if flag==False:
        if status == 'hello':
            pass
            #playsound('voice/hello_im_binmax.m4a')
            
        if status == 'clean':
            playsound('voice/clean.m4a')
            
        if status == 'contaminated':
            playsound('voice/contaminated.m4a')
            
        if status == 'recycle':
            playsound('voice/lets_recycle.m4a')
            
        if status == 'thanks':
            playsound('voice/thanks_for_recycling.m4a')
        if status == 'viewfinder':
            playsound('voice/item_front.m4a')
        flag = True
    elif flag == True:
        flag = False


"""
AI Models
"""
net = jetson.inference.imageNet('resnet50', ['--model=models/materials_resnet53_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/labels.txt'])

glass_net = jetson.inference.imageNet('resnet18', ['--model=models/glass_resnet20_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/glass.txt'])

metal_net = jetson.inference.imageNet('resnet18', ['--model=models/metal_resnet20_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/metal.txt'])

plastic_net = jetson.inference.imageNet('resnet18', ['--model=models/plastic_resnet20_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/plastic.txt'])

paper_net = jetson.inference.imageNet('resnet18', ['--model=models/paper_resnet20_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/paper.txt'])

others_net = jetson.inference.imageNet('resnet18', ['--model=models/others_resnet20_vanilla_pytorch.onnx','--input_blob=input_0','--output_blob=output_0','--labels=/home/mnt/datasets/recycler/others.txt'])

"""
Server
"""
class ImageStreamHandler(tornado.websocket.WebSocketHandler):
    
    def initialize(self, videoCapture):
        self.clients = []
        self.videoCapture = videoCapture
        self.prediction = 'dog'

    def check_origin(self, origin):
        return True

    def open(self):
        self.clients.append(self)
        print("Image Server Connection::opened")

    def on_message(self, msg):
        frame = self.videoCapture.get_display_frame()
        if msg == 'next':
            if frame != None:
                encoded = base64.b64encode(frame)
                self.write_message(encoded)
        if msg == 'prediction':
            jpg_as_np = np.frombuffer(frame, dtype=np.uint8)
            img = cv2.imdecode(jpg_as_np, flags=1)
            cv2.imwrite('./current.jpg', img)
            self.write_message('image saved')
        if msg == 'view_image':
            if frame != None:
                encoded = base64.b64encode(frame)
                self.write_message(encoded)
                play_sound('recycle')
        if msg == 'get_prediction':
            frame, width, height = jetson.utils.loadImageRGBA('current.jpg')
            class_idx, confidence = net.Classify(frame, width, height)
            class_desc = net.GetClassDesc(class_idx)

            glass_class_idx, glass_confidence = glass_net.Classify(frame, width, height)
            glass_class_desc = glass_net.GetClassDesc(glass_class_idx)

            metal_class_idx, metal_confidence = metal_net.Classify(frame, width, height)
            metal_class_desc = metal_net.GetClassDesc(metal_class_idx)

            paper_class_idx, paper_confidence = paper_net.Classify(frame, width, height)
            paper_class_desc = paper_net.GetClassDesc(paper_class_idx)

            plastic_class_idx, plastic_confidence = plastic_net.Classify(frame, width, height)
            plastic_class_desc = plastic_net.GetClassDesc(plastic_class_idx)

            others_class_idx, others_confidence = others_net.Classify(frame, width, height)
            others_class_desc = others_net.GetClassDesc(others_class_idx)

            #if (class_desc=='glass'):
                #fg_class_idx, fg_confidence = glass_net.Classify(frame, width, height)
                #fg_class_desc = glass_net.GetClassDesc(fg_class_idx)
            #elif (class_desc=='metal'):
                #fg_class_idx, fg_confidence = metal_net.Classify(frame, width, height)
                #fg_class_desc = metal_net.GetClassDesc(fg_class_idx)      
            #elif (class_desc=='paper'):
                #fg_class_idx, fg_confidence = paper_net.Classify(frame, width, height)
                #fg_class_desc = paper_net.GetClassDesc(fg_class_idx)  
            #elif (class_desc=='plastic'):
                #fg_class_idx, fg_confidence = plastic_net.Classify(frame, width, height)
                #fg_class_desc = plastic_net.GetClassDesc(fg_class_idx)      
            #elif (class_desc=='others'):
                #fg_class_idx, fg_confidence = others_net.Classify(frame, width, height)
                #fg_class_desc = others_net.GetClassDesc(fg_class_idx)   
                                
            self.write_message(f'Material {material_item_num_dict[class_desc]} {glass_item_num_dict[glass_class_desc[:-1]]} {metal_item_num_dict[metal_class_desc[:-1]]} {paper_item_num_dict[paper_class_desc[:-1]]} {plastic_item_num_dict[plastic_class_desc[:-1]]} {others_item_num_dict[others_class_desc[:-1]]}')
        if msg == 'recyclable':
            play_sound('clean')
            print('clean')
            # gpio pin y set to high
            GPIO.output(GPIO_RECYCLABLE, True)
            time.sleep(1)
            GPIO.output(GPIO_RECYCLABLE, False)
            play_sound('thanks')
            
        if msg == 'non_recyclable':
            play_sound('contaminated') 
            GPIO.output(GPIO_NON_RECYCLABLE, True)
            time.sleep(1)
            GPIO.output(GPIO_NON_RECYCLABLE, False)  
            
        if msg == 'screensaver':
            #self.write_message('someone_detected')
            result = is_someone_in_front()
            if ((result == True)):
                print('SOMEONE DETECTED')
                self.write_message('someone_detected')
                play_sound('hello')
            

            
    def on_close(self):
        self.clients.remove(self)
        print("Image Server Connection::closed")

class Prediction(tornado.web.RequestHandler):

    def get(self):
        frame, width, height = jetson.utils.loadImageRGBA('current.jpg')
        class_idx, confidence = net.Classify(frame, width, height)
        class_desc = net.GetClassDesc(class_idx)
        
        glass_class_idx, glass_confidence = glass_net.Classify(frame, width, height)
        glass_class_desc = glass_net.GetClassDesc(glass_class_idx)   

        metal_class_idx, metal_confidence = metal_net.Classify(frame, width, height)
        metal_class_desc = metal_net.GetClassDesc(metal_class_idx)   

        others_class_idx, others_confidence = others_net.Classify(frame, width, height)
        others_class_desc = others_net.GetClassDesc(others_class_idx)   

        paper_class_idx, paper_confidence = paper_net.Classify(frame, width, height)
        paper_class_desc = paper_net.GetClassDesc(paper_class_idx)   

        plastic_class_idx, plastic_confidence = plastic_net.Classify(frame, width, height)
        plastic_class_desc = plastic_net.GetClassDesc(plastic_class_idx)   
             
        self.write(f'class_desc: {class_desc} confidence {confidence} glass_desc: {glass_class_desc} confidence {glass_confidence} metal_desc: {metal_class_desc} confidence {metal_confidence} others_desc: {others_class_desc} confidence {others_confidence} paper_desc: {paper_class_desc} confidence {paper_confidence} plastic_desc: {plastic_class_desc} confidence {plastic_confidence}')
        
class ImageServer(threading.Thread):

    def __init__(self, port, videoCapture):
        threading.Thread.__init__(self)
        self.setDaemon(True)
        self.port = 8000
        self.videoCapture = videoCapture

    def run(self):
        print ('ImageServer::run() : Started Image Server')
        try:
            asyncio.set_event_loop(asyncio.new_event_loop())

            indexPath = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'templates')

            app = tornado.web.Application([
                (r"/stream", ImageStreamHandler, {'videoCapture': self.videoCapture}),
                (r"/image", Prediction),
                (r"/(.*)", tornado.web.StaticFileHandler, {'path': indexPath, 'default_filename': 'index.html'}),
            ])

            asyncio.set_event_loop(asyncio.new_event_loop())
            app.listen(self.port)
            print ('ImageServer::Started.')

            tornado.ioloop.IOLoop.instance().start()

        except Exception as e:
            print('ImageServer::exited run loop. Exception - '+ str(e))

    def close(self):
        print ('ImageServer::close()')
