/*Used to start Electron*/

import electron from "electron";
import { join } from "path";
import { format } from "url";

electron.app.on("ready", function() {
    var win = new electron.BrowserWindow({width: 1280, height: 720});
    win.loadURL(format({
        pathname: join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));
});