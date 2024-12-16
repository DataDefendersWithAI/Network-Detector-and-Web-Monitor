import { savePcapFile } from "./Utils.js";


export async function fetchOpenPackets(
  file,
  filter,
  setFilteredPacketsShow,
  setFilteredPacketsSummary
) {
  const formData = new FormData();
  if (file)
    formData.append("pcap_file", file);
  formData.append("filter", filter);

  try {
    const response = await fetch("http://localhost:3060/api/view-pcap/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const parsedPackets = await response.json();
      setFilteredPacketsShow(Object.entries(parsedPackets.show).map(([key, value]) => `${value}`));
      setFilteredPacketsSummary(Object.entries(parsedPackets.summary).map(([key, value]) => `${key}: ${value}`));
    } else {
      console.error("Failed to fetch packets");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function handleCaptureAction(action, filter = "", networkInterface = "", setFilteredPacketsShow = null, setFilteredPacketsSummary = null) {
  const formData = new FormData();
  formData.append("action", action);

  if (filter) formData.append("filter", filter);
  if (networkInterface) formData.append("interface", networkInterface);

  try {
    const response = await fetch("http://localhost:3060/api/capture-packets/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      if (action === "save") {
        const pcapContent = await response.arrayBuffer();
        savePcapFile(pcapContent, "capture.pcap");
      } 
      // else if (action === "start") {
      //   console.log("Capture started");
      // } else if (action === "stop") {
      //   console.log("Capture stopped");
      // }
    } else {
      console.error(`Failed to ${action} capture`);
    }
  } catch (error) {
    console.error(`Error during ${action} capture:`, error);
  }
}

export async function getNetworkInterfaces(setNetworkInterfaces) {
  try {
    const response = await fetch("http://localhost:3060/api/interfaces/", {
      method: "GET",
    });

    if (response.ok) {
      const interfaces = await response.json().then((data) => data.interfaces);
      setNetworkInterfaces(interfaces);
      // console.log("Interfaces fetched");
    } else {
      console.error("Failed to fetch interfaces");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
