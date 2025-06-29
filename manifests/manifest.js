const generateManifest = (platformProps) => ({
  description: "Provides some simple Quality-of-Life enhancements to giantbomb.com.",
  manifest_version: 3,
  name: "Giant Bomb QoL",
  version: "5.0",

  permissions: [
    "alarms",
    "storage"
  ],

  host_permissions: [
    "*://*.giantbomb.com/api/*"
  ],

  icons: {
      48: "img/icon-48.png",
      128: "img/icon-128.png"
  },

  action: {
    default_popup: "popup/popup.html",
    default_icon: "img/gb-offair.png"
  },

  content_scripts: [
    {
      matches: [
        "*://www.giantbomb.com/",
        "*://www.giantbomb.com/shows/*",
        "*://www.giantbomb.com/videos/*"
      ],
      css: [ "resources/giant_bomb_qol.css" ],
      js: [
        "third_party/jquery-3.5.1.min.js",
        "content_scripts/hide_spoilers.js",
        "content_scripts/add_playback_rate.js"
      ]
    },
    {
      matches: [ "*://www.giantbomb.com/videos/*" ],
      css: [ "resources/giant_bomb_qol.css" ],
      js: [
        "third_party/jquery-3.5.1.min.js",
        "content_scripts/add_playback_rate.js"
       ]
    },
    {
      matches: [ "*://www.giantbomb.com/*" ],
      css: [ "resources/giant_bomb_qol.css" ],
      js: [
        "third_party/jquery-3.5.1.min.js",
        "content_scripts/live_show_qol.js"
      ]
    }
  ],

  web_accessible_resources: [
    {
      resources: [ "img/*", "resources/emotes.json" ],
      matches: [ "*://www.giantbomb.com/*" ]
    }
  ],

  options_ui: {
    page: "options/options.html"
  },

  ...platformProps,
});

module.exports =  generateManifest;
