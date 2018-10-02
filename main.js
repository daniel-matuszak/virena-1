const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog, session } = electron;
const path = require('path');
const url = require('url');

let win, winSession;

const createWindow = () => {

  const {width, height} = electron.screen.getPrimaryDisplay().size;
  win = new BrowserWindow({width, height});
  winSession = win.webContents.session

  winSession.cookies.get({name: 'cookie'}, (error, cookies) => {
    console.log(cookies)
    if (cookies[0]) {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        hash: '/',
        slashes: true
      }));
    }  else win.loadURL(url.format({
      pathname: path.resolve(__dirname, 'login.html'),
      protocol: 'file:',
      slashes: true
    }));
  })

  // if (process.env.NODE_ENV === 'development') win.loadURL('http://localhost:8080')

  win.webContents.openDevTools() 

  ipcMain.on('authorized', (event, args) => {
    if (args) {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        hash: '/',
        slashes: true
      }));
      winSession.cookies.set({url: 'https://myapp.com', name: 'cookie', value: 'cookie_value', domain: 'myapp.com', expirationDate: 999999999999}, (error) => console.log(error))

      getWindow('virena').webContents.send('info', {msg: 'hello from main process'})
    }
  })

  ipcMain.on('guest', () => {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      hash: '/',
      slashes: true
    }));
  })

  win.on('closed', () => {
    win = null
  })
}

ipcMain.on('logout', () => {
  winSession.cookies.remove('https://myapp.com', 'cookie', (error) => console.log(error))
  dialog.showMessageBox({title: 'logout', message: 'You are now logged out!'})
})

ipcMain.on('selectFileDirectory' , (event) => {
  const dir = dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  })
  event.sender.send('selectedDir', dir[0]);
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) createWindow()
})