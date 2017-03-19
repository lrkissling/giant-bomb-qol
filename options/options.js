/**
* Save the checkbox checked values to local storage
*/
function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    prev_next_vids: document.querySelector("#cbox-prev-next-vids").checked,
  });
}

// Invoke saveOptions whenever a checkbox is changed
document.querySelector("#cbox-prev-next-vids").addEventListener("change", saveOptions);

function restoreOptions() {
  /**
  * Set the checkbox according to user option, default to checked if null
  */
  function setPrevNextVids(result) {
    if (result.prev_next_vids != null) {
      document.querySelector("#cbox-prev-next-vids").checked = result.prev_next_vids;
    } else {
      document.querySelector("#cbox-prev-next-vids").checked = true;
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  // Retrieve promises of options from local storage and send to handler functions
  var getting = browser.storage.local.get("prev_next_vids");
  getting.then(setPrevNextVids, onError);
}

// Populate the options page with stored settings after DOM is loaded
document.addEventListener("DOMContentLoaded", restoreOptions);
