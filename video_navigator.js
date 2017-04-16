console.log("giant-bomb-qol loading");


// options currently only work for Chrome
if (navigator.userAgent.indexOf("Chrome") != -1) {
  chrome.storage.sync.get(["api_key","prev_next_vids", "hide_titr_spoilers"], handleOptions);
}
else showPrevAndNexVids("5a510947131f62ca7c62a7ef136beccae13da2fd",
                        document.location.href.indexOf("this-is-the-run") != -1);

// Check that they want the prev and next vids, and use their API key if valid
function handleOptions(items) {
  if (items.prev_next_vids === undefined || items.prev_next_vids) {
    let api_key = items.api_key;
    if (api_key === undefined || api_key.length !== 40) {
      // default api key
      api_key = "5a510947131f62ca7c62a7ef136beccae13da2fd";
    }

    // want to hide the next video if watching TITR and option is true
    let hide_titr = false;
    if (document.location.href.indexOf("this-is-the-run") != -1 &&
       (items.hide_titr_spoilers === undefined || items.hide_titr_spoilers)) {
         hide_titr = true;
    }

    showPrevAndNexVids(api_key, hide_titr);
  }
}

function showPrevAndNexVids(api_key, hide_titr) {
  // first API call to retrieve necessary information from current video
  let a1 = $.ajax({
              url: "https://www.giantbomb.com/api/video/" + getCurrentVideoId() + "/",
              dataType: "json",
              data: { api_key: api_key,
                      field_list: "publish_date,video_show,video_categories",
                      format: "json"
                    }
           }),
      a2 = a1.then(function(data) {
              /*
                 Narrows the search to within 3 months of current video. Necessary
                 because some shows and categories have >100 videos, which is the
                 upper limit of how many can be returned in a search.
              */
              let date_format  = "YYYY-MM-DD hh:mm:ss",
                  publish_date = moment(data.results.publish_date, date_format),
                  start_date   = publish_date.clone().subtract(3, "months"),
                  end_date     = publish_date.clone().add(3, "months");

              let f1 = [
                  "publish_date:",
                  start_date.format(date_format),
                  "|",
                  end_date.format(date_format)
                ].join("");

              // filters search by the video's show/category
              let video_show       = data.results.video_show,
                  video_categories = data.results.video_categories,
                  f2 = getVideoFilter(video_show, video_categories);

              if (f2 !== null) {
                // second API call to get info on other videos of same show/category.
                return $.ajax({
                  url: "https://www.giantbomb.com/api/videos/",
                  dataType: "json",
                  data: { api_key: api_key,
                          field_list: "id,image,name,publish_date,site_detail_url",
                          filter: f1 + "," + f2,
                          format: "json"
                        }
                });
              }
           });

  // once API calls are completed, create and inject the HTML
  a2.done(function(data) {
    let current_video_id = getCurrentVideoId().split("-")[1],
        indices = [];

    // results come in reverse-chronological order, so i = 0 is latest video
    for (var i = 0, len = data.results.length; i < len; i++) {
      if (data.results[i].id != current_video_id) continue;

      if (i === 0) {
        indices[0] = 1;
      }
      else if (i === len - 1) {
        indices[1] = i - 1;
      }
      else {
        indices[0] = i + 1;
        indices[1] = i - 1;
      }

      break;
    }

    if (indices.length === 0) return;

    // start building the actual html
    let html = ["<div id='qol_prev_vid'>"];

    if (indices[0] !== undefined) {
      let prev_video_image = data.results[indices[0]].image.thumb_url,
          prev_video_name  = data.results[indices[0]].name,
          prev_video_url   = data.results[indices[0]].site_detail_url,
          prev_arrow       = chrome.extension.getURL("img/prev.png");

      html.push(
        "<a id='qol_prev_vid_link' href='" + prev_video_url + "'>",
        "<img id ='qol_prev_vid_arrow' src='" + prev_arrow + "'/>",
        "<span class='qol-vid-name'>" + prev_video_name + "</span>",
        "<img id='qol_prev_vid_thumb' class='qol_thumb' src='" + prev_video_image + "'></a>"
      );
    }

    html.push(
      "</div>",
      "<div id='qol_next_vid'>"
    );


    if (indices[1] !== undefined) {
      let next_video_image = data.results[indices[1]].image.thumb_url,
          next_video_name  = data.results[indices[1]].name,
          next_video_url   = data.results[indices[1]].site_detail_url,
          next_arrow       = chrome.extension.getURL("img/next.png");

      // hide the next vid if it's a TITR video
      if (hide_titr) {
        html.push("<a id='qol_next_vid_link' class='qol-hidden-hover' href='" + next_video_url + "'>");
      }
      else html.push("<a id='qol_next_vid_link' href='" + next_video_url + "'>");

      html.push(
        "<img id='qol_next_vid_thumb' class='qol_thumb' src='" + next_video_image + "'>",
        "<span class='qol-vid-name'>" + next_video_name + "</span>",
        "<img id='qol_next_vid_arrow' src='" + next_arrow + "'/></a>"
      );
    }

    html.push("</div>");
    html = html.join("");

    let div = document.createElement("div");
    div.setAttribute("id", "qol_video_navigator");
    div.setAttribute("class", "tab-pane");
    div.innerHTML = html;

    let parentElement = document.getElementsByClassName("tab-content")[0];
    parentElement.insertBefore(div, parentElement.firstChild);
  });
}

// Trawls the web page for the video ID. Twitter link should be safe.
function getCurrentVideoId() {
  let attr = document.getElementsByClassName("share-twitter")[0]
                     .getAttribute("data-event-tracking").split("|");
  return attr[attr.length - 1];
}

/* Determines which show/category filter to use. Prioritizes show over category,
   and selects the first category in the list if there are multiple.
*/
function getVideoFilter(video_show, video_categories) {
  if (video_show !== null) {
    return "video_show:" + video_show.id;
  }

  if (video_categories !== null) {
    return "video_categories:" + video_categories[0].id;
  }

  return null;
}
