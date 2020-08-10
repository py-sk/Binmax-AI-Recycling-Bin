
<p align="center">
  <img width="400" height="400" src="./assets/bg.png">
</p>
<h1 align="center">BinMax: AI Recycling Bin</h1> 


<p align="center">
  
A project under PS9888 Making & Tinkering 2020 by Nanyang Technological University, Singapore.

Binmax is an AI-enabled smart recycling bin which recognises and personalizes advice based on user's trash, educates users and provides users with a friendly guide on recycling, with the aim to increase the current low recycling rates in Singapore. It is also a one-stop portal for recyling information and education, provideing users with the latest recycling trends, news and innovations in Singapore.

<hr>

### Features

* **Physical Recycling Bin (Kiosk Style)** created from vanguard cardboard, corrugated boards and aluminium profiles, the recycling bin was inspired by the cartoon character Baymax. There is a removable drawer-style compartment for the trash bins. The two bins are meant to separate recyclable trash from non-recyclable or contaminated trash.
* **React Web Application** serves as the main user interface for the recycling bin.
* **Trash Classification AI** consists of several image classification models trained using datasets from online and images we personally collected. The AI models are able to determine the material and type of trash being thrown. They were trained using PyTorch and deployed using TensorRT on the Jetson Nano.
* **Accessing Education and Recycling Articles** through a touch-friendly interface, with the option to scan a QR code displayed on screen to bring oneself to the article. 
* **Beautiful Visualisations of Recycling Statistics** using ApexCharts, enabling users to track various statistical information for recycling done with Binmax.
* **Proximity and Fill Detection** using ultrasonic sensors to sense when someone is close by to 'wake' Binmax up, and for the caretaker of Binmax to check how full the respective bins in Binmax are.
* **Caretaker Telegram Bot** using Telethon, to enable the caretaker of Binmax to easily access how full the bins in Binmax are and to know when to empty them.
* **3D Printed Mounts** designed using Fusion 360, to attach the various hardware to the aluminium profiles.
<hr>

### Team Members

* **Pye Sone Kyaw**
>  AI, Software and Hardware

* **Solomon Tan**

>  Hardware

* **Lin Lejia**

>  AI and Hardware

* **Evelyn Lim**

>  UI/UX and Hardware

### Hardware Involved

* Jetson Nano
* Arduino Uno
* 7-inch touchscreen
* Neopixel LED Strips
* Ultrasonic Sensors

<hr>

### React Web Application

* Deployed locally on Jetson Nano to function without internet
* Used Material-UI for components
* Several stages of continuous improvement: developing, deploying, seeking feedback

<hr>

### Trash Classification AI

* Dataset consisted of Kaggle datasets and images personally collected
* Model architectures: ResNet50 and ResNet18
* Trained using PyTorch on Google Colab Pro
* Optimised and deployed using TensorRT on Jetson Nano

<hr>

### Caretaker Telegram Bot

* Developed using Telethon
* Allows user to see how full the bins are and to check the last captured image
* Authentication function that only allows authenticated users with a password to command the bot

<hr>

### Credits

Authors of libraries / modules used in the inspiration for and development of this project, in no particular order:
* [Jetson Inference](https://github.com/dusty-nv/jetson-inference) - To get the AI models to work on the Jetson Nano.
* [Telethon](https://docs.telethon.dev/en/latest/) - Simple and straightforward Telegram Bot library.
* [Material-UI](https://material-ui.com/) - Beautiful UI components
* PyTorch
* TensorRT
