function addPlaybackRateControl() {
  let rightAVControls = $('.av-controls--right').first();
  rightAVControls.prepend(buildPlaybackRateControl());

  if (navigator.userAgent.indexOf("Chrome") != -1) {
    $('.qol-playback-rate-button-label').css("font-weight", "bold");
  }
}

function buildPlaybackRateControl() {
  let playbackDiv = $('<div>').addClass('av-chrome-control');
  playbackDiv.append(
    $('<button>')
      .addClass('av-ctrl qol-playback-rate-button')
      .append($('<i class=qol-playback-rate-button-label>').append("1x"))
  );
  playbackDiv.append(playbackRateMenuFragment());
  return playbackDiv;
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

      // Set values close to 1x to 1 to make it easy to get back to normal speed.
      if (newPlaybackRate > 0.97 && newPlaybackRate < 1.03) {
        newPlaybackRate = 1;
      }

      // Update the rate both in the popup menu
      $('.qol-playback-rate-label').html(newPlaybackRate.toFixed(2));

      // Update the rate in the player control panel
      if (newPlaybackRate === 1) {
        $('.qol-playback-rate-button-label').html(newPlaybackRate + "x");
      } else {
        $('.qol-playback-rate-button-label').html(newPlaybackRate.toFixed(2) + "x");
      }

      $('video').get(0).playbackRate = newPlaybackRate;
    });

    // Enable show/hide of playback control menu
    $('.qol-playback-rate-button').on('click', function() {
      $('.qol-playback-rate-menu').toggleClass('qol-playback-rate-menu-show');
    });
  }
});
