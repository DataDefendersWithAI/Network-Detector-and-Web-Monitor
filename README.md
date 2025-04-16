# Introduction
## About project

## Technologies
* Application type: Web Application
* Environment: Docker, but you can implement it locally (Both Linux and Windows can run, if you install all dependencies like Python, NodeJS,...)
* Frontend: ReactJS
* Backend: Python Django

# Contributors
| **Nickname**    | **Fullname**     | **Student ID** | **Contribute**       | **Features**                                | 
|-----------------|------------------|----------------|----------------------|---------------------------------------------|
| JakeClark       | Nguyễn Chí Thành | 22521350       | Backend and Frontend | Web Services & Internet Speedtest Monitor | 
| SeaWind         | Nguyễn Hải Phong | 22521088       | Backend              | Devices Monitor & ICMP Monitoring & Events tracking                            | 
| ShynBombx       | Hồ Trung Kiên    | 22520704       | Backend and Frontend | Packet Capture & Trafiic Analysis & Notifications         |
| lightunderwolft | Hồ Vĩnh Nhật     | 22521013       | Frontend             | Devices Monitor & ICMP Monitoring & Events tracking                            | 

# Installation

* On Windows, we recommend using WSL2 to run the project and run locally instead of using docker-compose because of the network issues with docker desktop host network mode.
* If you are using Windows docker desktop, please enable host network mode in docker desktop settings.**
* On Linux, we highly recommend using docker-compose to run the project for better isolation and security and fast/easy deployment. (You can also run it locally, but you need to install all dependencies like Python, NodeJS,...)

### Prerequisites
Make sure you have:
* Docker & Docker Compose installed (Recommended)
* OR Python 3.10+, NodeJS, npm (if running locally)
* On Windows: WSL2 is strongly recommended

### Clone the repository
```bash
git clone https://github.com/DataDefendersWithAI/Network-Detector-and-Web-Monitor.git && cd Network-Detector-and-Web-Monitor
```
### First time setup backend
```bash
cd backend
python manage.py makemigrations backend && \
python manage.py makemigrations devices && \
python manage.py makemigrations icmp_monitoring && \
python manage.py makemigrations ip_scanning && \
python manage.py makemigrations notifications && \
python manage.py makemigrations packet_capture && \
python manage.py makemigrations speedtest_mon && \
python manage.py makemigrations system && \
python manage.py makemigrations traffic_analysis && \
python manage.py makemigrations web_service_mon && \
python manage.py migrate && \
cd ..
```

### Choose one of the following methods to run the project.
#### 1. Docker compose
```bash
docker-compose up -d
```

#### 2. Run locally
Install frontend dependencies
```bash
cd frontend && npm install && cd ..
```
Install backend dependencies
```bash
pip install -r backend/requirements.txt
```
Open a terminal
```bash
cd frontend && npm start
```
Open another terminal
```bash
python backend/manage.py runserver
```

**Or if you have uv package manager, here are all commands to reproduce backend:**
```bash
uv init
uv venv
uv sync
# Or: uv add -r requirements.txt
```
uv documentation: [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

### You're All Set!
The frontend should be running on http://localhost:3000, and the backend on http://localhost:3060.

# Screenshots
  | ![Screen 1][screen1] | ![Screen 2][screen2] |
  | -------------------- | -------------------- |
  | ![Screen 3][screen3] | ![Screen 4][screen4] |
  | ![Screen 5][screen5] | ![Screen 6][screen6] |
  | ![Screen 7][screen7] | ![Screen 8][screen8] |


[screen1]: ./images/Devices.png
[screen2]: ./images/Web_Services.png
[screen3]: ./images/Internet_Speedtest.png
[screen4]: ./images/ICMP_Monitoring.png
[screen5]: ./images/Packet_Capture.png
[screen6]: ./images/Traffic_Analysis.png
[screen7]: ./images/Notifications.png
[screen8]: ./images/Events.png