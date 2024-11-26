"""
This snippet is from backend/backend/cron.py. It contains a function run_speed_test() that runs a speed test using the speedtest library and saves the results to the database. The function is called by a cron job to periodically run speed tests and store the results in the database.
Also, it comtains a function run_website_monitor() that monitors a website by sending an HTTP request and saves the status code and latency to the database. The function is called by a cron job to periodically monitor websites and store the results in the database.
"""

import speedtest
import requests
from backend.models import SpeedTest, Website, WebsiteResult

def run_speed_test():
    st = speedtest.Speedtest(secure=True)
    st.get_best_server()
    download_speed = st.download() / 10**6  # Mbps
    upload_speed = st.upload() / 10**6      # Mbps
    ping = st.results.ping

    # Save the speed test results to the database
    speed_test = SpeedTest(download_speed=download_speed, upload_speed=upload_speed, ping=ping)
    speed_test.save()
    return download_speed, upload_speed, ping

# Takes all URLs from the Website model and monitors them
def run_website_monitor():
    for website in Website.objects.all():
        try:
            response = requests.get(website.url, timeout=10)
            status_code = response.status_code
            latency = response.elapsed.total_seconds()
        except requests.RequestException:
            status_code = 503
            latency = None

        WebsiteResult.objects.create(website=website, status_code=status_code, latency=latency)