var isLive = false;

browser.browserAction.onClicked.addListener(toggleButton);

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

function toggleButton() {
  isLive = !isLive;
  updateIcon();
}
