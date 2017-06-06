$(".stream-link").click(function() {
  window.open("https://www.giantbomb.com/chat/");
  window.close();
});

$("#options_link").click(function() {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.runtime.openOptionsPage();
  } else {
    browser.runtime.openOptionsPage();
  }

  window.close();
});

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
  "is_streaming",
  "stream_title",
  "stream_image"
];

if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(optionNames, handleOptions);
} else {
  getting = browser.storage.sync.get(optionNames);
  getting.then(handleOptions, onError);
}

function handleOptions(options) {
  if (options.api_key !== undefined &&
      options.api_key.length === 40 &&
      (options.stream_notifications === undefined || options.stream_notifications)) {
    if (options.is_streaming) {
      $("#stream_title").html(options.stream_title);
      $("#stream_image").attr("src", options.stream_image);
      $("#live_stream_info").css("display", "block");
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
