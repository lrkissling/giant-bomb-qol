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

// Handle mouseover of all infobuttons
$(".option-infobutton-container").on("mouseover", function() {
  $(this).find(".option-infobutton-text").css("display", "block");
});

// Handle mouseout of all infobuttons
$(".option-infobutton-container").on("mouseout", function() {
  $(this).find(".option-infobutton-text").css("display", "none");
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
// This button fires off the saveKey function
var activateButton = document.querySelector("#submit_key");
activateButton.addEventListener("click", saveKey);

// Save the api key to synced storage
function saveKey(e){
  e.preventDefault();

  var newKey = apiKey.value.trim();
  
  // Only save if the key is the proper length
  if(newKey.length === 40){
    // Change the border color to green to indicate correct length
    document.getElementById("text_api_key").style.borderColor = "green";
    // Store the key based on browser, then redraw the panel upon reopen
    if (navigator.userAgent.indexOf("Chrome") != -1){
      chrome.storage.sync.set({"api_key": newKey}, handleOptions);
    }
    else{
      browser.storage.sync.set({"api_key": newKey}, handleOptions);
    }
  }
  else{
    document.getElementById("text_api_key").style.borderColor = "red";
  }
}

console.log("made it here.");

// Gets necessary user options. Handled differently by Chrome/Firefox.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(optionNames, handleOptions);
} else {
  getting = browser.storage.sync.get(optionNames);
  getting.then(handleOptions, onError);
}

/**
* Display appropriate html in pop-up depending on info stored in options.
*/
function handleOptions(options) {
  console.log("made it to start of handleOptions");
  if (options.api_key !== undefined &&
      options.api_key.length === 40 &&
      (options.stream_notifications === undefined || options.stream_notifications)) {
    if (options.is_live_streaming || options.is_infinite) {
      console.log("made it to inside if statement");
      $("#stream_title").html(options.stream_title);
      $("#stream_image").attr("src", options.stream_image);
      $("#stream_image").addClass(options.is_live_streaming ? "chat" : "infinite");
      $("#live_stream_info").css("display", "block");
      console.log(options);
    } else {
      $("#no_stream").css("display", "block");
    }
  } else {
    $("#check_options").css("display", "block");
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}
