import { savePcapFile } from "./Utils.js";


// function to fetch packets captured by the API
export async function fetchPackets(
  file,
  filter,
  setFilteredPacketsShow,
  setFilteredPacketsSummary
) {
  const formData = new FormData();
  if (file) {
    formData.append("pcap_file", file);
  }
  formData.append("filter", filter);

  try {
    const response = await fetch("http://localhost:3060/api/see-packets/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const parsedPackets = await response.json();
      console.log(parsedPackets);
      setFilteredPacketsShow(Object.entries(parsedPackets.show).map(([key, value]) => `${value}`));
      // dict to array add space between key and value
      setFilteredPacketsSummary(Object.entries(parsedPackets.summary).map(([key, value]) => `${key}: ${value}`));
    } else {
      console.error("Failed to fetch packets");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// function to start call API and start capture
export async function startCaptureCall(
  filter,
  networkInterface
) {
  const formData = new FormData();
  formData.append("filter", filter);
  formData.append("interface", networkInterface);
  formData.append("action", "start");

  try {
    const response = await fetch("http://localhost:3060/api/capture-packets/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Capture started");
      console.log("filter", filter);
      console.log("interface", networkInterface);
    } else {
      console.error("Failed to fetch packets");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// function to stop call API and stop capture
export async function stopCaptureCall() {
  try {
    const response = await fetch("http://localhost:3060/api/capture-packets/", {
      method: "POST",
      body: JSON.stringify({ action: "stop" }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      console.log("Capture stopped");
    } else {
      console.error("Failed to stop capture");
    }
  } catch (error) {
    console.error("Error stopping capture:", error);
  }
}

// function to download the pcap file
export async function downloadPcapWithFilename() {
  try {
    const response = await fetch("http://localhost:3060/api/capture-packets/", {
      method: "POST",
      body: JSON.stringify({ action: "save" }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const pcapContent = await response.arrayBuffer();

      // Prompt user for a filename
      savePcapFile(pcapContent, "capture.pcap");
    } else {
      console.error("Failed to fetch PCAP file");
    }
  } catch (error) {
    console.error("Error downloading PCAP:", error);
  }
}

// function to fetch network interfaces
export async function getNetworkInterfaces(setNetworkInterfaces) {
  try {
    const response = await fetch("http://localhost:3060/api/interfaces/", {
      method: "GET",
    });

    if (response.ok) {
      const interfaces = await response.json().then((data) => data.interfaces);
      setNetworkInterfaces(interfaces);
      console.log("Interfaces fetched");
    } else {
      console.error("Failed to fetch interfaces");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
