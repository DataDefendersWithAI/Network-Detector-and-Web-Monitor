from rest_framework.views import APIView
from rest_framework.response import Response
from .classes import run_speed_test

import concurrent.futures
from .models import SpeedTest
import re

# Speed Test View
# This view will run a speed test and return the download and upload speeds.
# The speedtest library is used to perform the speed test.
class SpeedTestView(APIView):
    def get(self, request):
        # Get GET parameters "action" to check if the user wants to list all speed tests or delete
        # If list is None, run a new speed test
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(run_speed_test)
            try:
                download_speed, upload_speed, ping = future.result()
                return Response({
                    'download_speed': round(download_speed, 2),
                    'upload_speed': round(upload_speed, 2),
                    'ping': ping
                })
            except concurrent.futures.TimeoutError:
                return Response({'error': 'Speed test took too long.'}, status=500)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
    def delete(self, request):
        date_delete = request.query_params.get('date')
        # date_delete like this: 2024-11-15T10:28:28.953333Z/
        if date_delete is None:
            return Response({'error': 'Date parameter is required.'}, status=400)
        
        # Delete "/" in date_delete
        date_delete = date_delete.replace("/", "")
        # Check if date_delete is in correct format
        if not re.match(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d*Z?', date_delete):
            return Response({'error': 'Invalid date format.'}, status=400)
        
        speed_test_date = SpeedTest.objects.filter(created_at=date_delete)
        # Check if speed test date exists
        if not speed_test_date.exists():
            return Response({'error': 'Speed test date not found.'}, status=404)
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
            sortby = request.query_params.get('sortby', 'created_at')
            asc = request.query_params.get('asc', 'true').lower() == 'true'
            # Ensure that page_index and entries are positive integers
            if page_index < 1 or entries < 1:
                return Response({'error': 'Invalid page or entries parameter.'}, status=400)
            # Ensure that sortby is a valid field
            if sortby not in ['download_speed', 'upload_speed', 'ping', 'created_at']:
                return Response({'error': 'Invalid sortby parameter.'}, status=400)
            # Ensure that asc is a valid boolean
            if request.query_params.get('asc', 'true') not in ['true', 'false']:
                return Response({'error': 'Invalid asc parameter.'}, status=400)
            # Get total records and speed tests
            total_records = SpeedTest.objects.count()
            speed_tests = SpeedTest.objects.all().order_by(sortby if asc else f'-{sortby}')[(page_index - 1) * entries:page_index * entries]
            # Return speed test results with from, to, list of results, and total records
            return Response({
            'from': (page_index - 1) * entries + 1,
            'to': page_index * entries,
            'total': total_records,
            'results': [{
                'download_speed': round(speed_test.download_speed, 2),
                'upload_speed': round(speed_test.upload_speed, 2),
                'ping': round(speed_test.ping, 2),
                'created_at': speed_test.created_at
            } for speed_test in speed_tests]
            })
        elif action == 'all':
            sortby = request.query_params.get('sortby', 'created_at')
            asc = request.query_params.get('asc', 'true').lower() == 'true'
            # Ensure that sortby is a valid field
            if sortby not in ['download_speed', 'upload_speed', 'ping', 'created_at']:
                return Response({'error': 'Invalid sortby parameter.'}, status=400)
            # Ensure that asc is a valid boolean
            if request.query_params.get('asc') not in ['true', 'false']:
                return Response({'error': 'Invalid asc parameter.'}, status=400)
            # Get all speed tests and return them
            speed_tests = SpeedTest.objects.all().order_by(sortby if asc else f'-{sortby}')
            total_records = speed_tests.count()
            return Response({
            'total': total_records,
            'results': [{
                'download_speed': round(speed_test.download_speed, 2),
                'upload_speed': round(speed_test.upload_speed, 2),
                'ping': round(speed_test.ping, 2),
                'created_at': speed_test.created_at
            } for speed_test in speed_tests]
            })
        else:
            return Response({'error': 'Invalid action parameter.'}, status=400)