// Populate the options page with stored settings after page has loaded
$(document).ready(restoreOptions);

if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

var apiKey              = document.querySelector("#text_api_key"),
    streamNotifications = document.querySelector("#cbox_stream_notifications"),
    prevNextVids        = document.querySelector("#cbox_prev_next_vids"),
    hideTitrSpoilers    = document.querySelector("#cbox_hide_titr_spoilers"),
    chatEmotes          = document.querySelector("#cbox_chat_emotes");

// Invoke saveOptions whenever an option is changed
$(apiKey).on("input", saveOptions);
$(streamNotifications).on("change", saveOptions);
$(prevNextVids).on("change", saveOptions);
$(hideTitrSpoilers).on("change", saveOptions);
$(chatEmotes).on("change", saveOptions);

// Handle mouseover of all infobuttons
$(".option-infobutton-container").on("mouseover", function() {
  $(this).find(".option-infobutton-text").css("display", "block");
});

// Handle mouseout of all infobuttons
$(".option-infobutton-container").on("mouseout", function() {
  $(this).find(".option-infobutton-text").css("display", "none");
});

/**
* Save the user options to synced storage.
*/
function saveOptions(e) {
  e.preventDefault();

  // uncheck and disable Stream Notification checkbox if API key become invalid.
  streamNotifications.checked = streamNotifications.checked && hasValidKey();
  streamNotifications.disabled = !hasValidKey();

  let options = {
    api_key: apiKey.value.trim(),
    stream_notifications: streamNotifications.checked,
    prev_next_vids: prevNextVids.checked,
    hide_titr_spoilers: hideTitrSpoilers.checked,
    chat_emotes: chatEmotes.checked
  };

  // Firefox and Chrome handle storage get and set differently
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.set(options, function() {
      console.log("Saved: " + JSON.stringify(options));
    });
  } else {
    browser.storage.sync.set(options);
  }

  // Ensure that the user sees the correct browserAction icon
  if (options.api_key.length !== 40 || !options.stream_notifications) {
    browser.browserAction.setIcon({
      path: { 38: "../img/gb-offair.png" }
    });
    browser.browserAction.setTitle({
      title: ""
    });
  }
}

/**
* Ensures that the user has entered a key 40 characters in length.
*/
function hasValidKey() {
  if (apiKey.value.trim().length === 40) return true;
  return false;
}

/**
* Populate the options page with the user's saved options
*/
function restoreOptions() {

  // Set the API Key according to user option, default to empty if null
  function setApiKey(result) {
    if (result.api_key) {
      apiKey.value = result.api_key;
    }
  }

  // Set the Stream Notifications checbox according to user option.
  // Default to checked if valid API key, otherwise default to unchecked.
  function setStreamNotifications(result) {
    if (result.stream_notifications !== undefined) {
      streamNotifications.checked = result.stream_notifications;
    } else {
      streamNotifications.checked = hasValidKey();
    }

    streamNotifications.disabled = !hasValidKey();
  }

  // Set the Prev/Next Vids checkbox according to user option, default to checked if null
  function setPrevNextVids(result) {
    if (result.prev_next_vids !== undefined) {
      prevNextVids.checked = result.prev_next_vids;
    } else {
      prevNextVids.checked = true;
    }
  }

  // Set the Hide TITR Spoilers checkbox according to user option, default to checked if null
  function setHideTitrSpoilers(result) {
    if (result.hide_titr_spoilers !== undefined) {
      hideTitrSpoilers.checked = result.hide_titr_spoilers;
    } else {
      hideTitrSpoilers.checked = true;
    }
  }

  // Set the Chat Emotes checkbox according to user option, default to checked if null
  function setChatEmotes(result) {
    if (result.chat_emotes !== undefined) {
      chatEmotes.checked = result.chat_emotes;
    } else {
      chatEmotes.checked = true;
    }
  }

  // Firefox and Chrome handle storage get and set differently
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.get("api_key", setApiKey);
    chrome.storage.sync.get("stream_notifications", setStreamNotifications);
    chrome.storage.sync.get("prev_next_vids", setPrevNextVids);
    chrome.storage.sync.get("hide_titr_spoilers", setHideTitrSpoilers);
    chrome.storage.sync.get("chat_emotes", setChatEmotes);
  } else {
    browser.storage.sync.get("api_key").then(setApiKey, onError);
    browser.storage.sync.get("stream_notifications").then(setStreamNotifications, onError);
    browser.storage.sync.get("prev_next_vids").then(setPrevNextVids, onError);
    browser.storage.sync.get("hide_titr_spoilers").then(setHideTitrSpoilers, onError);
    browser.storage.sync.get("chat_emotes").then(setChatEmotes, onError);
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }
}
