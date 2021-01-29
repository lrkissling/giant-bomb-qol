if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get("hide_titr_spoilers", handleOptions);
} else {
  browser.storage.sync.get("hide_titr_spoilers").then(handleOptions, onError);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// Check that they want to hide spoilers
function handleOptions(items) {
  if (items.hide_titr_spoilers === undefined || items.hide_titr_spoilers) {
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
