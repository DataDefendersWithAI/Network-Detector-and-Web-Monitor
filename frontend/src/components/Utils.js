const savePcapFile = (pcapContent, filename = 'capture.pcap') => {
  // Create a Blob from the PCAP content
  const blob = new Blob([pcapContent], { type: 'application/vnd.tcpdump.pcap' });

  // Generate a temporary URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append the link to the document and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  link.remove();
  window.URL.revokeObjectURL(url);
};

export { savePcapFile };
