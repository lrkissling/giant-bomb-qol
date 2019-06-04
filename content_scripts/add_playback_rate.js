function addPlaybackRateControl() {
  let rightAVControls = $('.av-controls--right').first();
  rightAVControls.prepend(buildPlaybackRateControl());
}

function buildPlaybackRateControl() {
  let playbackDiv = $('<div>').addClass('av-chrome-control');
  playbackDiv.append(
    $('<button>')
      .addClass('av-ctrl qol-playback-rate-button')
      .append($('<i>').append(playbackRateIconFragment()))
  );
  playbackDiv.append(playbackRateMenuFragment());
  return playbackDiv;
}

function playbackRateIconFragment() {
  return `
    <svg class="symbol" viewBox = "2 1 17 17" width="80" height="80">
      <path d="M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"></path>
		</svg >
  `;
}

function playbackRateMenuFragment() {
  return `<div class="av-menu av-config-menu qol-playback-rate-menu">
            <div class="js-vid-menu av-menu-selection">
              <div class="qol-playback-rate-input">
                <input type="range" min="1" max="200" value="100" class="qol-playback-rate-slider" />
                <span>Playback rate: </span>
                <span class="qol-playback-rate-label">1.00</span>
                <span>x</span>
              </div>
            </div>
          </div>`;
}

$(document).ready(function() {
  if ($('.js-vid-player-chrome')[0]) {
    addPlaybackRateControl();

    // Add interactivity to new playback rate control
    $('.qol-playback-rate-slider').on('change mousemove', function() {
      let newPlaybackRate = $(this).val() / 100.0;
      $('.qol-playback-rate-label').html(newPlaybackRate.toFixed(2));
      $('video').get(0).playbackRate = newPlaybackRate;
    });

    // Enable show/hide of playback control menu
    $('.qol-playback-rate-button').on('click', function() {
      $('.qol-playback-rate-menu').toggleClass('qol-playback-rate-menu-show');
    });
  }
});
