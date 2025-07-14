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
const botMessageStartsWith = (node, text) => node.innerText.startsWith(`GiantBotForever:\n${text}`);

$(document).ready(function() {
  if (gb_chat_style) {
    setTimeout(moveChatInputToTop, 1 * 1000);
    setTimeout(transformChat, 1.5 * 1000);
    setTimeout(scrollChatToTop, 2 * 1000);
  }

  if (gbforever_poll_sound) {
    setTimeout(setupChatMutationObserver(checkForNewPollAndPlaySound), 1.5 * 1000);
  }
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

function transformChat() {
  hideUsersInChatButton();

  // transform messages on initial page load
  const chatContainer = document.getElementsByClassName('chat-scrollable-area__message-container')[0];
  if (chatContainer) {
    Array.from(chatContainer.childNodes).forEach(m => transformMessage(m));
  }

  // setup mutation observer for transforming new chat messages
  setupChatMutationObserver(transformMessage);
}

function transformMessage(node) {
  if (!node.classList.contains('gb-qol-message-modified')) {
    node.classList.add('gb-qol-message-modified');

    if (isGiantBotMessage(node)) {
      highlightGiantBotMessage(node);
      rearrangePollOption(node);
    } else if (isStaffMessage(node)) {
      highlightStaffMessage(node);
    }
  }
}

function checkForNewPollAndPlaySound(node) {
  if(isGiantBotMessage(node) && isNewPollMessage(node)) {
    gbForeverAudio.play();
  }
}

function setupChatMutationObserver(func) {
  const chatContainer = document.getElementsByClassName('chat-scrollable-area__message-container')[0];

  if (!chatContainer) {
    return;
  }

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      mutation.addedNodes.forEach((node) => {
        func(node);
      });
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the poll container for mutations
  observer.observe(chatContainer, { childList: true });
}

function hideUsersInChatButton() {
  const node = document.querySelector('[aria-label="Users in Chat"');
  if (node) {
    node.classList.add('gb-qol-hide');
  }
}

function highlightGiantBotMessage(node) {
  node.classList.add('gb-qol-giantbot-message');
}

function isStaffMessage(node) {
  const staffUsernames = [
    'chucktowski',
    'coffeewithjan',
    'danryckert',
    'giantbomb',
    'jeffgrubb',
    'tolkoto',
    'turboshawn',
  ];
  return staffUsernames.includes(node.innerText.split(':')[0].toLowerCase());
}

function highlightStaffMessage(node) {
  node.classList.add('gb-qol-staff-message');
}

function rearrangePollOption(node) {
  for (let i = 5; i >= 1; i--) {
    if (botMessageStartsWith(node, `${i}:`)) {
      node.parentNode.insertBefore(node, getXthPreviousSiblingNode(node, i));
    }
  }
}

function getXthPreviousSiblingNode(node, num) {
  if (num === 0 || !node.previousElementSibling) return node;
  return (getXthPreviousSiblingNode(node.previousElementSibling, num - 1));
}
