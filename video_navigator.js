console.log("giant-bomb-qol loading");

// Have to trawl the web page for the video ID. Twitter link should be safe.
var attr = document.getElementsByClassName('share-twitter')[0]
                    .getAttribute('data-event-tracking').split('|');
var current_video_id = attr[attr.length - 1];

// first API call to retrieve necessary information from current video
var a1 = $.ajax({
            url: 'https://www.giantbomb.com/api/video/' + current_video_id + '/',
            dataType: 'json',
            data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                    field_list: 'id,publish_date,video_show,video_categories',
                    format: 'json'
                  }
         }),
    a2 = a1.then(function(data) {
            /* Narrows the search to within 3 months of current video. Necessary
               because some shows and categories have >100 videos, which is the
               upper limit of how many can be returned in a search.
            */
            var publish_date = moment(data.results.publish_date, 'YYYY-MM-DD hh:mm:ss');
            var start_date   = publish_date.clone().subtract(3, 'months');
            var end_date     = publish_date.clone().add(3, 'months');

            var f1 = [
                'publish_date:',
                start_date.format('YYYY-MM-DD hh:mm:ss'),
                '|',
                end_date.format('YYYY-MM-DD hh:mm:ss')
              ].join('');

            // filters search by the video's show/category
            var video_show       = data.results.video_show;
            var video_categories = data.results.video_categories;
            var f2 = getVideoFilter(video_show, video_categories);

            if (f2 != null) {
              // second API call to get info on other videos of same show/category.
              return $.ajax({
                url: 'https://www.giantbomb.com/api/videos/',
                dataType: 'json',
                data: { api_key: '5a510947131f62ca7c62a7ef136beccae13da2fd',
                        field_list: 'id,image,name,publish_date,site_detail_url',
                        filter: f1 + ',' + f2,
                        format: 'json'
                      }
              });
            }
         });

// once API calls are completed, create and inject the HTML
a2.done(function(data) {
  var indices = [];

  // results come in reverse-chronological order, so i = 0 is latest video
  for (var i = 0; i < data.results.length; i++) {
    if (data.results[i].id != current_video_id.split('-')[1]) continue;

    if (i == 0) {
      indices[0] = 1;
    }
    else if (i == data.results.length - 1) {
      indices[1] = i - 1;
    }
    else {
      indices[0] = i + 1;
      indices[1] = i - 1;
    }

    break;
  }

  if (indices.length == 0) return;

  // start building the actual html
  var html = ['<div id="qol_prev_vid">'];

  if (indices[0] != null) {
    var prev_video_image = data.results[indices[0]].image.thumb_url;
    var prev_video_name  = data.results[indices[0]].name;
    var prev_video_url   = data.results[indices[0]].site_detail_url;
    var prev_arrow       = browser.extension.getURL('img/prev.png');

    html.push(
      '<a id="qol_prev_vid_link" href="' + prev_video_url + '">',
      '<img id ="qol_prev_vid_arrow" src="' + prev_arrow + '"/>',
      '<span class="qol-vid-name">' + prev_video_name + '</span>',
      '<img id="qol_prev_vid_thumb" class="qol_thumb" src="' + prev_video_image + '"></a>'
    );
  }

  html.push(
    '</div>',
    '<div id="qol_next_vid">'
  );

  if (indices[1] != null) {
    var next_video_image = data.results[indices[1]].image.thumb_url;
    var next_video_name  = data.results[indices[1]].name;
    var next_video_url   = data.results[indices[1]].site_detail_url;
    var next_arrow       = browser.extension.getURL("img/next.png");

    html.push(
      '<a id="qol_next_vid_link" href="' + next_video_url + '">',
      '<img id="qol_next_vid_thumb" class="qol_thumb" src="' + next_video_image + '">',
      '<span class="qol-vid-name">' + next_video_name + '</span>',
      '<img id="qol_next_vid_arrow" src="' + next_arrow + '"/></a>'
    );
  }

  html.push('</div>');
  html = html.join('')

  var div = document.createElement('div');
  div.setAttribute("id", "qol_video_navigator")
  div.setAttribute('class', 'tab-pane');
  div.innerHTML = html;

  var parentElement = document.getElementsByClassName('tab-content')[0];
  parentElement.insertBefore(div, parentElement.firstChild);
});

/* Determines which show/category filter to use. Prioritizes show over category,
   and selects the first category in the list if there are multiple.
*/
function getVideoFilter(video_show, video_categories) {
  if (video_show != null) {
    return "video_show:" + video_show.id;
  }

  if (video_categories != null) {
    return "video_categories:" + video_categories[0].id
  }

  return null;
}
