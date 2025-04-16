const inp = document.querySelector(".input-field");
const btn = document.querySelector(".send-button");
const chat = document.querySelector(".chat-container");
let thumbnailPic = document.querySelector(".thumbnailPic");
let title = document.querySelector(".video-title");

async function getGptResponse(transcript, question) {
  try {
    const res = await fetch("http://localhost:3000/res", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript, question }),
    });

    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    return "Sorry, something went wrong with ChatGPT.";
  }
}

btn.addEventListener("click", async () => {
  const question = inp.value;
  inp.value = "";
  // Add user's question to chat
  const html = `<div class="message user-message">${question}</div>`;
  chat.insertAdjacentHTML("beforeend", html);

  // Send message to background to get transcript from current tab using an external library
  await chrome.runtime.sendMessage(
    { type: "GET_TRANSCRIPT" },
    async (response) => {
      if (response.transcript && response.api && response.videoId) {
        thumbnailPic.src = `https://img.youtube.com/vi/${response.videoId}/maxresdefault.jpg`;
        const titleData = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${response.videoId}&key=${response.api}`
        ).then((res) => res.json());
        title.innerText = titleData.items[0]?.snippet?.title || "Unknown title";

        const gptReply = await getGptResponse(response.transcript, question);
        const replyHtml = `
        <div class="message bot-message">${gptReply}</div>`;
        chat.insertAdjacentHTML("beforeend", replyHtml);
        return;
      }
      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="message bot-message">Failed to get transcript.</div>`
      );
    }
  );
});
