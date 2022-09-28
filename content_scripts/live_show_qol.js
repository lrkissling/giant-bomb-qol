var show_emotes_menu = false;
var show_infobuttons = false;
var hide_report = false;

// handle options, using browser-specific option retrieval.
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(["chat_emotes", "infinite_infobuttons", "hide_report"], handleOptions);
} else {
  getting = browser.storage.sync.get(["chat_emotes", "infinite_infobuttons", "hide_report"]);
  getting.then(handleOptions, onError);
}

// Check user options to see if they want the emotes menu or infobuttons
function handleOptions(item) {
  if (item.chat_emotes === undefined || item.chat_emotes) {
    show_emotes_menu = true;
  }

  if (item.infinite_infobuttons === undefined || item.infinite_infobuttons) {
    show_infobuttons = true;
  }

  if (item.hide_report) {
    hide_report = true;
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

$(document).ready(function() {
  // Need a brief timeout before setup to ensure everything is ready.
  setTimeout(setupLiveShowFeatures, 1 * 1000);
});

function setupLiveShowFeatures() {
  if (document.getElementById('js-chat-container')) {
    if (show_emotes_menu) {
      emoteSetup();
    }

    if (show_infobuttons && window.location.href.indexOf("infinite") > -1) {
      infobuttonSetup();
    }

    if (hide_report) {
      hideReportButtons();
    }
  }
}

function emoteSetup() {
  createEmotesMenu();

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

  newEmotesSetup();
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

function newEmotesSetup() {
  // build single list of emotes already in the extension
  let old_emotes = [];
  $.getJSON(chrome.extension.getURL("resources/emotes.json"), function(data) {
    for (const category of Object.values(data)) {
      for (const emote of Object.values(category)) {
        old_emotes.push(emote.name.substring(1));
      }
    }
  });
  // need a brief timeout to make sure firechat emotes are populated
  setTimeout(runInPageContext.bind(null, setNewEmotes, old_emotes), 9 * 1000);
}

// Breaks out of the content script context by injecting a specially
// constructed script tag and injecting it into the page.
function runInPageContext(method, ...args) {
  // The stringified method which will be parsed as a function object.
  const stringifiedMethod = method instanceof Function
    ? method.toString()
    : `() => { ${method} }`;

  // The stringified arguments for the method as JS code that will reconstruct the array.
  const stringifiedArgs = JSON.stringify(args);

  // The full content of the script tag.
  const scriptContent = `
    // Parse and run the method with its arguments.
    (${stringifiedMethod})(...${stringifiedArgs});

    // Remove the script element to cover our tracks.
    document.currentScript.parentElement
      .removeChild(document.currentScript);
  `;

  // Create a script tag and inject it into the document.
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = scriptContent;
  document.documentElement.prepend(scriptElement);
}

function setNewEmotes(old_emotes) {
  // get master object of all emotes
  const all_emotes = getAllChatEmotes();

  // compare old_emotes to all_emotes to build list of new emotes
  const new_emotes = Object.keys(all_emotes).reduce((object,key) => {
    if (!old_emotes.includes(key) && !["goty", "millertime"].includes(key)) {
      object[key] = all_emotes[key];
    }
    return object;
  }, {});

  // add new emotes to emotes menu
  if (Object.keys(new_emotes).length > 0) {
    let emotes_html = ["<div class='qol-emote-category'>New</div>"];

    for (const [key, src] of Object.entries(new_emotes)) {
      name = ":" + key;

      emotes_html.push(`<button class='qol-emote' value='${name} '>`);
      emotes_html.push(`<img src='${src}' title='${name}'/></button>`);
    }

    emotes_html.push("</div></div>");
    emotes_html = emotes_html.join("");

    $(".qol-scroll-hold").prepend(emotes_html);
  }

   /**
   * Parses page for list that matches following structure"
   * <ul class="chat-emotes-list">
   *   <li title="abby">
   *     <img src=".../abby.png" />
   *   </li>
   * </ul>
   * @returns Object with key/value pairs matching li title and img src
   */
    function getAllChatEmotes() {
      try {
        const emotesListParent = document.getElementsByClassName("chat-emotes-list")[0];
        return Array.from(emotesListParent.children).reduce((emotesObject, el) => {
          const key = el.getAttribute("title");
          const value = el.firstElementChild.getAttribute("src");
          emotesObject[key] = value;
          return emotesObject;
        }, {});
      } catch {
        return {};
      }
    }
}

function infobuttonSetup() {
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

// Adds an infobutton linking to the video on QL Crew
function addInfobuttons() {
  const src = chrome.extension.getURL("img/info.png");

  // For each poll option that doesn't already have an infobutton, and isn't the Mystery Box
  $.each($(".poll-choices__item > span:not(:has(a)):not(:contains('Mystery Box!'))"), function(index, value) {
    // build query string
    let choice = $(value);
    const query = buildQueryString(choice.text());

    // build link
    let link = $("<a>").attr("href", `https://qlcrew.com/?q=${query}`)
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

function hideReportButtons() {
  // create new style element and set all report links to display: none
  const style = document.createElement('style');
  style.innerHTML = `.chat-history__report { display: none; }`;

  document.head.appendChild(style);
}
