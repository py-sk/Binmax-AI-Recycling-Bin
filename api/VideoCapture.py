#To make python 2 and python 3 compatible code
from __future__ import division
from __future__ import absolute_import

import cv2
import numpy as np
import requests
import time
import json
import os
import signal
import ImageServer
from ImageServer import ImageServer

class VideoCapture(object):

    def __init__(
            self,
            videoPath = "",
            videoW = 0,
            videoH = 0,
            ):

        self.videoPath = videoPath
        self.videoW = 0
        self.videoH = 0
        self.frameCount = 0
        self.vCapture = None
        self.displayFrame = None
        self.captureInProgress = False
        self.imageServer = ImageServer(5000, self)
        self.imageServer.start()
        
    def __IsCaptureDev(self, videoPath):
        try: 
            return '/dev/video' in videoPath.lower()
        except ValueError:
            return False

    def __enter__(self):
        self.setVideoSource(self.videoPath)
        return self

    def setVideoSource(self, newVideoPath):
        if self.captureInProgress:
            self.captureInProgress = False
            time.sleep(1.0)
            if self.vCapture:
                self.vCapture.release()
                self.vCapture = None
        elif self.__IsCaptureDev(newVideoPath):
            if self.vCapture:
                self.vCapture.release()
                self.vCapture = None
            self.videoPath = newVideoPath
            self.vCapture = cv2.VideoCapture('nvarguscamerasrc ! video/x-raw(memory:NVMM), width=1280, height=720, format=NV12, framerate=60/1 ! nvvidconv flip-method=0 ! video/x-raw, width=1280, height=720, format=BGRx ! videoconvert ! video/x-raw, format=BGR ! appsink', cv2.CAP_GSTREAMER)
            if self.vCapture.isOpened():
                self.captureInProgress = True
            else:
                print("===========================\r\nWARNING : Failed to Open Video Source\r\n===========================\r\n")
        else:
            print("===========================\r\nWARNING : No Video Source\r\n===========================\r\n")
            self.vCapture = None
        return self

    def get_display_frame(self):
        return self.displayFrame

    def videoStreamReadTimeoutHandler(signum, frame):
        raise Exception("VideoStream Read Timeout") 

    def start(self):
        while True:
            if self.captureInProgress:
                self.__Run__()

            if not self.captureInProgress:
                time.sleep(1.0)

    def __Run__(self):
        cameraH = 0
        cameraW = 0
        frameH = 0
        frameW = 0
        if self.vCapture:
            cameraH = int(self.vCapture.get(cv2.CAP_PROP_FRAME_HEIGHT))
            cameraW = int(self.vCapture.get(cv2.CAP_PROP_FRAME_WIDTH))
        else:
            print("Error : No Video Source")
            return
        if self.videoW != 0 and self.videoH != 0 and self.videoH != cameraH and self.videoW != cameraW:
            needResizeFrame = True
            frameH = self.videoH
            frameW = self.videoW
        else:
            needResizeFrame = False
            frameH = cameraH
            frameW = cameraW
        if needResizeFrame:
            print("Original frame size  : " + str(cameraW) + "x" + str(cameraH))
            print("     New frame size  : " + str(frameW) + "x" + str(frameH))
            print("             Resize  : " + str(needResizeFrame))
        else:
            print("Camera frame size    : " + str(cameraW) + "x" + str(cameraH))
            print("       frame size    : " + str(frameW) + "x" + str(frameH))
        cameraFPS = int(self.vCapture.get(cv2.CAP_PROP_FPS))
        if cameraFPS == 0:
            print("Error : Could not get FPS")
            raise Exception("Unable to acquire FPS for Video Source")
            return
        perFrameTimeInMs = 1000 / cameraFPS
        signal.signal(signal.SIGALRM, self.videoStreamReadTimeoutHandler)
        while True:
            tFrameStart = time.time()
            if not self.captureInProgress:
                break
            try:
                # Read a frame
                frame = self.vCapture.read()[1]
            except Exception as e:
                print("ERROR : Exception during capturing")
                raise(e)
            # Resize frame if flagged
            if needResizeFrame:
                frame = cv2.resize(frame, (self.videoW, self.videoH))
            # Calculate FPS
            timeElapsedInMs = (time.time() - tFrameStart) * 1000
            self.displayFrame = cv2.imencode( '.jpg', frame )[1].tobytes()
            timeElapsedInMs = (time.time() - tFrameStart) * 1000
            if (1000 / cameraFPS) > timeElapsedInMs: 
                waitTimeBetweenFrames = perFrameTimeInMs - timeElapsedInMs
                time.sleep(waitTimeBetweenFrames/1000.0)

    def __exit__(self, exception_type, exception_value, traceback):
        if self.vCapture:
            self.vCapture.release()
        self.imageServer.close()
        cv2.destroyAllWindows()
