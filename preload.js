// const { remote } = require('electron');
const { ipcRenderer } = require('electron');
// let currWindow = remote.BrowserWindow.getFocusedWindow();
// const { v4: uuid } = require('uuid');
// const ejs = require('ejs');

//const net = require('net');

const DEVICE = require('./src/device.js');
const PLUGINS = require('./src/plugins.js');
const SEARCH = require('./src/search.js');
const VIEW = require('./src/view.js');
const SAVESLOTS = require('./src/saveSlots.js');

window.addDevice = DEVICE.addDevice;

window.init = function () {
  console.log('init!');

  ipcRenderer.send('enableDeviceDropdown');
  ipcRenderer.send('enableSearchAll');

  PLUGINS.init(() => {
    VIEW.init();
    SAVESLOTS.loadDevices();
    SAVESLOTS.loadSlot(1);
  });

  document.getElementById('device-settings-table').onclick = function (e) {
    e.stopPropagation();
  };
  document.getElementById('device-settings-name').onchange = function (e) {
    e.stopPropagation();
    DEVICE.changeActiveName(e.target.value);
  };
  document.getElementById('device-settings-plugin-dropdown').onchange =
    function (e) {
      e.stopPropagation();
      DEVICE.changeActiveType(e.target.value);
    };
  document.getElementById('device-settings-ip').onchange = function (e) {
    e.stopPropagation();
    DEVICE.changeActiveIP(e.target.value);
  };
  document.getElementById('device-settings-port').onchange = function (e) {
    e.stopPropagation();
    DEVICE.changeActivePort(e.target.value);
  };
  document.getElementById('device-settings-pin').onchange = function (e) {
    e.stopPropagation();
    if (e.target.checked) {
      VIEW.pinActiveDevice();
    } else {
      VIEW.unpinActiveDevice();
    }
  };

  document.getElementById('save-slot-1').onclick = function (e) {
    e.stopPropagation();
    SAVESLOTS.loadSlot(1);
  };
  document.getElementById('save-slot-2').onclick = function (e) {
    e.stopPropagation();
    SAVESLOTS.loadSlot(2);
  };
  document.getElementById('save-slot-3').onclick = function (e) {
    e.stopPropagation();
    SAVESLOTS.loadSlot(3);
  };

  document.getElementById('refresh-device-button').onclick = function (e) {
    e.stopPropagation();
    DEVICE.refreshActive();
  };

  document.getElementById('device-list').onclick = function (e) {
    e.stopPropagation();
    const deviceID = e.srcElement.id;
    if (e.srcElement.id != 'device-list') {
      VIEW.switchDevice(deviceID);
    }
  };

  document.getElementById('add-device-button').onchange = function (e) {
    DEVICE.registerDevice({
      type: e.target.value,
      defaultName: 'New Device',
      port: undefined,
      addresses: [],
    });
    e.target.selectedIndex = 0;

    SAVESLOTS.saveAll();
  };

  document.onkeyup = function (e) {
    switch (e.key) {
      case 'ArrowUp':
        VIEW.selectPreviousDevice();
        break;
      case 'ArrowDown':
        VIEW.selectNextDevice();
        break;
      case 'Tab':
        if (
          document.activeElement.tagName != 'INPUT' &&
          document.activeElement.tagName != 'SELECT'
        ) {
          document.getElementById('device-settings-name').select();
        }
        break;
    }
  };

  // document.getElementById("device-settings-delete").onclick = function(e){
  //  e.stopPropagation();
  //  confirm("Are you sure you want to delete device \n\""+VIEW.getActiveDevice().name+"\"?")
  // }

  document.getElementById('device-list-col').onclick = function (e) {
    try {
      document
        .querySelector('#device-list .active-device')
        .classList.remove('active-device');
      ipcRenderer.send('disableDeviceDropdown', '');
    } catch (err) {
      // console.log(err)
    }
    try {
      document
        .getElementsByClassName('active-device-outline')[0]
        .classList.remove('active-device-outline');
    } catch (err) {
      // console.log(err)
    }

    VIEW.switchDevice();
  };
};

ipcRenderer.on('setActiveDevicePinned', (event, message) => {
  if (!message) {
    VIEW.unpinActiveDevice();
  } else {
    VIEW.pinActiveDevice();
  }
});

ipcRenderer.on('doSearch', (event, message) => {
  window.searchAll();
});

ipcRenderer.on('doDelete', (event, message) => {
  DEVICE.deleteActive();
});

ipcRenderer.on('resetViews', (event, message) => {
  SAVESLOTS.resetSlots();
});

ipcRenderer.on('doSlots1', (event, message) => {
  SAVESLOTS.loadSlot(1);
});
ipcRenderer.on('doSlots2', (event, message) => {
  SAVESLOTS.loadSlot(2);
});
ipcRenderer.on('doSlots3', (event, message) => {
  SAVESLOTS.loadSlot(3);
});

function switchClass(element, className) {
  try {
    document.getElementsByClassName(className)[0].classList.remove(className);
  } catch (err) {
    // console.log(err)
  }
  element.classList.add(className);
}
window.switchClass = function (element, className) {
  switchClass(element, className);
};
