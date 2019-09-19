let windowStateKeeper;
let mainWindowState;

// Lazy load window state singleton
function init() {
    if (!windowStateKeeper) {
        windowStateKeeper = require("./electron-window-state");
    }

    if (!mainWindowState) {
        mainWindowState = windowStateKeeper({
            defaultWidth: 800,
            defaultHeight: 600,
            resetToCenter: true
        });
    }
}

// Apply window state and monitor changes
exports.onWindow = (win) => {
    init();

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
    switch (action.type) {
        case "CONFIG_LOAD":
        case "CONFIG_RELOAD": {
            init();
            return state.set("maximized", mainWindowState.isMaximized);
        }
    }

    return state;
};
