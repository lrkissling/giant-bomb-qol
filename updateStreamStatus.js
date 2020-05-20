/**
* Parse results of API calls to determine browserAction icon appearance and
* store necessary information for retrieval by the popup.
*/
function UpdateStreamStatus(results) {
  let is_live_streaming = false,
      is_infinite = false,
      streams = [];
      // stream_info = null;
  for (var key in results) {
    const stream_info = results[key];

    if (stream_info.title != "Giant Bomb Infinite") {
      is_live_streaming = true;
      streams.push({
        title: stream_info.title,
        image: stream_info.image.small_url,
        url: stream_info.site_detail_url
      });
    } else {
      is_infinite = true;
      streams.push({
        title: stream_info.history[0].name,
        image: stream_info.history[0].image.small_url,
        url: stream_info.site_detail_url
      });
    }
  }

  let options = {
    is_live_streaming : is_live_streaming,
    is_infinite : is_infinite,
    streams: streams
  };

  // if (is_live_streaming) {
  //   options.stream_title = stream_info.title;
  //   options.stream_image = stream_info.image.small_url;
  // } else if (is_infinite) {
  //   options.stream_title = stream_info.history[0].name;
  //   options.stream_image = stream_info.history[0].image.small_url;
  // }

  browser.storage.sync.set(options);
  browser.browserAction.setIcon({
    path: { 38: is_live_streaming ? "../img/gb-live.png" : "../img/gb-offair.png" }
  });
  browser.browserAction.setTitle({
    title: is_live_streaming ? "Giant Bomb is Live!" : "Giant Bomb QoL"
  });
}
