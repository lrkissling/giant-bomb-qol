// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

const gbForeverAudio = new Audio(browser.runtime.getURL("resources/ding.mp3"));

$(document).ready(function() {
  setTimeout(setupChatFeatures, 1 * 2000);
});

function setupChatFeatures() {
  // scroll chat to top
  const chatScrollElem = document.getElementsByClassName("simplebar-scroll-content")[0];
  chatScrollElem.scrollTop = 0;

  // move chat input to top
  const chatContentElem = document.getElementsByClassName("chat-room__content")[0];
  const chatInputElem = document.getElementsByClassName("chat-input")[0];
  chatContentElem.before(chatInputElem);

  setupChatMutationObserver();

  const chatContainer = document.getElementsByClassName('chat-scrollable-area__message-container')[0];
  if (chatContainer) {
    console.log(chatContainer);
    chatContainer.childNodes.forEach(node => highlightGiantbotMessages(node));
  }
}

function setupChatMutationObserver() {
  const chatContainer = document.getElementsByClassName('chat-scrollable-area__message-container')[0];

  if (!chatContainer) {
    return;
  }

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      mutation.addedNodes.forEach(node => highlightGiantbotMessages(node));
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the poll container for mutations
  observer.observe(chatContainer, { childList: true });
}

function highlightGiantbotMessages(node) {
  if (node.innerText.startsWith('GiantBotForever')) {
    gbForeverAudio.play();
    node.classList.add('gb-qol-giantbot-message');
  }
}