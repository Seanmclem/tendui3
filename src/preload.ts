// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

declare global {
  interface Window {
    Main: typeof api;
    ipcRenderer: typeof ipcRenderer;
  }
}

const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   */

  // Terminal management
  sendKeystroke: (terminalId: string, payload: any) => {
    ipcRenderer.send("terminal.keystroke", { terminalId, payload });
  },

  createTerminal: (terminalId: string) => {
    ipcRenderer.send("terminal.create", terminalId);
  },

  removeTerminal: (terminalId: string) => {
    ipcRenderer.send("terminal.remove", terminalId);
  },

  // File operations
  saveFilePlease: (payload: any) => {
    ipcRenderer.send("saveFile", payload);
  },

  goGetFolderOpenDialog: (payload?: any) => {
    console.log("goGetFolderOpenDialog -> IPC", payload);
    ipcRenderer.send("goGetFolderOpenDialog", payload);
  },

  goGetSpecificFolder: (path: string) => {
    ipcRenderer.send("goGetSpecificFolder", path);
  },

  goGetFile: (payload?: string) => {
    console.log("goGetFile -> IPC", payload);
    ipcRenderer.send("getFile", payload);
  },

  sendMessage: (message: string) => {
    ipcRenderer.send("message", message);
  },

  // Window controls for AppBar
  Minimize: () => {
    ipcRenderer.send("minimize");
  },

  Maximize: () => {
    ipcRenderer.send("maximize");
  },

  Close: () => {
    ipcRenderer.send("close");
  },

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
};

contextBridge.exposeInMainWorld("Main", api);

/**
 * Using the ipcRenderer directly in the browser through the contextBridge is not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);
