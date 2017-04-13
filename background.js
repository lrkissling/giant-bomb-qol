const css_hidden = "span.av-time, div.js-vid-buffer {visibility: hidden !important;}";
const target = "*://www.giantbomb.com/videos/*this-is-the-run*";



/**
* Inserts css to hide video timer and progress scrubber.
*/
function hideSpoilers(responseDetails) {
  // Currently only Chrome can handle options
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    // Get user option for whether or not to hide spoilers
    chrome.storage.sync.get(["hide_titr_spoilers"], function(item) {
      // If no option set, defaults to true
      if (item.hide_titr_spoilers === undefined || item.hide_titr_spoilers) {
        chrome.tabs.insertCSS(responseDetails.tabId, {code: css_hidden});
      }
    });
  } else {
    chrome.tabs.insertCSS(responseDetails.tabId, {code: css_hidden});
  }
}

// Calls hideSpoilers upon completion of page load for appropriate urls.
chrome.webRequest.onCompleted.addListener(hideSpoilers,{urls: [target]});
