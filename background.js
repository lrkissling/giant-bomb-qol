// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

// Call on initial load and then set on a five minute schedule
getOptions();
setInterval(getOptions, 2 * 60 * 1000);

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
      // located in updateStreamStatus.js
      UpdateStreamStatus(data.results);
    }
  });
}

function onError(error) {
  console.log(`Error: ${error}`);
}
