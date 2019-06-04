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
    // Ensure that the video is a TITR video, then hide appropriate elements.
    if ($("h2.topslot-show-title").text().toUpperCase().includes("THIS IS THE RUN")) {
      hideVideoSpoilers();
      hideThumbnailSpoilers();
    }

    // look for video cards for TITR videos and hide timestamp.
    $("div.card-byline:contains('This Is the Run')").each(function() {
      $(this).siblings().first().find("span.bottom-left-card").first().addClass("qol-hidden");
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
  $("span.bottom-left-card span.horizontal-spacing").css("display", "none");
}
