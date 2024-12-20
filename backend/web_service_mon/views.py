from rest_framework.views import APIView
from rest_framework.response import Response

from .classes import add_website, run_website_monitor
from .models import Website,  WebsiteResult
from .serializers import WebsiteSerializer, WebsiteResultSerializer

# Website Monitor View
# This view will monitor a website and return the status code and latency.
# The URL is passed as a GET parameter.
class WebsiteMonitorView(APIView):
    """
    Run the website monitor for all websites in the database.
    If website is down, status_code is 503 and latency is None.

    Methods
    -------
    get(request)
        Send a GET request to the website URL.
    """
    def get(self, request):
        """
        Send a GET request to the website URL.

        Parameters
        ----------
        url : str
            The URL of the website.

        Returns
        -------
        Response
            The response object.
        """
        try:
            url = request.query_params.get('url')
            if url:
                run_website_monitor([url,])
            else:
                run_website_monitor()
            return Response({'message': 'Website monitor completed.'})
        except Exception as e:
            return Response({'error': "Something went wrong."})
            
    
class AddWebsiteView(APIView):
    """
    Add a website to the database.

    Methods
    -------
    post(request)
        Add a website to the database.
    """
    def post(self, request):
        """
        Add a website to the database.

        Parameters
        ----------
        url : str
            The URL of the website.
        tag : str
            The tag of the website.
        monitor_all_events : bool
            Monitor all events.
        monitor_down_events : bool
            Monitor down events.
        dest_ip : str
            The destination IP address.

        Returns
        -------
        Response
            The response object.
        """
        try:
            url = request.data.get('url')
            tag = request.data.get('tag')
            monitor_all_events = request.data.get('monitor_all_events')
            monitor_down_events = request.data.get('monitor_down_events')
            dest_ip = request.data.get('dest_ip')
            add_website(url, tag, monitor_all_events, monitor_down_events, dest_ip)
        except Exception as e:
            return Response({'error': str(e)})
        else:
            return Response({'message': f'Website added successfully with URL: {url}.'})
    def delete(self, request):
        """
        Delete a website from the database.

        Parameters
        ----------
        url : str
            The URL of the website.

        Returns
        -------
        Response
            The response object.
        """
        try:
            url = request.data.get('url')
            website = Website.objects.get(url=url)
            website.delete()
        except Exception as e:
            return Response({'error': str(e)})
        else:
            return Response({'message': f'Website deleted successfully with URL: {url}.'})
    def put(self, request):
        """
        Update a website in the database based on the URL and provided data.

        Parameters
        ----------
        url : str
            The URL of the website.
        tag : str
            The tag of the website.
        monitor_all_events : bool
            Monitor all events.
        monitor_down_events : bool
            Monitor down events.
        dest_ip : str
            The destination IP address.
        note: str
            The note for the website.

        Returns
        -------
        Response
            The response object.
        """
        try:
            url = request.data.get('url')
            tag = request.data.get('tag')
            monitor_all_events = request.data.get('monitor_all_events')
            monitor_down_events = request.data.get('monitor_down_events')
            dest_ip = request.data.get('dest_ip')
            note = request.data.get('note')
            # Check if url exists
            if url is None or url == '':
                return Response({'error': 'URL is required.'})
            if not Website.objects.filter(url=url).exists():
                return Response({'error': f'Website with URL: {url} does not exist.'})
            website = Website.objects.get(url=url)
            website.tag = tag
            website.monitor_all_events = monitor_all_events
            website.monitor_down_events = monitor_down_events
            website.dest_ip = dest_ip
            website.note = note
            website.save()
            return Response({'message': f'Website updated successfully with URL: {url}.'})
        except Exception as e:
            return Response({'error': str(e)})
            
        
class WebsiteHistoryView(APIView):
    """
    Get website monitor results from the database.

    Methods
    -------
    get(request)
        Get website monitor results from the database.
    """
    def get(self, request):
        """
        Get website monitor results from the database.

        Parameters
        ----------
        + action: brief: List all websites with last 10 results success or fail
        + action: detail & url: str: List details of a website available in Website model
        + action: list-partial & url: str & page: int & entries: int: List partial results of a website available in WebsiteResult model
        + action: list-all & url: str: List all results of a website available in WebsiteResult model
        + action: list-all: List all results of all websites available in WebsiteResult model

        Returns
        -------
        Response
            The response object.
        """
        try:
            action = request.query_params.get('action')
            url = request.query_params.get('url')
            if action == 'brief':
                # Get the last N results for each website sorted by timestamp
                limit = int(request.query_params.get('limit', 10))
                results_list = []
                websites = Website.objects.all()
                serializer = WebsiteSerializer(websites, many=True)
                for website in serializer.data:
                    results = WebsiteResult.objects.filter(website__url=website['url']).order_by('-created_at')[:limit]
                    website_results = WebsiteResultSerializer(results, many=True).data
                    # Get the status code for each result
                    status_list = [result['status_code'] for result in website_results]
                    serial = {'website': website, 'results': status_list}
                    results_list.append(serial)
                return Response(results_list)
            if action == 'detail':
                website = Website.objects.get(url=url)
                serializer = WebsiteSerializer(website)
                return Response(serializer.data)
            if action == 'list-partial':
                page = int(request.query_params.get('page', 1))
                entries = int(request.query_params.get('entries', 10))
                sortby = request.query_params.get('sortby', 'created_at')
                # Validate sortby parameter
                if sortby not in ['created_at', 'status_code', 'latency']:
                    return Response({'error': 'Invalid sortby parameter.'}, status=400)
                # Make sure that the asc parameter is a boolean
                if request.query_params.get('asc', 'false').lower() not in ['true', 'false']:
                    return Response({'error': 'Invalid asc parameter.'}, status=400)
                else:
                    asc = request.query_params.get('asc', 'false').lower() == 'true'
                order_by = sortby if asc else f'-{sortby}'
                # Ensure that page and entries are positive integers
                if page < 1 or entries < 1:
                    return Response({'error': 'Invalid page or entries parameter.'}, status=400)
                results = WebsiteResult.objects.filter(website__url=url).order_by(order_by)[(page - 1) * entries:page * entries]
                serializer = WebsiteResultSerializer(results, many=True)
                return Response(serializer.data)
            if action == 'list-all':
                sortby = request.query_params.get('sortby', 'created_at')
                # Validate sortby parameter
                if sortby not in ['created_at', 'status_code', 'latency']:
                    return Response({'error': 'Invalid sortby parameter.'}, status=400)
                # Make sure that the asc parameter is a boolean
                if request.query_params.get('asc', 'false').lower() not in ['true', 'false']:
                    return Response({'error': 'Invalid asc parameter.'}, status=400)
                else:
                    asc = request.query_params.get('asc', 'false').lower() == 'true'
                order_by = sortby if asc else f'-{sortby}'
                if url is None:
                    results = WebsiteResult.objects.all().order_by(order_by)
                else:
                    results = WebsiteResult.objects.filter(website__url=url).order_by(order_by)
                serializer = WebsiteResultSerializer(results, many=True)
                return Response(serializer.data)
            return Response({'error': 'Invalid action.'})
        except Exception as e:
            return Response({'error': str(e)})