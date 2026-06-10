const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');
const http = require('http');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../apps/web/public/images/icono.png')
  });
  
  mainWindow.setMenuBarVisibility(false);
}

function startServer() {
  const appData = app.getPath('userData');
  const storageDir = path.join(appData, 'storage');
  
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const env = {
    ...process.env,
    PORT: '3001',
    HOST: '127.0.0.1',
    SOFTBQ_DB_PATH: path.join(storageDir, 'softbq.db'),
    SOFTBQ_STORAGE_PATH: storageDir,
    SOFTBQ_WEB_DIST_PATH: path.join(__dirname, '../apps/web/dist')
  };

  const serverPath = path.join(__dirname, '../apps/server/dist/main.js');
  
  // Use fork to run the node script using Electron's built-in node runtime
  serverProcess = fork(serverPath, [], { env, stdio: 'pipe' });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
}

function checkServerReady(url, timeoutMs, intervalMs) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      http.get(url, (res) => {
        if (res.statusCode === 200) {
          clearInterval(interval);
          resolve();
        }
      }).on('error', () => {
        if (Date.now() - startTime > timeoutMs) {
          clearInterval(interval);
          reject(new Error('Server timeout'));
        }
      });
    }, intervalMs);
  });
}

app.whenReady().then(async () => {
  startServer();
  createWindow();

  try {
    await checkServerReady('http://127.0.0.1:3001', 10000, 500);
    mainWindow.loadURL('http://127.0.0.1:3001');
  } catch (error) {
    dialog.showErrorBox('Error', 'No se pudo iniciar el servidor local.');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      mainWindow.loadURL('http://127.0.0.1:3001');
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
