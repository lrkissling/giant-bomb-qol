if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get("chat_emoji", handleOptions);
// } else {
//   getting = browser.storage.sync.get("chat_emoji");
//   getting.then(handleOptions, onError);
// }
} else createEmojiMenu();

// Check that they want the emoji menu
function handleOptions(item) {
  if (item.chat_emoji === undefined || item.chat_emoji) {
    createEmojiMenu();
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}


function createEmojiMenu() {
  // html for the Emoji tab
  let hardcore = chrome.extension.getURL("img/emoji/hardcore.png"),
      tab_html = [
        "<a id='qol_show_emoji' class='chat-tabs__wrapper' href='#' rel='nofollow'>",
        "<span class='chat-tabs__label'>",
        "<img id='qol_emoji_icon' class='icon' src='" + hardcore + "'/>",
        " Emoji</span></a>"
      ].join("");

  let li = document.createElement("li");
  li.className = "qol-chat-tabs__emoji";
  li.innerHTML = tab_html;

  let parentElement = $("#chatTabs")[0];
  parentElement.appendChild(li);

  // parse the emoji.json to create html for the emoji list
  $.getJSON(chrome.extension.getURL("emoji.json"), function(data) {
    let emoji_html = [];

    data.emoji.forEach(function(emoji) {
      let src  = chrome.extension.getURL(emoji.img),
          name = emoji.name;

      emoji_html.push("<button class='qol-emoji' value='" + name + " '>");
      emoji_html.push("<img src='" + src + "' title='" + name + "'/></button>");
    });

    emoji_html = emoji_html.join("");

    let div = document.createElement("div");
    div.id = "qol_conversation_emoji";
    div.className = "chat-panel";
    div.innerHTML = emoji_html;

    let parentElement = $("#chat-canvas")[0];
    parentElement.appendChild(div);
  });
}

$(document).ready(function() {
  // toggle classes to display emoji and show button as active
  $("#qol_show_emoji").click(function() {
    $(this).toggleClass("qol-red-background");
    $("#conversation-main").toggleClass("qol-height-60");
    $("#qol_conversation_emoji").toggleClass("qol-show");
    return false;
  });

  // populate the chat input with the emoji key
  $("#f_ChatController").on("click", ".qol-emoji", function() {
    $("#f_ChatInput").val($("#f_ChatInput").val() + this.value);
    $("#f_ChatInput").focus();
  });
});
