$.getJSON({
    url: 'https://www.giantbomb.com/api/video/2300-11894/',
    data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd', field_list: 'video_type', format: 'json' },
    success: function(data) {
      var video_type = data.results.video_type;

      var html = [
          '<div id="qol_prev_vid">',
          '<a id="qol_prev_vid_link" href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/">',
          '<div><span>This is a ' + video_type + ' video!</span>',
          '<img src="http://www.giantbomb.com/api/image/scale_avatar/2922418-cp_bluebombin_02242017.00_39_30_25.still001.jpg">',
          '</div></a></div>',
          '<div id="qol_next_vid">',
          '<a id="qol_next_vid_link" href="http://www.giantbomb.com/videos/blue-bombin-mega-man-4-part-01/2300-11878/">',
          '<img src="http://www.giantbomb.com/api/image/scale_avatar/2922418-cp_bluebombin_02242017.00_39_30_25.still001.jpg">',
          '<span>Wowee it\'s a link!</span></a></div>'
        ].join('');

      var div = document.createElement('div');
      div.setAttribute("id", "qol_video_navigator")
      div.setAttribute('class', 'tab-pane active');
      div.innerHTML = html;

      var parentElement = document.getElementsByClassName('tab-content')[0];
      parentElement.insertBefore(div, parentElement.firstChild);

      var img = document.createElement('img');
      img.src = browser.extension.getURL('img/prev.png');
      parentElement = document.getElementById('qol_prev_vid_link');
      parentElement.insertBefore(img, parentElement.firstChild);

      img = document.createElement('img');
      img.src = browser.extension.getURL("img/next.png");
      img.setAttribute('id', 'qol_next_vid_arrow');
      parentElement = document.getElementById('qol_next_vid_link');
      parentElement.appendChild(img);
    }
});
