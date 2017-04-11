/**
* Save the checkbox checked values to local storage
*/
function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    api_key: document.querySelector("#text_api_key").value.trim(),
    prev_next_vids: document.querySelector("#cbox_prev_next_vids").checked,
    chat_emoji: document.querySelector("#cbox_chat_emoji").checked
  });
}

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

// Invoke saveOptions whenever an option is changed
document.querySelector("#text_api_key").addEventListener("change", saveOptions);
document.querySelector("#cbox_prev_next_vids").addEventListener("change", saveOptions);
document.querySelector("#cbox_chat_emoji").addEventListener("change", saveOptions);

function restoreOptions() {
  /**
  * Set the API Key according to user option, default to empty if null
  */
  function setApiKey(result) {
    if (result.api_key) {
      document.querySelector("#text_api_key").value = result.api_key;
    }
  }

  /**
  * Set the following checkboxes according to user option, default to checked if null
  */
  function setPrevNextVids(result) {
    if (result.prev_next_vids != null) {
      document.querySelector("#cbox_prev_next_vids").checked = result.prev_next_vids;
    } else {
      document.querySelector("#cbox_prev_next_vids").checked = true;
    }
  }

  function setChatEmoji(result) {
    if (result.chat_emoji != null) {
      document.querySelector("#cbox_chat_emoji").checked = result.chat_emoji;
    } else {
      document.querySelector("#cbox_chat_emoji").checked = true;
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // Retrieve promises of options from local storage and send to handler functions
  let getting = browser.storage.local.get("api_key");
  getting.then(setApiKey, onError);

  getting = browser.storage.local.get("prev_next_vids");
  getting.then(setPrevNextVids, onError);

  getting = browser.storage.local.get("chat_emoji");
  getting.then(setChatEmoji, onError);
}

// Populate the options page with stored settings after DOM is loaded
document.addEventListener("DOMContentLoaded", restoreOptions);
