/**
* Save the checkbox checked values to local storage
*/
function saveOptions(e) {
  e.preventDefault();
  console.log("chrome test!");
  let options = {
    api_key: document.querySelector("#text_api_key").value.trim(),
    prev_next_vids: document.querySelector("#cbox_prev_next_vids").checked,
    hide_titr_spoilers: document.querySelector("#cbox_hide_titr_spoilers").checked,
    chat_emotes: document.querySelector("#cbox_chat_emotes").checked
  };

  // Firefox and Chrome handle storage get and set differently
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.set(options, function() {
      console.log("Saved: " + JSON.stringify(options));
    });
  } else {
    browser.storage.sync.set(options);
  }
}

// Invoke saveOptions whenever an option is changed
document.querySelector("#text_api_key").addEventListener("change", saveOptions);
document.querySelector("#cbox_prev_next_vids").addEventListener("change", saveOptions);
document.querySelector("#cbox_hide_titr_spoilers").addEventListener("change", saveOptions);
document.querySelector("#cbox_chat_emotes").addEventListener("change", saveOptions);


// Handle mouseover/mouseout of all infobuttons
var elems = document.getElementsByClassName("option-infobutton-container");
Array.from(elems).forEach(function(e) {
  e.addEventListener("mouseover",function() {
    Array.from(this.getElementsByClassName("option-infobutton-text")).forEach(function(t) {
      t.style.display = "block";
    });
  });
  e.addEventListener("mouseout", function() {
    Array.from(this.getElementsByClassName("option-infobutton-text")).forEach(function(t) {
      t.style.display = "none";
    });
  });
});


/**
* Populate the options page with the user's saved options
*/
function restoreOptions() {

  // Set the API Key according to user option, default to empty if null
  function setApiKey(result) {
    if (result.api_key) {
      document.querySelector("#text_api_key").value = result.api_key;
    }
  }

  // Set the Prev/Next Vids checkbox according to user option, default to checked if null
  function setPrevNextVids(result) {
    if (result.prev_next_vids !== undefined) {
      document.querySelector("#cbox_prev_next_vids").checked = result.prev_next_vids;
    } else {
      document.querySelector("#cbox_prev_next_vids").checked = true;
    }
  }

  // Set the Hide TITR Spoilers checkbox according to user option, default to checked if null
  function setHideTitrSpoilers(result) {
    if (result.hide_titr_spoilers !== undefined) {
      document.querySelector("#cbox_hide_titr_spoilers").checked = result.hide_titr_spoilers;
    } else {
      document.querySelector("#cbox_hide_titr_spoilers").checked = true;
    }
  }

  // Set the Chat Emotes checkbox according to user option, default to checked if null
  function setChatEmotes(result) {
    if (result.chat_emotes !== undefined) {
      document.querySelector("#cbox_chat_emotes").checked = result.chat_emotes;
    } else {
      document.querySelector("#cbox_chat_emotes").checked = true;
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // Firefox and Chrome handle storage get and set differently
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    chrome.storage.sync.get("api_key", setApiKey);
    chrome.storage.sync.get("prev_next_vids", setPrevNextVids);
    chrome.storage.sync.get("hide_titr_spoilers", setHideTitrSpoilers);
    chrome.storage.sync.get("chat_emotes", setChatEmotes);
  } else {
    let getting = browser.storage.sync.get("api_key");
    getting.then(setApiKey, onError);

    getting = browser.storage.sync.get("prev_next_vids");
    getting.then(setPrevNextVids, onError);

    getting = browser.storage.sync.get("hide_titr_spoilers");
    getting.then(setHideTitrSpoilers, onError);

    getting = browser.storage.sync.get("chat_emotes");
    getting.then(setChatEmotes, onError);
  }
}

// Populate the options page with stored settings after DOM is loaded
document.addEventListener("DOMContentLoaded", restoreOptions);
