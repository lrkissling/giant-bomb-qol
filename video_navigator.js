var html = [
    '<div id="prev_vid" style="width: 50%; display: inline-block; border-right: 1px solid lightgrey;">',
    '<a id="prev_vid_link" href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/" style=" width: 100%; float: right;">',
    '<div style="float: right;"><span style="padding-right: 5px;">Wowee it\'s a link!</span>',
    '<img src="http://www.giantbomb.com/api/image/scale_avatar/2922418-cp_bluebombin_02242017.00_39_30_25.still001.jpg" ',
    'style="padding-right: 5px;" alt="Wowee it\'s an image!"></div>',
    '</a></div>',
    '<div id="next_vid" style="width: 50%; display: inline-block;">',
    '<a id="next_vid_link" href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/" style="width: 100%; float: left;">',
    '<img src="http://www.giantbomb.com/api/image/scale_avatar/2922418-cp_bluebombin_02242017.00_39_30_25.still001.jpg" ',
    'style="padding-left: 5px;" alt="Wowee it\'s an image!">',
    '<span style="padding-left: 5px;">Wowee it\'s a link!</span></a>',
    '</div>'
  ].join('');

var div = document.createElement('div');
div.setAttribute("id", "video_navigator")
div.setAttribute('class', 'tab-pane active');
div.setAttribute('style', 'height: 46px; border-top: 1px solid lightgrey;')
div.innerHTML = html;

var parentElement = document.getElementsByClassName('tab-content')[0];
parentElement.insertBefore(div, parentElement.firstChild);

var img = document.createElement('img');
img.src = browser.extension.getURL('img/prev.png');
parentElement = document.getElementById('prev_vid_link');
parentElement.insertBefore(img, parentElement.firstChild);

img = document.createElement('img');
img.src = browser.extension.getURL("img/next.png");
img.setAttribute('style', 'float: right;');
parentElement = document.getElementById('next_vid_link');
parentElement.appendChild(img);

querySelector('#wrapper nav.sub-nav div ul li a').addEventListener('click', function() {
  querySelector('#video_navigator').setAttribute('class', 'tab-pane active');
});
