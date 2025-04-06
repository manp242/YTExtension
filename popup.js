const inp = document.querySelector(".input-field");
const btn = document.querySelector(".send-button");
const chat = document.querySelector(".chat-container");
let YAPI = process.env.YAPI;

btn.addEventListener("click", async function () {
  html = `<div class="message user-message">
          ${inp.value}
        </div>`;
  chat.insertAdjacentHTML("beforeend", html);
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
  }
  inp.value = await getCurrentTab();
});
