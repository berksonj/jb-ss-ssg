const fs = require("fs");
const builder = require("./build.js");

console.log("Watching for changes...");
fs.watch("./src", {"recursive": true}, (eventType, filename) => {
    if (filename) {
        console.log("Rebuilding...");
        try {
            builder.build();
        } catch (e) {
            console.log("Error building: " + e);
        }
    }
});
