import speedtest
from .models import SpeedTest

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