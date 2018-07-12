/*Used to start Electron*/

const electron = require("electron");
const { join } = require("path");
const { format } = require("url");

electron.app.on("ready", function() {
    var win = new electron.BrowserWindow({width: 1280, height: 720});
    win.loadURL(format({
        pathname: join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));
});