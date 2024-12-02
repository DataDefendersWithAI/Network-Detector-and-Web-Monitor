from rest_framework.views import APIView
from rest_framework.response import Response
from .classes import run_speed_test

from .models import SpeedTest


# Speed Test View
# This view will run a speed test and return the download and upload speeds.
# The speedtest library is used to perform the speed test.
class SpeedTestView(APIView):
    def get(self, request):
        # Get GET parameters "action" to check if the user wants to list all speed tests or delete
        # If list is None, run a new speed test
        try:
            download_speed, upload_speed, ping = run_speed_test()  
            return Response({
                'download_speed': round(download_speed, 2),
                'upload_speed': round(upload_speed, 2),
                'ping': ping
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def delete(self, request):
        date_delete = request.query_params.get('date')
        # Delete "/" in date_delete
        date_delete = date_delete.replace("/", "")
        # date_delete like this: 2024-11-15T10:28:28.953333Z/
        speed_test_date = SpeedTest.objects.filter(created_at=date_delete)
        speed_test_date.delete()
        return Response({'message': 'Speed tests deleted successfully.'})
    
class SpeedTestHistoryView(APIView):
    def get(self, request):
        """
        Get speed test results from database and return JSON
        
        Request: GET /api/speedtest/list
        Parameters:
        + action: brief: Show max, min, avg speed test results
        + action: partial & page: int & entries: int: Show partial speed test results
        + action: all: Show all speed test results
        All results rounded to 2 decimal places.
        """
        action = request.query_params.get('action')
        if action == 'brief':
            speed_tests = SpeedTest.objects.all()
            download_speeds = [speed_test.download_speed for speed_test in speed_tests]
            upload_speeds = [speed_test.upload_speed for speed_test in speed_tests]
            ping_times = [speed_test.ping for speed_test in speed_tests]
            return Response({
                'max_download_speed': round(max(download_speeds), 2),
                'min_download_speed': round(min(download_speeds), 2),
                'avg_download_speed': round(sum(download_speeds) / len(download_speeds), 2),
                'max_upload_speed': round(max(upload_speeds), 2),
                'min_upload_speed': round(min(upload_speeds), 2),
                'avg_upload_speed': round(sum(upload_speeds) / len(upload_speeds), 2),
                'max_ping': round(max(ping_times), 2),
                'min_ping': round(min(ping_times), 2),
                'avg_ping': round(sum(ping_times) / len(ping_times), 2)
            })
        elif action == 'partial':
            page_index = int(request.query_params.get('page', 1))
            entries = int(request.query_params.get('entries', 10))
            # Ensure that page_index and entries are positive integers
            if page_index < 1 or entries < 1:
                return Response({'error': 'Invalid page or entries parameter.'}, status=400)
            speed_tests = SpeedTest.objects.all()[(page_index - 1) * entries:page_index * entries]
            # Return speed test results with from, to, and list of results
            return Response({
                'from': (page_index - 1) * entries + 1,
                'to': page_index * entries - 1,
                'results': [{
                    'download_speed': round(speed_test.download_speed, 2),
                    'upload_speed': round(speed_test.upload_speed, 2),
                    'ping': round(speed_test.ping, 2),
                    'created_at': speed_test.created_at
                } for speed_test in speed_tests]
            })
        elif action == 'all':
            speed_tests = SpeedTest.objects.all()
            return Response([{
                'download_speed': round(speed_test.download_speed, 2),
                'upload_speed': round(speed_test.upload_speed, 2),
                'ping': round(speed_test.ping, 2),
                'created_at': speed_test.created_at
            } for speed_test in speed_tests])
        else:
            return Response({'error': 'Invalid action parameter.'}, status=400)