// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TRANSCRIPT") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const videoUrl = tabs[0].url;
      const videoId = new URLSearchParams(new URL(videoUrl).search).get("v");

      try {
        const { transcript, api } = await getTranscriptFromYouTube(videoId);
        sendResponse({
          transcript,
          videoId,
          api,
        });
      } catch (err) {
        console.error("Transcript error:", err);
        sendResponse({ transcript: "Error fetching transcript." });
      }
    });

    return true;
  }
});

async function getTranscriptFromYouTube(videoId) {
  const response = await fetch(
    `http://localhost:3000/transcript?videoId=${videoId}`
  );
  const data = await response.json();

  return { transcript: data.transcript, api: data.api };
}
