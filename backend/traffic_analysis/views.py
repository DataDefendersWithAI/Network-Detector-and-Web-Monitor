from rest_framework.response import Response
from django.http import FileResponse
from django.utils import timezone

from rest_framework.views import APIView
from .classes import TrafficAnalysis, PCAP_TRAFFIC_ANALYSIS_FOLDER
from .models import TrafficAnalysisModel
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
        file_path = os.path.join(PCAP_TRAFFIC_ANALYSIS_FOLDER, file_obj.name)
        with open(file_path, 'wb') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)

        # Process file (call your processing function here)
        traffic_analysis.file_path = file_path
        traffic_analysis.file_name = file_obj.name
        traffic_analysis.filter = filter
        traffic_analysis.debug = debug
        analysis_results = traffic_analysis.get_graph_results()

        if 'error' not in analysis_results:
            # Save results to database (also call notification when .save())
            TrafficAnalysisModel.objects.create(
                pcap_file=file_obj.name,
                message=analysis_results['alert_text'],
                status=analysis_results['status'],
                scan_at=timezone.now()
            )

        return Response(analysis_results)
    
    def get(self, request):
        return Response(traffic_analysis.get_graph_results(run_analysis=False))