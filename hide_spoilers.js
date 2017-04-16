// options currently only work for Chrome
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get("hide_titr_spoilers", handleOptions);
}
else hideSpoilers();

// Check that they want to hide spoilers
function handleOptions(item) {
  if (item.hide_titr_spoilers === undefined || item.hide_titr_spoilers) {
    hideSpoilers();
  }
}

function hideSpoilers() {
  let div = document.getElementsByClassName("av-buffer")[0];
  div.classList.add("qol-hidden");

  div = document.getElementsByClassName("js-vid-buffer")[0];
  div.classList.add("qol-hidden");

  div = document.getElementsByClassName("av-time")[0];
  div.classList.add("qol-hidden");
}
