const { writeFileSync } = require("node:fs");
const child_process = require("child_process")

const platformProps = require("../manifests/manifest-chrome");
const generateManifest = require("../manifests/manifest");

// create Chrome-compatible manifest file
const manifest = generateManifest(platformProps);
writeFileSync("./manifest.json", JSON.stringify(manifest, null, 2));

// bundle all necessary files
child_process.execSync(
  "zip -r dist/bundle-chrome.zip . -x@build_scripts/_exclude.lst",
  { cwd: "./" }
);