console.log('GB QoL Twitch content script');

$(document).ready(function() {
  setTimeout(setupChatFeatures, 1 * 2000);
});

function setupChatFeatures() {
  const chatContainer = document.getElementsByClassName("simplebar-scroll-content")[0];
  console.log(chatContainer);
  chatContainer.scrollTop = 0;
}