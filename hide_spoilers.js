// options currently only work for Chrome
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get("hide_titr_spoilers", handleOptions);
}
else {
  hideSpoilerElements();
}

// Check that they want to hide spoilers
function handleOptions(items) {
  if (items.hide_titr_spoilers === undefined || items.hide_titr_spoilers) {
    hideSpoilerElements();
  }
}

function hideSpoilerElements() {
  let div = document.getElementsByClassName("av-buffer")[0];
  div.classList.add("qol-hidden");

  div = document.getElementsByClassName("js-vid-buffer av-buffer-wrap")[0];
  div.classList.add("qol-hidden");

  div = document.getElementsByClassName("js-vid-position av-position")[0];
  div.classList.add("qol-hidden");

  div = document.getElementsByClassName("av-time")[0];
  div.classList.add("qol-hidden");
}
