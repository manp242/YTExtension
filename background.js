chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TRANSCRIPT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      //gets current tab url
      const videoUrl = tabs[0].url;
      try {
        const transcript = await getTranscriptFromYouTube(videoUrl);
        sendResponse({ transcript });
      } catch (err) {
        console.error("Transcript error:", err);
        sendResponse({ transcript: "Error fetching transcript." });
      }
    });

    return true; // Keep the message channel open for async response
  }
});
async function getTranscriptFromYouTube(videoUrl) {
  const videoId = new URLSearchParams(new URL(videoUrl).search).get("v");

  const response = await fetch(
    `http://localhost:3000/transcript?videoId=${videoId}`
  );
  const data = await response.json();

  return data.transcript || "Transcript not found.";
}
