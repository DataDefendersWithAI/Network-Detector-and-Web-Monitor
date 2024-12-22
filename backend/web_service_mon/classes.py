import requests
from .models import Website, WebsiteResult
from socket import gethostbyname
import re
import json

def add_website(url, tag, monitor_all_events, monitor_down_events, dest_ip):
    """
    Add a website to the database.
    """
    website = Website.objects.create(url=url, tag=tag, monitor_all_events=monitor_all_events, monitor_down_events=monitor_down_events, dest_ip=dest_ip)
    website.save()
    print('Website added with URL:', url, 'Tag:', tag, 'Monitor All Events:', monitor_all_events, 'Monitor Down Events:', monitor_down_events, 'Destination IP:', dest_ip)

# Takes all URLs from the Website model and monitors them
def run_website_monitor(url_list = None):
    """
    Run the website monitor for all websites in the database.
    If website is down, status_code is 503 and latency is None.
    If monitor_all_events is True, monitor all events and store them in the database.
    If monitor_down_events is True, monitor only down events and store them in the database.

    With each website, we will try:
    + Get destination IP address by just using "xxx.xxx.xxx" from URL given
    + Then we will send a GET request to the website URL, maybe including path and GET params
    """
    if url_list:
        # If url_list is provided, monitor only the websites in the list
        websites = Website.objects.filter(url__in=url_list)
    else:
        # If url_list is not provided, monitor all websites
        websites = Website.objects.all()
    for website in websites:
        try:
            # Send a GET request to the website URL
            url = website.url
            if not url.startswith('http://') and not url.startswith('https://'):
                url = 'http://' + url
            response = requests.get(url, timeout=15)
            status_code = response.status_code
            latency = response.elapsed.total_seconds()
            print('URL:', url, 'Status Code:', status_code, 'Latency:', latency)

            # Extract hostname from URL using regex
            match = re.match(r'^(?:http[s]?://)?([^:/\s]+)', url)
            hostname = match.group(1) if match else url

            print('Hostname:', hostname)

            dest_ip = gethostbyname(hostname)
            # Update the destination IP address in the database
            website.dest_ip = dest_ip
            website.save()
            # Debug: Print all the information
            print('URL:', url, 'Status Code:', status_code, 'Latency:', latency, 'Destination IP:', dest_ip)
        except requests.ConnectionError:
            # If the connection fails, set status_code to 503 and latency to None
            status_code = 503
            latency = None
        except requests.RequestException:
            # If the request fails, set status_code to 503 and latency to None
            status_code = 503
            latency = None
        # If monitor_all_events is True, monitor all events and store them in the database
        if website.monitor_all_events or (website.monitor_down_events and status_code in range(400, 600)):
            WebsiteResult.objects.create(website=website, status_code=status_code, latency=latency)