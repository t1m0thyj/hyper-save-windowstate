let windowStateKeeper;
let mainWindowState;

// Lazy load window state singleton
function init({ app, screen, remote }) {
    if (!windowStateKeeper) {
        windowStateKeeper = require("./electron-window-state");
    }

    if (!mainWindowState) {
        mainWindowState = windowStateKeeper({
            defaultWidth: 800,
            defaultHeight: 600,
            resetToCenter: true
        }, app || remote.app, screen || remote.screen);
    }
}

function getElectron() {
    const electron = require('electron');
    return electron;
}

function getRemote() {
    // "remote" module was deprecated in Electron 12, and will be removed in Electron 14
    // https://www.electronjs.org/docs/latest/breaking-changes#removed-remote-module
    const { app: remoteApp, screen: remoteScreen } = require('@electron/remote');

    return {
        app: remoteApp,
        screen: remoteScreen
    };
}

// Apply window state and monitor changes
exports.onWindow = (win) => {
    const electron = getElectron();
    init(electron);

    if ((mainWindowState.x !== undefined) && (mainWindowState.y !== undefined)) {
        win.setBounds({
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height
        });
    }

    mainWindowState.manage(win);
};

// Render maximize/restore button correctly
exports.reduceUI = (state, action) => {
    const electron = getElectron();

    // renderer requires remote module
    if (electron.remote == null) {
        electron.remote = getRemote();
    }

    switch (action.type) {
        case "CONFIG_LOAD":
        case "CONFIG_RELOAD": {
            init(electron);
            return state.set("maximized", mainWindowState.isMaximized);
        }
    }

    return state;
};
