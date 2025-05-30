// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

hideSpoilersHandler();

/**
 * Gets user's options for web extension
 * 
 * @returns options object, or null
 */
async function getOptions() {
  try {
    const options = await browser.storage.sync.get("hide_titr_spoilers");
    return options;
  } catch (e) {
    onError(e);
    return null;
  }
}

/**
 * Based on provided options object, determines whether to hide spoilers
 * 
 * @param {object} options webextensions options object
 * @returns boolean whether to hide spoilers
 */
const shouldHideSpoilers = options => options.hide_titr_spoilers === undefined || options.hide_titr_spoilers;

/**
 * Handler for the hide_spoilers content script. This handler does the following:
 *   - gets user options for hiding spoilers
 *   - checks if user wants to hide spoilers
 *   - hide spoilers
 */
async function hideSpoilersHandler() {
  const options = await getOptions();
  if (shouldHideSpoilers(options)) {
    hideSpoilers();
  }
}

/**
 * Hides spoiler elements from appropriate video pages
 */
function hideSpoilers() {
  const episode_title = $("div.episode-content > h1").text().toUpperCase();
  if (episode_title.match(/.*^(THIS IS THE RUN|GOING ROGUE).*$/)) {
    hideVideoSpoilers();
    // need a minor timeout to ensure thumbnail vids are rendered
    setTimeout(hideThumbnailSpoilers, 1 * 1000);
  }

  // look for video cards for TITR & Going Rogue videos and hide timestamp.
  $("div.card-byline:contains('This Is the Run')").each(function() {
    $(this).siblings().first().find("span.position-bottom-left span.horizontal-spacing").first().css("display", "none");
    $(this).siblings().find("div.content-progress").css("display", "none");
  });
  $("div.card-byline:contains('Going Rogue')").each(function() {
    $(this).siblings().first().find("span.position-bottom-left span.horizontal-spacing").first().css("display", "none");
    $(this).siblings("div.content-progress").css("display", "none");
  });
}

// Hides the timestamp and progress buffer of the video.
function hideVideoSpoilers() {
  $(".av-buffer").first().addClass("qol-hidden");
  $(".js-progress-buffer.av-buffer-wrap").first().addClass("qol-hidden");
  $(".js-progress-loaded.av-loaded").first().addClass("qol-hidden");
  $(".js-progress-position.av-position").first().addClass("qol-hidden");
  $(".av-time").first().addClass("qol-hidden");
}

// Hides timestamps from video thumbnails
function hideThumbnailSpoilers() {
  $("span.position-bottom-left span.horizontal-spacing").css("display", "none");
  $("div.content-progress").css("display", "none");
}

function onError(error) {
  console.error(`Error: ${error}`);
}