// Handles most Chrome/Firefox incompatibilities.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  browser = chrome;
}

let gb_chat_style = false;
let gbforever_poll_sound = false;

// handle options
browser.storage.sync.get([
  "gb_chat_style", "gbforever_poll_sound",
]).then(handleOptions, onError);

// Check user options to see if they want the emotes menu or infobuttons
function handleOptions(item) {
  if (item.gb_chat_style === undefined || item.gb_chat_style) {
    gb_chat_style = true;
  }

  if (item.gbforever_poll_sound === undefined || item.gbforever_poll_sound) {
    gbforever_poll_sound = true;
  }
}

function onError(error) {
  console.error(`Error: ${error}`);
}

// audio for new polls on GB Forever
const gbForeverAudio = new Audio(browser.runtime.getURL("resources/ding.mp3"));

const isGiantBotMessage = node => node.innerText.startsWith('GiantBotForever');
const isNewPollMessage = node => node.innerText.includes('Voting has started!');

$(document).ready(function() {
  setTimeout(moveChatInputToTop, 1 * 1000);
  setTimeout(scrollChatToTop, 1.5 * 1000);
  setTimeout(setupChatFeatures, 1.5 * 1000);
});

function moveChatInputToTop() {
  const chatContentElem = document.getElementsByClassName("chat-room__content")[0];
  const chatInputElem = document.getElementsByClassName("chat-input")[0];
  chatContentElem.before(chatInputElem);
}

function scrollChatToTop() {
  const chatScrollElem = document.getElementsByClassName("simplebar-scroll-content")[0];
  chatScrollElem.scrollTop = 0;
}

function setupChatFeatures() {
  // setup mutation observer for new chat messages
  setupChatMutationObserver();

  // highlight all GiantBotForever messages on page load
  const chatContainer = document.getElementsByClassName('chat-scrollable-area__message-container')[0];
  if (chatContainer) {
    chatContainer.childNodes.forEach(node => isGiantBotMessage(node) && highlightGiantBotMessage(node));
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
      mutation.addedNodes.forEach((node) => {
        if (isGiantBotMessage(node)) {
          highlightGiantBotMessage(node);

          if(isNewPollMessage(node) && gbforever_poll_sound) {
            gbForeverAudio.play();
          }
        }
      });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the poll container for mutations
  observer.observe(chatContainer, { childList: true });
}

function highlightGiantBotMessage(node) {
  node.classList.add('gb-qol-giantbot-message');
}
