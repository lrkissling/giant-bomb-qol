var isLive = false,
    chatURL = "https://www.giantbomb.com/chat/";

setInterval(checkForLiveShow, 10 * 1000);

function checkForLiveShow() {
  isLive = !isLive;
  updateIcon();
}

function updateIcon() {
  if (isLive) {
    browser.browserAction.setIcon({
      path: { 38: "img/gb-live.png" }
    });
    browser.browserAction.setTitle({
      title: "Giant Bomb is Live!"
    });
  }
  else {
    browser.browserAction.setIcon({
      path: { 38: "img/gb-offair.png" }
    });
    browser.browserAction.setTitle({
      title: "Giant Bomb is off-air."
    });
  }
}

browser.browserAction.onClicked.addListener(navigateIfLive);

function navigateIfLive() {
  if (isLive) browser.tabs.create({ url: chatURL });
}
