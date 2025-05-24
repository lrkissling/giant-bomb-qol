/**
* Parse results of API calls to determine browserAction icon appearance and
* store necessary information for retrieval by the popup.
*/
function UpdateStreamStatus(results) {
  let is_live_streaming = false,
      is_forever = false,
      streams = [];

  for (var key in results) {
    const stream_info = results[key];

    if (stream_info.channel_name != "giantbombforever") {
      is_live_streaming = true;
      streams.push({
        title: stream_info.title,
        image: stream_info.image.small_url,
        url: stream_info.site_detail_url
      });
    } else {
      is_forever = true;
      streams.push({
        title: stream_info.history[0].name,
        image: stream_info.history[0].image.small_url,
        url: stream_info.site_detail_url
      });
    }
  }

  let options = {
    is_live_streaming : is_live_streaming,
    is_forever : is_forever,
    streams: streams
  };

  browser.storage.sync.set(options);
  browser.browserAction.setIcon({
    path: { 38: is_live_streaming ? "../img/gb-live.png" : "../img/gb-offair.png" }
  });
  browser.browserAction.setTitle({
    title: is_live_streaming ? "Giant Bomb is Live!" : "Giant Bomb QoL"
  });
}
