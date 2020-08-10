import time
from flask import Response, Flask
import jetson.inference
import jetson.utils
import time
import sys
import io
import threading
from contextlib import redirect_stdout
import cv2

app = Flask(__name__)
net = jetson.inference.imageNet("resnet-18")

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/image')
def imageInference():
    frame, width, height = jetson.utils.loadImageRGBA('current.jpg')
    class_idx, confidence = net.Classify(frame, width, height)
    class_desc = net.GetClassDesc(class_idx)
    return {'class_desc': class_desc, 'confidence': confidence, 'class_idx': class_idx, 'output': output}

# if __name__ == '__main__':
#     app.run("0.0.0.0", port="5000")

# check to see if this is the main thread of execution
if __name__ == '__main__':

    # Create a thread and attach the method that captures the image frames, to it
    # process_thread = threading.Thread(target=captureFrames)
    # process_thread.daemon = True

    # Start the thread
    # process_thread.start()

    # start the Flask Web Application
    # While it can be run on any feasible IP, IP = 0.0.0.0 renders the web app on
    # the host machine's localhost and is discoverable by other machines on the same network 
    app.run("0.0.0.0", port="5000")
