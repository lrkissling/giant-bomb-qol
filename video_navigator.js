// Have to trawl the web page for the video ID. Twitter link should be safe.
var attr = document.getElementsByClassName('share-twitter')[0]
                    .getAttribute('data-event-tracking').split('|');
var current_video_id = attr[attr.length - 1];

// first API call to retrieve necessary information from current video
var a1 = $.ajax({
            url: 'https://www.giantbomb.com/api/video/' + current_video_id + '/',
            dataType: 'json',
            data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                    field_list: 'id,video_show,video_categories',
                    format: 'json'
                  }
         }),
    a2 = a1.then(function(data) {
            var video_show = data.results.video_show.id;
            var video_categories = data.results.video_categories;

            var filter = getVideoFilter(video_show, video_categories);

            if (filter != null) {
              // second API call to get info on other videos of same show/category.
              return $.ajax({
                url: 'https://www.giantbomb.com/api/videos/',
                dataType: 'json',
                data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                        field_list: 'image,name,site_detail_url',
                        filter: filter,
                        format: 'json'
                      }
              });
            }
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

function getVideoFilter(video_show, video_categories) {
  if (video_show != null) {
    return "video_show:" + video_show;
  }

  if (video_categories != null) {
    return "video_categories=" + video_categories[0].id
  }

  return null;
}

// TODO: only works for screen of a particular width. Need to find better solution.
// Shortens the name and adds an ellipsis if it's too long
function formatVideoName(name) {
  if (name.replace(' ','').length <= 40) return name;
  return name.substring(0,40) + '\u2026'; // unicode for ellipsis
}
