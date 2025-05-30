// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
  importScripts('./updateStreamStatus.js')
}

const liveShowAlarm = "live-show-alarm";

// Call on initial load of servicerWorker
getOptions();

// Make sure alarm is set up
checkAlarmState(liveShowAlarm);

// Every time the live show alarm triggers, call getOptions() again
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === liveShowAlarm) {
    getOptions();
  }
})

/**
 * Checks whether the given alarm exists. Creates it if it doesn't
 * 
 * @param {string} alarmName name of alarm
 */
async function checkAlarmState(alarmName) {
  const alarm = await browser.alarms.get(alarmName);

  if (!alarm) {
    await chrome.alarms.create(alarmName, { periodInMinutes: 2 });
  }
}

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
  const params = new URLSearchParams({
    api_key,
    format: "json",
  });

  fetch(`https://www.giantbomb.com/api/chats/?${params}`)
    .then((resp) => {
      if (!resp.ok) {
        console.error(`HTTP error! Status: ${resp.status}`)
      }

      return resp.json()
    })
    .then(data => updateStreamStatus(data.results));
}

function onError(error) {
  console.error(`Error: ${error}`);
}
