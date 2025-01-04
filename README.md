# Introduction

# Contributors
| **Nickname**    | **Fullname**     | **Student ID** | **Contribute**       | **Features**                                | 
|-----------------|------------------|----------------|----------------------|---------------------------------------------|
| JakeClark       | Nguyễn Chí Thành | 22521350       | Backend and Frontend | Web Services and Internet Speedtest Monitor | 
| SeaWind         | Nguyễn Hải Phong | 22521088       | Backend              | Devices Monitor                             | 
| ShynBombx       | Hồ Trung Kiên    | 22520704       | Backend and Frontend | Advanced Packet Capture & Analysis          |
| lightunderwolft | Hồ Vĩnh Nhật     | 22521013       | Frontend             | Device Monitor                              | 



# Installation

* On Windows, we recommend using WSL2 to run the project and run locally instead of using docker-compose because of the network issues with docker desktop host network mode.
* If you are using Windows docker desktop, please enable host network mode in docker desktop settings.**
* On Linux, we highly recommend using docker-compose to run the project for better isolation and security and fast/easy deployment.

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
