from rest_framework.response import Response
from django.http import FileResponse

from rest_framework.views import APIView
from .classes import TrafficAnalysis, PCAP_FOLDER
import os

# Initialize the objects
traffic_analysis = TrafficAnalysis()

# Return graphs of traffic analysis
class PcapAnalysisView(APIView):
    def post(self, request):
        file_obj = request.FILES['pcap_file']
        filter = request.data.get('filter', '')
        debug = request.data.get('debug', 'false').lower() == 'true'

        # Save file locally
        file_path = os.path.join(PCAP_FOLDER, file_obj.name)
        with open(file_path, 'wb') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)

        # Process file (call your processing function here)
        traffic_analysis.file_path = file_path
        traffic_analysis.file_name = file_obj.name
        traffic_analysis.filter = filter
        traffic_analysis.debug = debug
        analysis_results = traffic_analysis.get_graph_results()

        return Response(analysis_results)