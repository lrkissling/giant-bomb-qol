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
  let is_streaming = false,
      stream_info = null;
  for (var key in results) {
    stream_info = results[key];
    if (stream_info.title != "Giant Bomb TV") {
      is_streaming = true;
      break;
    }
  }

  let options = {
    is_streaming : is_streaming,
    stream_title : stream_info.title,
    stream_image : stream_info.image.small_url
  };

  if (options.is_streaming) {
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

  browser.storage.sync.set(options);
}

function onError(error) {
  console.log(`Error: ${error}`);
}
