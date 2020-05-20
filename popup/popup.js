if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

const OPTIONS = [
  "api_key",
  "stream_notifications",
  "is_live_streaming",
  "is_infinite",
  "streams"
];

// Gets necessary user options. Handled differently by Chrome/Firefox.
if (browser == chrome) {
  browser.storage.sync.get(OPTIONS, handleOptions);
} else {
  getting = browser.storage.sync.get(OPTIONS);
  getting.then(handleOptions, onError);
}

// Opens the appropriate stream page and closes the pop-up.
$(document).on("click", ".live_stream_info", function() {
  window.open($(this).attr('href'));
  window.close();
});

// Opens the options page and closes the pop-up.
$("#options_link").click(function() {
  browser.runtime.openOptionsPage();
  window.close();
});

// Opens the appropriate store page and closes the pop-up.
$("#store_page").click(function() {
  if (browser == chrome) {
    window.open("https://chrome.google.com/webstore/detail/giant-bomb-qol/ciipbadfpnjpnnjchpeaiilodeeeekam");
  } else {
    window.open("https://addons.mozilla.org/en-US/firefox/addon/giant-bomb-qol/");
  }

  window.close();
});

// Whenever the API key length hits 40, verify the key and save
$("#text_api_key").on("input", function() {
  if (this.value.trim().length === 40) {
    testKey(this.value.trim());
  } else {
    $("#text_api_key").removeClass("invalid");
  }
});

// Hit the chats endpoint to see if the key works, 100 means invalid key
async function testKey(api_key) {
  $.ajax({
    url: "https://www.giantbomb.com/api/chats/",
    dataType: "json",
    data: { api_key: api_key,
            format: "json"
          },
    success: function(data) {
        saveKey(api_key, data.results);
    },
    error: function(data) {
      $("#text_api_key").addClass("invalid");
      if (data.status_code == 100) {
        console.log("Invalid api key! " + api_key);
      } else {
        onError(data);
      }
    }
  });
}

// Save the api key to synced storage
function saveKey(api_key, results){
  browser.storage.sync.set({"api_key": api_key});
  browser.storage.sync.set({"stream_notifications": true});

  // located in updateStreamStatus.js
  UpdateStreamStatus(results);

  if (browser == chrome) {
    browser.storage.sync.get(OPTIONS, handleOptions);
  } else {
    getting = browser.storage.sync.get(OPTIONS);
    getting.then(handleOptions, onError);
  }
}

function handleOptions(options) {
  // Check api key validity
  if (options.api_key !== undefined &&
     options.api_key.length === 40) {
      // Display proper html depending on whether or not there is a livestream
      if (options.stream_notifications === undefined || options.stream_notifications) {
        // If notifications are enabled, display the stream notification html
        if (options.is_live_streaming || options.is_infinite) {
          const gbi_logo_display = options.is_live_streaming ? "none" : "block";

          for (let i = 0; i < options.streams.length; i++) {
            // if Giant Bomb is live-streaming, don't include GB Infinite
            if (options.is_live_streaming && options.streams[i].url == "https://www.giantbomb.com/infinite") {
              continue;
            }

            // add stream to appropriate spot in popup
            if ([0,1].includes(i)) {
              $("#first_row").append(
                $(`<div class="live_stream_info popup-buttons" href=${options.streams[i].url}>`).append(
                  $(`<img id="stream_image" class="stream-link", src="${options.streams[i].image}">`),
                  $(`<img id="gb_infinite_logo" src="../img/gb-infinite.png" class="stream-link ${gbi_logo_display}">`),
                  $(`<h2 id="stream_title" class="popup-font stream-link">`).append(options.streams[i].title)
                )
              );
            } else if ([2,3].includes(i)) {
              $("#second_row").append(
                $(`<div class="live_stream_info popup-buttons" href=${options.streams[i].url}>`).append(
                  $(`<img id="stream_image" class="stream-link", src="${options.streams[i].image}">`),
                  $(`<img id="gb_infinite_logo" src="../img/gb-infinite.png" class="stream-link ${gbi_logo_display}">`),
                  $(`<h2 id="stream_title" class="popup-font stream-link">`).append(options.streams[i].title)
                )
              );
            }
          }

          // If the stream image was previously hidden, show it and hide the disabled message
          $(".live_stream_info").css("display", "block");
          $("#stream_image").css("display","block");
          $("#notifications_disabled").css("display", "none");
          $("#check_options").css("display", "none");
        }
        // If there's no stream, inform the user
        else {
          $("no_stream").css("display", "block");
          $("#notifications_disabled").css("display", "none");
        }
      }
      else {
        // Disable the stream info on the fly
        $("#stream_image").css("display","none");
        $(".live_stream_info").css("display","none");
        $("#notifications_disabled").css("display", "block");
      }
  }
  // Otherwise, API key was not valid, inform user
  else {
    $("#check_options").css("display", "block");
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}
