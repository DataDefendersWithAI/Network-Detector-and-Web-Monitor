import { savePcapFile } from "./Utils.js";

export async function handleUploadPcap(file, filter, setFilteredPacketsShow, setFilteredPacketsSummary) {
  const formData = new FormData();
  if (file) formData.append("pcap_file", file);
  if (filter) formData.append("filter", filter);
  
  try {
    const response = await fetch("http://localhost:3060/api/upload-pcap/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const parsedPackets = await response.json();
      setFilteredPacketsShow(Object.entries(parsedPackets.show).map(([, value]) => `${value}`));
      setFilteredPacketsSummary(Object.entries(parsedPackets.summary).map(([key, value]) => `${key}: ${value}`));
    } else {
      console.error("Failed to upload pcap");
    }
  }
  catch (error) {
    console.error("Error:", error);
  }
}

export async function getViewPcap(
  file,
  filter,
  setFilteredPacketsShow,
  setFilteredPacketsSummary
) {
  const formData = new FormData();
  if (file)
    formData.append("pcap_file", file);
  if (filter)
    formData.append("filter", filter);

  try {
    const response = await fetch("http://localhost:3060/api/view-pcap/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const parsedPackets = await response.json();
      setFilteredPacketsShow(Object.entries(parsedPackets.show).map(([, value]) => `${value}`));
      setFilteredPacketsSummary(Object.entries(parsedPackets.summary).map(([key, value]) => `${key}: ${value}`));
    } else {
      console.error("Failed to fetch packets");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getListCapturedPackets(setCapturedPackets) {
  try {
    const response = await fetch("http://localhost:3060/api/list-pcap/", {
      method: "GET",
    });

    if (response.ok) {
      const packets = await response.json().then((data) => data.packets);
      setCapturedPackets(packets);
      // console.log("Captured packets fetched");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function handleDeleteCaptured(file, setCapturedPackets) {
  const formData = new FormData();
  formData.append("pcap_file", file);

  try {
    const response = await fetch("http://localhost:3060/api/delete-pcap/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      await getListCapturedPackets(setCapturedPackets);
      // console.log("Capture deleted");
    } else {
      console.error("Failed to delete capture");
    }
  }
  catch (error) {
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
