console.log('GB QoL Twitch content script');

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
}