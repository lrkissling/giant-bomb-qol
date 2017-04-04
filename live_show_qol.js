console.log("live_show_qol loading");

$(document).ready(function() {
  $("#qol_show_emoji").click(function() {
    $(this).toggleClass("qol-red-background");
    $("#qol_emojis").toggleClass("qol-show");
    return false;
  });

  $("#qol_blah").click(function() {
    $("#f_ChatInput").val($("#f_ChatInput").val() + this.value);
  });
});

var hardcore = browser.extension.getURL("img/emojis/hardcore.png"),
    bye      = browser.extension.getURL("img/emojis/bye.png");
    html     = [
      "<a id='qol_show_emoji' class='chat-tabs__wrapper' href='#' rel='nofollow'>",
      "<span class='chat-tabs__label'>",
      "<img id='qol_anime_bomb' class='icon' src='" + hardcore + "'/>",
      "Emojis</span></a>",
      "<div id='qol_emojis' class='qol-dropdown-content'>",
      "<button id='qol_blah' class='qol-emoji' value=':bye'>",
      "<img src='" + bye + "' title=':bye '>",
      "</button></div>"
    ].join("");

// var parentElement = document.getElementsByClassName("toolbar")[0];
// parentElement.insertBefore(span, parentElement.children[4]);

var li = document.createElement("li");
li.className = "qol-dropdown";
li.innerHTML = html;

var parentElement = $("#chatTabs")[0];
parentElement.appendChild(li);

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
