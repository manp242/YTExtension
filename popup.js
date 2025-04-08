const inp = document.querySelector(".input-field");
const btn = document.querySelector(".send-button");
const chat = document.querySelector(".chat-container");

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

    chat.insertAdjacentHTML(
      "beforeend",
      `<div class="message user-message">${data.response}</div>`
    );
    return data.response;
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    return "Sorry, something went wrong with ChatGPT.";
  }
}
btn.addEventListener("click", async () => {
  const question = inp.value;
  let transcript = "";

  // Add user's question to chat
  const html = `<div class="message user-message">${question}</div>`;
  chat.insertAdjacentHTML("beforeend", html);

  // Send message to background to get transcript from current tab
  await chrome.runtime.sendMessage(
    { type: "GET_TRANSCRIPT" },
    async (response) => {
      if (response && response.transcript) {
        transcript = response.transcript;
        const gptReply = await getGptResponse(transcript, question);
        const replyHtml = `<div class="message bot-message">${gptReply}</div>`;
        chat.insertAdjacentHTML("beforeend", replyHtml);
      } else {
        chat.insertAdjacentHTML(
          "beforeend",
          `<div class="message bot-message">Failed to get transcript.</div>`
        );
      }
    }
  );
  // console.log(transcript);

  ///// send transcipt and question to chatgpt
});
