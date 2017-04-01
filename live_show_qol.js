console.log("live_show_qol loading");

var anime_bomb = browser.extension.getURL("img/anime-bomb.png");
var bye = browser.extension.getURL("img/bye.png");
var html = [
    "<div class='qol-dropdown'>",
    "<button id='qol_show_emoji' title='Emojis' type='button' class='buttonEnabled'>",
    "<img id='qol_anime_bomb' src='" + anime_bomb + "'>",
    "</button>",
    "<div id='qol_emojis' class='qol-dropdown-content'>",
    "<button id='qol_blah' class='qol-emoji' value=':bye'>",
    "<img src='" + bye + "' title=':bye'>",
    "</button></div></div>"
].join("");

var span = document.createElement("span");
span.innerHTML = html;

var parentElement = document.getElementsByClassName("toolbar")[0];
parentElement.insertBefore(span, parentElement.children[4]);

$("#qol_show_emoji").click(function() {
  document.getElementById("qol_emojis").classList.toggle("show");
});

// only works in chat
$("#qol_blah").click(function() {
  $("#f_ChatInput").val($("#f_ChatInput").val() + this.value);
});

// Close dropdown in user clicks outside of it.
window.onclick = function(event) {
  if (!event.target.matches("#qol_show_emoji")       &&
      !event.target.matches(".qol-dropdown-content") &&
      !event.target.matches(".qol-emoji")) {
    var dropdowns = document.getElementsByClassName("qol-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
