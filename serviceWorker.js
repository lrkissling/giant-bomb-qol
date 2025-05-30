// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
  importScripts('./updateStreamStatus.js')
}

const liveShowAlarm = "live-show-alarm";

// Call on initial load of servicerWorker
liveShowHandler();

// Make sure alarm is set up
checkAlarmState(liveShowAlarm);

// Every time the live show alarm triggers, call liveShowHandler() again
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === liveShowAlarm) {
    liveShowHandler();
  }
})

/**
 * Checks whether the given alarm exists. Creates it if it doesn't.
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
 * Gets user's options for web extension
 * 
 * @returns options object, or null
 */
async function getOptions() {
  try {
    const options = await browser.storage.sync.get(["api_key", "stream_notifications"]);
    return options;
  } catch (e) {
    onError(e);
    return null;
  }
}

/**
 * Checks user options to see if they have appropriate values for checking GB API for live shows.
 * 
 * @param {object} options web extension options object
 * @returns boolean whether to check for live shows
 */
async function shouldCheckForLiveShows(options) {
  const HOST_PERMISSION = { origins: ["*://*.giantbomb.com/api/*"] };
  const containsHostPermission = await browser.permissions.contains(HOST_PERMISSION);
  if (!containsHostPermission) {
    return false;
  }

  return (
    options &&
    options.api_key !== undefined &&
    options.api_key.length === 40 &&
    (options.stream_notifications === undefined || options.stream_notifications)
  );
 };

/**
 * Fetches live show results from Giant Bomb API.
 * 
 * @param {string} api_key 
 * @returns array of results matching GB API spec for /chats:
 *   - https://www.giantbomb.com/api/documentation/#toc-0-7
 */
function fetchLiveShows(api_key) {
  const params = new URLSearchParams({
    api_key,
    format: "json",
  });

  const results = fetch(`https://www.giantbomb.com/api/chats/?${params}`)
    .then((resp) => {
      if (!resp.ok) {
        console.error(`HTTP error! Status: ${resp.status}`)
        return null;
      }

      return resp.json()
    })
    .then(data => data ? data.results : null);
  return results;
}

/**
* Handles logic for checking for live shows:
*  - Fetches user options and verifies it should check for live show
*  - Initiates API request for live show info
*  - Sneds results of API call to updateStreamStatus
*/
async function liveShowHandler() {
  const options = await getOptions();
  const hasPermission = await shouldCheckForLiveShows(options);

  if (hasPermission) {
    const results = await fetchLiveShows(options.api_key);
    if (results) {
      updateStreamStatus(results);
    }
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}
