// Opens the chat page and closes the pop-up.
$(document).on("click", ".chat", function() {
  window.open("https://www.giantbomb.com/chat/");
  window.close();
});

// Opens the infinite page and closes the pop-up.
$(document).on("click", ".infinite", function() {
  window.open("https://www.giantbomb.com/infinite/");
  window.close();
});

// Opens the options page and closes the pop-up.
$("#options_link").click(function() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.runtime.openOptionsPage();
  } else {
    browser.runtime.openOptionsPage();
  }

  window.close();
});

// Opens the appropriate store page and closes the pop-up.
$("#store_page").click(function() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    window.open("https://chrome.google.com/webstore/detail/giant-bomb-qol/ciipbadfpnjpnnjchpeaiilodeeeekam");
  } else {
    window.open("https://addons.mozilla.org/en-US/firefox/addon/giant-bomb-qol/");
  }

  window.close();
});

var optionNames = [
  "api_key",
  "stream_notifications",
  "is_live_streaming",
  "is_infinite",
  "stream_title",
  "stream_image"
];

// Capture api key input from the popup box
var apiKey = document.querySelector("#text_api_key");

// Whenever the key length hits 40, verify the key and save
$("#text_api_key").on("input", function() {
  if(apiKey.value.trim().length === 40){
    testKey(apiKey.value.trim());
  }
})

// Hit the chats endpoint to see if the key works, 100 means invalid key
async function testKey(api_key){
  $.ajax({
    url: "https://www.giantbomb.com/api/chats/",
    dataType: "json",
    data: { api_key: api_key,
            format: "json"
          },
    success: function(data) {
      if(data.status_code === 100){
        console.log("Invalid api key! " + api_key);
        document.getElementById("text_api_key").style.borderColor = "red";
      }
      else{
        saveKey(api_key, data.results);
      }
    }
  });
}

// Save the api key to synced storage
function saveKey(api_key, results){
  // Change the border color to green to indicate correct length
  document.getElementById("text_api_key").style.borderColor = "green";
  // Store the key based on browser, then redraw the panel upon reopen
  if (navigator.userAgent.indexOf("Chrome") != -1){
    chrome.storage.sync.set({"api_key": api_key});
    updateStreamStatus(results);
    chrome.storage.sync.get(optionNames, handleOptions);
  }
  else{
    browser.storage.sync.set({"api_key": api_key});
    updateStreamStatus(results);
    browser.storage.sync.get(optionNames, handleOptions);
  }
}

/*
// Toggle stream notifications
 $("#stream_notifications").click(function(){

  // Pull up user options for stream notifications based on browser
  if(navigator.userAgent.indexOf("Chrome") != -1){
    // Grab the stream notifications value from storage, flip it, save it, then handle options
    chrome.storage.sync.get(optionNames,function(ops){
      chrome.storage.sync.set({"stream_notifications": !ops.stream_notifications}, function(){
        chrome.storage.sync.get(optionNames, function(ops){
          console.log(ops);
          handleOptions(ops);
        });
      });
    });
  }
  else{
    browser.storage.sync.get(optionNames,function(ops){
      browser.storage.sync.set({"stream_notifications": !ops.stream_notifications}, function(){
        browser.storage.sync.get(optionNames, handleOptions, onError);
      });
    },onError);
  }

});
*/

// Gets necessary user options. Handled differently by Chrome/Firefox.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(optionNames, handleOptions);
} else {
  getting = browser.storage.sync.get(optionNames);
  getting.then(handleOptions, onError);
}

function handleOptions(options) {
  // Check api key validity
  if(options.api_key !== undefined &&
     options.api_key.length === 40){
      // Display proper html depending on whether or not there is a livestream
      if(options.stream_notifications === undefined || options.stream_notifications) {
        // If notifications are enabled, display the stream notification html
        if(options.is_live_streaming || options.is_infinite){
          $("#stream_title").html(options.stream_title);
          $("#stream_image").attr("src", options.stream_image);
          $("#stream_image").addClass(options.is_live_streaming ? "chat" : "infinite");
          // Light up the notifications button to show that notifications are on
          //$("#stream_notifications").css("backgroundColor", "green");
          // If the stream image was previously hidden, show it and hide the disabled message
          $("#live_stream_info").css("display", "block");
          $("#stream_image").css("display","block");
          $("#notifications_disabled").css("display", "none");
        }
        // If there's no stream, inform the user
        else{
          $("no_stream").css("display", "block");
        }
      }
      // Otherwise, dim the notifications button and inform the user that notifications are disabled
      else{
        //$("#stream_notifications").css("backgroundColor", "#3a3c3c");
        // Disable the stream info on the fly
        $("#stream_image").css("display","none");
        $("#live_stream_info").css("display","none");
        $("#notifications_disabled").css("display", "block");
      }
  }
  // Otherwise, API key was not valid, inform user
  else{
    $("#check_options").css("display", "block");
  }
}

// TODO: Refactor this function and the one in background to an exterior file
/**
* Parse results of API calls to determine browserAction icon appearance and
* store necessary information for retrieval by the popup.
*/
function updateStreamStatus(results) {
  let is_live_streaming = false,
      is_infinite = false,
      stream_info = null;
  for (var key in results) {
    stream_info = results[key];
    if (stream_info.title != "Giant Bomb Infinite") {
      is_live_streaming = true;
      break;
    } else {
      is_infinite = true;
    }
  }

  let options = {
    is_live_streaming : is_live_streaming,
    is_infinite : is_infinite
  };

  if (is_live_streaming || is_infinite) {
    options.stream_title = stream_info.title;
    options.stream_image = stream_info.image.small_url;
  }

  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.set(options);
    chrome.browserAction.setIcon({
      path: { 38: is_live_streaming ? "img/gb-live.png" : "img/gb-offair.png" }
    });
    chrome.browserAction.setTitle({
      title: is_live_streaming ? "Giant Bomb is Live!" : "Giant Bomb QoL"
    });
  }
  else{
    browser.storage.sync.set(options);
    browser.browserAction.setIcon({
      path: { 38: is_live_streaming ? "img/gb-live.png" : "img/gb-offair.png" }
    });
    browser.browserAction.setTitle({
      title: is_live_streaming ? "Giant Bomb is Live!" : "Giant Bomb QoL"
    });
  }

}

function onError(error) {
  console.log(`Error: ${error}`);
}
