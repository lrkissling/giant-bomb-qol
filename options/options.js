// Populate the options page with stored settings after page has loaded
$(document).ready(restoreOptions);

if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

var apiKey              = document.querySelector("#text_api_key"),
    streamNotifications = document.querySelector("#cbox_stream_notifications"),
    hideTitrSpoilers    = document.querySelector("#cbox_hide_titr_spoilers"),
    gbChatStyle         = document.querySelector("#cbox_gb_chat_style"),
    pollSound           = document.querySelector("#cbox_gbforever_poll_sound");

// Invoke saveOptions whenever an option is changed
$(apiKey).on("input", saveOptions);
$(streamNotifications).on("change", saveOptions);
$(hideTitrSpoilers).on("change", saveOptions);
$(gbChatStyle).on("change", saveOptions);
$(pollSound).on("change", saveOptions);

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
    hide_titr_spoilers: hideTitrSpoilers.checked,
    gb_chat_style: gbChatStyle.checked,
    gbforever_poll_sound: pollSound.checked,
  };

  browser.storage.sync.set(options);

  // Ensure that the user sees the correct toolbar icon
  if (options.api_key.length !== 40 || !options.stream_notifications) {
    browser.action.setIcon({
      path: { 38: "../img/gb-offair.png" }
    });
    browser.action.setTitle({
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

  function setHideTitrSpoilers(result) {
    if (result.hide_titr_spoilers !== undefined) {
      hideTitrSpoilers.checked = result.hide_titr_spoilers;
    } else {
      hideTitrSpoilers.checked = true;
    }
  }

  function setGbChatStyle(result) {
    if (result.gb_chat_style !== undefined) {
      gbChatStyle.checked = result.gb_chat_style;
    } else {
      gbChatStyle.checked = true;
    }
  }

  function setGbForeverPollSound(result) {
    if (result.gbforever_poll_sound !== undefined) {
      pollSound.checked = result.gbforever_poll_sound;
    } else {
      pollSound.checked = true;
    }
  }

  browser.storage.sync.get("api_key").then(setApiKey, onError);
  browser.storage.sync.get("stream_notifications").then(setStreamNotifications, onError);
  browser.storage.sync.get("hide_titr_spoilers").then(setHideTitrSpoilers, onError);
  browser.storage.sync.get("gb_chat_style").then(setGbChatStyle, onError);
  browser.storage.sync.get("gbforever_poll_sound").then(setGbForeverPollSound, onError);

  function onError(error) {
    console.error(`Error: ${error}`);
  }
}
