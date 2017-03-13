// first API call to retrieve necessary information from current video
var a1 = $.ajax({
            url: 'https://www.giantbomb.com/api/video/2300-11894/',
            dataType: 'json',
            // TODO: get video_show and video_category info when API makes it available
            data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                    field_list: 'id,video_type',
                    format: 'json'
                  }
         }),
    a2 = a1.then(function(data) {
            // TODO: use ID to determine previous and next videos in playlist.
            var current_video_id = data.results.id;

            /* Currently statically set due to WIP and limitations of API.
               Hopefully fixed when show and category info is integrated into API
            */
            var video_type       = 'video_type:2';

            // second API call to get info on other videos of same type.
            return $.ajax({
              url: 'https://www.giantbomb.com/api/videos/',
              dataType: 'json',
              data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                      field_list: 'image,name,site_detail_url',
                      filter: video_type,
                      format: 'json'
                    }
            });
         });

// once API calls are completed, create and inject the HTML
a2.done(function(data) {
  var prev_video_image = data.results[0].image.thumb_url;
  var prev_video_name  = formatVideoName(data.results[0].name);
  var prev_video_url   = data.results[0].site_detail_url;

  var next_video_image = data.results[1].image.thumb_url;
  var next_video_name  = formatVideoName(data.results[1].name);
  var next_video_url   = data.results[1].site_detail_url;

  var prev_arrow       = browser.extension.getURL('img/prev.png');
  var next_arrow       = browser.extension.getURL("img/next.png");

  var html = [
      '<div id="qol_prev_vid">',
      '<a id="qol_prev_vid_link" href="' + prev_video_url + '">',
      '<img src="' + prev_arrow + '"/>',
      '<span class="qol-vid-name">' + prev_video_name + '</span>',
      '<img id = "qol_prev_vid_thumb" src="' + prev_video_image + '">',
      '</a></div>',
      '<div id="qol_next_vid">',
      '<a id="qol_next_vid_link" href="' + next_video_url + '">',
      '<img src="' + next_video_image + '">',
      '<span class="qol-vid-name">' + next_video_name + '</span>',
      '<img src="' + next_arrow + '"/></a></div>'
    ].join('');

  var div = document.createElement('div');
  div.setAttribute("id", "qol_video_navigator")
  div.setAttribute('class', 'tab-pane active');
  div.innerHTML = html;

  var parentElement = document.getElementsByClassName('tab-content')[0];
  parentElement.insertBefore(div, parentElement.firstChild);
});

// TODO: only works for screen of a particular width. Need to find better solution.
// Shortens the name and adds an ellipsis if it's too long
function formatVideoName(name) {
  if (name.replace(' ','').length <= 40) return name;
  return name.substring(0,40) + '\u2026'; // unicode for ellipsis
}
