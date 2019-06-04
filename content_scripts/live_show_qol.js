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
  $.getJSON(chrome.extension.getURL("resources/emotes.json"), function(data) {
    let emotes_html = [
      "<div class='chat-panel__header'>",
      "<strong class='chat-panel__title'>Emotes</strong>",
      "</div>",
      "<div class='chat-panel__container'><div class='qol-scroll-hold'>"
    ];

    for (const [category, emotes] of Object.entries(data)) {
      emotes_html.push(`<div class='qol-emote-category'>${category}</div>`);

      for (const emote of Object.values(emotes)) {
        let src  = chrome.extension.getURL(emote.img),
            name = emote.name;

        // have to account for the monstrosity
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

// Adds an infobutton linking to the video on QL Crew
function addInfobuttons() {
  // For each poll option that doesn't already have an infobutton, and isn't the Mystery Box
  $.each($(".poll-choices__item > span:not(:has(a)):not(:contains('Mystery Box!'))"), function(index, value) {
    // build query string
    let choice = $(value);
    const text = choice.text();
    let query = encodeURI(text.substr(0, text.lastIndexOf("(") - 1));
    // build link
    const link = $("<a>").attr("href", `https://www.qlcrew.com/?q=${query}`)
                         .attr("target", "_blank")
                         .addClass("qol-infobutton")
                         .text("i");
    // append link to poll option
    choice.append(link);
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

  if (window.location.href.indexOf("infinite") > -1) {
    $("#js-chat-tab-poll").on("click", addInfobuttons);
  }

  // have to stop propagation of click event because it counts as poll answer.
  $("#js-poll-answer-container").on("click", ".qol-infobutton", function(event) {
    event.stopImmediatePropagation();
  });

  // // Don't show check mark when hovering over infobutton
  $("#js-poll-answer-container").on({
    mouseenter: function() {
      $(this).closest("li").addClass("qol-without-after");
    },
    mouseleave: function() {
      $(this).closest("li").removeClass("qol-without-after");
    }
  }, ".qol-infobutton");
});
