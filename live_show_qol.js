if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get("chat_emotes", handleOptions);
} else {
  getting = browser.storage.sync.get("chat_emotes");
  getting.then(handleOptions, onError);
}

// Check that they want the Emotes Menu
function handleOptions(item) {
  if (item.chat_emotes === undefined || item.chat_emotes) {
    createEmotesMenu();
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}


function createEmotesMenu() {
  // html for the Emotes tab
  let hardcore = chrome.extension.getURL("img/emotes/hardcore.png"),
      tab_html = [
        "<a id='qol_show_emotes' class='chat-tabs__wrapper' href='#' rel='nofollow'>",
        "<span class='chat-tabs__label'>",
        "<img id='qol_emotes_icon' class='icon' src='" + hardcore + "'/>",
        "Emotes</span></a>"
      ].join("");

  let li = document.createElement("li");
  li.className = "qol-chat-tabs__emotes";
  li.innerHTML = tab_html;

  let parentElement = $("#chatTabs")[0];
  parentElement.appendChild(li);

  // parse the emotes.json to create html for the emotes list
  $.getJSON(chrome.extension.getURL("emotes0.json"), function(data) {
    let emotes_html = [
      "<div class='chat-panel__header'>",
      "<strong class='chat-panel__title'>Emotes</strong>",
      "</div>",
      "<div class='chat-panel__container'><div class='qol-scroll-hold'>"
    ];

    for (const [category, emotes] of Object.entries(data)) {
      console.log(category);
      console.log(emotes);

      emotes_html.push(`<div class='qol-emote-category'>${category}</div>`);
      for (const emote of Object.values(emotes)) {
        console.log(emote);
        let src  = chrome.extension.getURL(emote.img),
            name = emote.name;

        if (name == ":wigg") {
          emotes_html.push(`<button id='qol-emote-wigg' class='qol-emote' value='${name} '>`);
        } else {
          emotes_html.push(`<button class='qol-emote' value='${name} '>`);
        }
        emotes_html.push(`<img src='${src}' title='${name}'/></button>`);
      }
    }

    emotes_html.push("</div></div>");
    emotes_html = emotes_html.join("");

    let div = document.createElement("div");
    div.id = "qol_conversation_emotes";
    div.className = "chat-panel";
    div.innerHTML = emotes_html;

    let parentElement = $("#chat-canvas")[0];
    parentElement.appendChild(div);
  });
}

$(document).ready(function() {
  // toggle classes to display emotes and show button as active
  $("#chatTabs").on("click", "#qol_show_emotes", function() {
    $(this).toggleClass("qol-red-background");
    $("#conversation-main").toggleClass("qol-height-60");
    $("#js-main-chat").toggleClass("qol-height-60");
    $("#qol_conversation_emotes").toggleClass("qol-show");
    return false;
  });

  // populate the chat input with the emote key
  $("#chat-canvas").on("click", ".qol-emote", function() {
    $("#f_ChatInput").val($("#f_ChatInput").val() + this.value);
    $("#f_ChatInput").focus();
  });
});
