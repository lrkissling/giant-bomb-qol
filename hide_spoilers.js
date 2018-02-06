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
    // Ensure that the video is a TITR video
    if ($("#site-main h2").first().text().toUpperCase().includes("THIS IS THE RUN")) {
      hideVideoSpoilers();
    }

    hideThumbnailSpoilers();
  }
}

// Hides the timestamp and progress buffer of the video.
function hideVideoSpoilers() {
  $(".av-buffer").first().addClass("qol-hidden");
  $(".js-vid-buffer.av-buffer-wrap").first().addClass("qol-hidden");
  $(".js-vid-position.av-position").first().addClass("qol-hidden");
  $(".av-time").first().addClass("qol-hidden");
}

// Hides timestamps from video thumbnails
function hideThumbnailSpoilers() {
  // if it's the TITR show page, hide every thumbnail timestamp and comments count
  if (window.location.href.includes("giantbomb.com/shows/this-is-the-run/")) {
    $(".overlay-stats i:first-child").css("display", "none");
    $(".overlay-stats i:last-child").css("display", "none");
  }
  // otherwise, only hide timestamps and comments counts from thumbnails for TITR videos
  else {
    $(".primary-content li a").each(function() {
      if (this.href.includes("this-is-the-run")) {
        $(this).find(".editorial-stats .icon-comments").css("display", "none");
      }
    });
  }
}
