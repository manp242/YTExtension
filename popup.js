const inp = document.querySelector(".input-field");
const btn = document.querySelector(".send-button");
const chat = document.querySelector(".chat-container");

btn.addEventListener("click", async () => {
  const question = inp.value;

  // Add user's question to chat
  const html = `<div class="message user-message">${question}</div>`;
  chat.insertAdjacentHTML("beforeend", html);

  // Send message to background to get transcript from current tab
  chrome.runtime.sendMessage({ type: "GET_TRANSCRIPT" }, (response) => {
    if (response && response.transcript) {
      const replyHtml = `<div class="message bot-message">${response.transcript}</div>`;
      chat.insertAdjacentHTML("beforeend", replyHtml);
    } else {
      chat.insertAdjacentHTML(
        "beforeend",
        `<div class="message bot-message">Failed to get transcript.</div>`
      );
    }
  });

  inp.value = ""; // Clear input field
});
