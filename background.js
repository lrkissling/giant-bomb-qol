if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

getOptions();
setInterval(getOptions, 5 * 60 * 1000);

function getOptions() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.get(["api_key", "stream_notifications"], handleOptions);
  } else {
    getting = browser.storage.sync.get(["api_key", "stream_notifications"]);
    getting.then(handleOptions, onError);
  }
}

function handleOptions(options) {
  if (options.api_key !== undefined &&
      options.api_key.length === 40 &&
      (options.stream_notifications === undefined || options.stream_notifications)) {
    checkForLiveShow(options.api_key);
  }
}

function checkForLiveShow(api_key) {
  $.ajax({
    url: "https://www.giantbomb.com/api/chats/",
    dataType: "json",
    data: { api_key: api_key,
            format: "json"
          },
    success: function(data) {
      let isLive = data.results.length > 0 ? true : false;
      updateStreamStatus(isLive, data.results);
    }
  });
}

function updateStreamStatus(isLive, results) {
  let options = {
    is_streaming : isLive
    // is_streaming : true
  };

  if (isLive) {
    browser.browserAction.setIcon({
      path: { 38: "img/gb-live.png" }
    });
    browser.browserAction.setTitle({
      title: "Giant Bomb is Live!"
    });

    options.stream_title = results[0].title;
    options.stream_image = results[0].image.small_url;
  }
  else {
    browser.browserAction.setIcon({
      path: { 38: "img/gb-offair.png" }
    });
    browser.browserAction.setTitle({
      title: "Giant Bomb is off-air."
    });

    // options.stream_title = "Big Trouble on Murder Island [LIVE!]";
    // options.stream_image = "https://www.giantbomb.com/api/image/scale_small/2934819-murderisland.jpg";
  }

  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.set(options, function() {
      console.log("Saved: " + JSON.stringify(options));
    });
  }
  else {
    browser.storage.sync.set(options);
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}
