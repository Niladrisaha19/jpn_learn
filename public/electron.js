const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let kanjiCanvasWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'kanji.ico')
  });

  const startURL = 'http://localhost:3000'; // Assuming your React app is served at this URL
  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    if (kanjiCanvasWindow) {
      kanjiCanvasWindow.close();
    }
    mainWindow = null;
  });

  mainWindow.removeMenu();

  // Load Kanji Canvas in a new window
  kanjiCanvasWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  kanjiCanvasWindow.loadURL('https://asdfjkl.github.io/kanjicanvas/');

  kanjiCanvasWindow.once('ready-to-show', () => {
    kanjiCanvasWindow.show();
  });

  // Handle closing of the Kanji Canvas window
  kanjiCanvasWindow.on('closed', () => {
    kanjiCanvasWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';