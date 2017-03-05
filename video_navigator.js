var html = [
    '<div id="prev_vid" style="width: 50%; display: inline-block; border-right: 1px solid lightgrey;">',
    '<a href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/" style="float: right;">',
    '<span style="padding-right: 5px;">Wowee it\'s a link!</span>',
    '<img src="http://www.giantbomb.com/api/image/scale_avatar/2922418-cp_bluebombin_02242017.00_39_30_25.still001.jpg" ',
    'style="padding-right: 5px;" alt="Wowee it\'s an image!">',
    '</a></div>',
    '<div id="next_vid" style="width: 50%; display: inline-block;">',
    '<a href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/" style="float: left;">',
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

querySelector("#wrapper nav.sub-nav div ul li a").addEventListener('click', function() {
  querySelector("#video_navigator").setAttribute('class', 'tab-pane active');
});
