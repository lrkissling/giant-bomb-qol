var show_infobuttons = false;

if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(["chat_emotes", "infinite_infobuttons"], handleOptions);
} else {
  getting = browser.storage.sync.get(["chat_emotes", "infinite_infobuttons"]);
  getting.then(handleOptions, onError);
}

// Check that they want the Emotes Menu
function handleOptions(item) {
  if (item.chat_emotes === undefined || item.chat_emotes) {
    createEmotesMenu();
  }

  if (item.infinite_infobuttons === undefined || item.infinite_infobuttons) {
    show_infobuttons = true;
  } else {
    show_infobuttons = false;
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

        // have to account for the big boi emotes
        if (name == ":wigg") {
          emotes_html.push(`<button id='qol-emote-wigg' class='qol-emote' value='${name} '>`);
        } else if (name == ":fiiish") {
          emotes_html.push(`<button id='qol-emote-fiiish' class='qol-emote' value='${name} '>`);
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
  const src = chrome.extension.getURL("img/info.png");

  // For each poll option that doesn't already have an infobutton, and isn't the Mystery Box
  // $.each($(".poll-choices__item > span:not(:contains('Mystery Box!'))"), function(index, value) {
  $.each($(".poll-choices__item > span:not(:has(a)):not(:contains('Mystery Box!'))"), function(index, value) {
  // $.each($(".poll-choices__label"), function(index, value) { // for testing purposes
    // build query string
    let choice = $(value);
    const query = buildQueryString(choice.text());

    // build link
    let link = $("<a>").attr("href", `https://www.qlcrew.com/?q=${query}`)
                       .attr("target", "_blank")
                       .addClass("qol-infobutton");
    link.append($("<img>").attr("src", src));

    // append link to poll option
    choice.append(link);
  });
}

function buildQueryString(text) {
  // remove date at the end
  let search_text = text.substr(0, text.lastIndexOf("(") - 1);
  // remove "premier(e)" from beginning
  search_text = search_text.replace(/premiere?:\s/gi, "");
  // remove colons
  search_text = search_text.replace(/:\s/g, " ");
  // remove hyphens
  search_text = search_text.replace(/\s-\s/g, " ");
  // remove any extra spaces
  search_text = search_text.replace(/\s+/g, " ");
  // return URI-encoded string
  return encodeURI(search_text);
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

  // Set up infobutton handling for GB Infinite polls
  if (show_infobuttons && window.location.href.indexOf("infinite") > -1) {
    // $("#js-chat-tab-poll").on("click", addInfobuttons);

    // Add infobuttons to active poll on initial page load, if necessary
    addInfobuttons();

    // Set up mutation observer for new polls
    const poll_container = document.getElementById('js-poll-answer-container');
    const observer_config = { childList: true };
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
          addInfobuttons();
        }
      }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the poll container for mutations
    observer.observe(poll_container, observer_config);

    // Have to stop propagation of click event because it counts as poll answer.
    $("#js-poll-answer-container").on("click", ".qol-infobutton", function(event) {
      event.stopImmediatePropagation();
    });

    // Don't show check mark when hovering over infobutton
    $("#js-poll-answer-container").on({
      mouseenter: function() {
        $(this).closest("li").addClass("qol-without-after");
      },
      mouseleave: function() {
        $(this).closest("li").removeClass("qol-without-after");
      }
    }, ".qol-infobutton");
  }
});
