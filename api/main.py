import os
import random
import sys
import time
import json
import VideoCapture
from VideoCapture import VideoCapture

def main(
        videoPath ="",
        videoWidth = 0,
        videoHeight = 0,
        ):

    global videoCapture

    try:
        print("\nPython %s\n" % sys.version )
        with VideoCapture(videoPath, videoWidth,
                         videoHeight,
                         ) as videoCapture:
            videoCapture.start()

    except KeyboardInterrupt:
        print("Camera capture module stopped" )


if __name__ == '__main__':
    try:
        VIDEO_PATH = '/dev/video0'
        VIDEO_WIDTH = 1280
        VIDEO_HEIGHT = 720


    except ValueError as error:
        print(error )
        sys.exit(1)

    main(VIDEO_PATH, VIDEO_WIDTH, VIDEO_HEIGHT)



