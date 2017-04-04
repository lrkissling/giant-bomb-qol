console.log("live_show_qol loading");

$(document).ready(function() {
  $("#qol_show_emoji").click(function() {
    $("#qol_emojis").toggleClass("show");
  });

  $("#qol_blah").click(function() {
    $("#f_ChatInput").val($("#f_ChatInput").val() + this.value);
  });
});

var anime_bomb = browser.extension.getURL("img/anime-bomb.png"),
    bye = browser.extension.getURL("img/emojis/bye.png");
    html = [
    "<div class='qol-dropdown'>",
    "<button type='button' id='qol_show_emoji' title='Emojis'>",
    "<img id='qol_anime_bomb' src='" + anime_bomb + "'>",
    "</button>",
    "<div id='qol_emojis' class='qol-dropdown-content'>",
    "<button id='qol_blah' class='qol-emoji' value=':bye'>",
    "<img src='" + bye + "' title=':bye '>",
    "</button></div></div>"
].join("");

var span = document.createElement("span");
span.innerHTML = html;

// var parentElement = document.getElementsByClassName("toolbar")[0];
// parentElement.insertBefore(span, parentElement.children[4]);

var parentElement = $(".chat-panel__header")[0];
parentElement.appendChild(span);

// Close dropdown in user clicks outside of it.
window.onclick = function(event) {
  if (!event.target.matches("#qol_show_emoji")       &&
      !event.target.matches(".qol-dropdown-content") &&
      !event.target.matches(".qol-emoji")) {
    var dropdowns = document.getElementsByClassName("qol-dropdown-content");
    for (var i = 0, len = dropdowns.length; i < len; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
