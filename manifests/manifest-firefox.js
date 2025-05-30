// These fields are added to the manifest.json when generating a Firefox build

module.exports = {
  browser_specific_settings: {
    gecko: {
      id: "giantbomb@qol.snake",
      strict_min_version: "109.0",
    }
  },
  background: {
    scripts: [ "serviceWorker.js" ],
    type: "module",
  },
}
