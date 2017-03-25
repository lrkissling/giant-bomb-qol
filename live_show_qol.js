console.log("live_show_qol loading");

var anime_bomb = browser.extension.getURL("img/anime-bomb.png");
var html = [
    "<button id='qol_show_emoji' title='Emojis' type='button' class='buttonEnabled'>",
    "<img id='qol_anime_bomb' src='" + anime_bomb + "'>",
    "</button>"
].join("");

var span = document.createElement("span");
span.innerHTML = html;

var parentElement = document.getElementsByClassName("toolbar")[0];
parentElement.insertBefore(span, parentElement.children[4]);

$("#qol_show_emoji").click(function() {
  alert("it worked!");
})
