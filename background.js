// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

// Call on initial load and then set on a five minute schedule
getOptions();
setInterval(getOptions, 5 * 60 * 1000);

/**
* Retrieve user options. Chrome and Firefox handle this differently.
*/
function getOptions() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.get(["api_key", "stream_notifications"], handleOptions);
  } else {
    getting = browser.storage.sync.get(["api_key", "stream_notifications"]);
    getting.then(handleOptions, onError);
  }
}

/**
* Check for Live Show when user has provided API key and has option turned on.
*/
function handleOptions(options) {
  if (options.api_key !== undefined &&
      options.api_key.length === 40 &&
      (options.stream_notifications === undefined || options.stream_notifications)) {
    checkForLiveShow(options.api_key);
  }
}

/**
* Make live show API call and send results to updateStreamStatus.
*/
function checkForLiveShow(api_key) {
  $.ajax({
    url: "https://www.giantbomb.com/api/chats/",
    dataType: "json",
    data: { api_key: api_key,
            format: "json"
          },
    success: function(data) {
      updateStreamStatus(data.results);
    }
  });
}

/**
* Parse results of API calls to determine browserAction icon appearance and
* store necessary information for retrieval by the popup.
*/
function updateStreamStatus(results) {
  let options = {
    is_streaming : results.length > 0 ? true : false
  };

  if (options.is_streaming) {
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

  browser.storage.sync.set(options);
}

function onError(error) {
  console.log(`Error: ${error}`);
}
