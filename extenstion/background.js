chrome.storage.local.get('token', (result) => {
  if (result.token) {
    chrome.contextMenus.create({
      id: 'ViewDashboard',
      title: 'View Dashboard',
      contexts: ['page'],
      visible: true,
    });
    chrome.contextMenus.create({
      id: 'logout',
      title: 'Logout',
      contexts: ['page'],
      visible: true,
    });
    chrome.contextMenus.create({
      id: 'login',
      title: 'Login',
      contexts: ['page'],
      visible: false,
    });
    chrome.contextMenus.create({
      id: 'show',
      title: 'Show',
      contexts: ['page'],
      visible: false,
    });
    chrome.contextMenus.create({
      id: 'hide',
      title: 'Hide',
      contexts: ['page'],
      visible: true,
    });

  } else {
    chrome.contextMenus.create({
      id: 'login',
      title: 'Login',
      contexts: ['page'],
      visible: true,
    });
    chrome.contextMenus.create({
      id: 'logout',
      title: 'Logout',
      contexts: ['page'],
      visible: false,
    });
    chrome.contextMenus.create({
      id: 'ViewDashboard',
      title: 'View Dashboard',
      contexts: ['page'],
      visible: false,
    });
    chrome.contextMenus.create({
      id: 'show',
      title: 'Show',
      contexts: ['page'],
      visible: false,
    });

    chrome.contextMenus.create({
      id: 'hide',
      title: 'Hide',
      contexts: ['page'],
      visible: false,
    });
  }
});

chrome.contextMenus.onClicked.addListener((info) => {

  if (info.menuItemId === 'hide') {
    chrome.contextMenus.update('hide', { visible: false }, () => {
      chrome.contextMenus.update('show', { visible: true }, () => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'contextHide' }, () => {
            console.log(chrome.runtime.lastError.message) 
          })
        })
      });
    });
  }

  if (info.menuItemId === 'show') {
    chrome.contextMenus.update('hide', { visible: true }, () => {
      chrome.contextMenus.update('show', { visible: false }, () => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'contextShow' }, () => {
            console.log(chrome.runtime.lastError.message) 
          })
        })
      });
    });
  }

  if (info.menuItemId === 'logout') {
    chrome.storage.local.get('token', (result) => {
      if (result.token) {
        return signOut();
      } else {
        return chrome.contextMenus.update('logout', { visible: false });
      }
    });
  }

  if (info.menuItemId === 'login') {
    chrome.storage.local.get('token', (result) => {
      if (!result.token) {
        return login();
      } else {
        return chrome.contextMenus.update('login', { visible: true });
      }
    });
  }

  if (info.menuItemId === 'ViewDashboard') {
    chrome.storage.local.get('token', (result) => {
      if (result.token) {
        return chrome.tabs.create({
          url: 'https://www.savethisjob.com/dashboard',
        });
      } else {
        return chrome.contextMenus.update('ViewDashboard', { visible: true });
      }
    });
  }

});

let timeout
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getToken') {
    return login();
  }

  if (request.type === 'jobSaveSuccess') {
    const notificationOptions = {
      type: 'basic',
      iconUrl: './images/icon48.png',
      title: 'Job Save Success!',
      message: 'Your Job url was successfully saved to your dashboard!',
    };
    return chrome.notifications.create(notificationOptions);
  }

  if (request.type === 'Error') {
    const notificationOptions = {
      type: 'basic',
      iconUrl: './images/icon48.png',
      title: 'Job Save Error',
      message:
        'There was a problem saving your job post to the database. Please try again later.',
    };
    return chrome.notifications.create(notificationOptions);
  }

  if (request.type === 'tokenSet') {
    chrome.contextMenus.update('logout', { visible: true }, function () {
      chrome.contextMenus.update('login', { visible: false }, function () {
        chrome.contextMenus.update('ViewDashboard', { visible: true }, function () {
          chrome.contextMenus.update('hide', { visible: true }, function () {
            chrome.contextMenus.update('show', { visible: false }, function() {
              chrome.tabs.onActivated.addListener(function (activeInfo) {
                chrome.tabs.onUpdated.addListener(function () {
                  chrome.tabs.sendMessage(activeInfo.tabId, { type: 'show' })
                  runTokenTimer()
                })
              })
            })
          })
        });
      });
    });
  }

  function runTokenTimer() {
    timeout = setTimeout(() => {
      chrome.contextMenus.update('logout', { visible: false }, function () {
        chrome.contextMenus.update('login', { visible: true }, function () {
          chrome.contextMenus.update('ViewDashboard', { visible: false }, () => {
            chrome.contextMenus.update('hide', { visible: false }, function () {
              chrome.contextMenus.update('show', { visible: false }, function() {
                chrome.storage.local.remove('token')
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                  chrome.tabs.sendMessage(tabs[0].id, { type: "hide" })
                })
              })
            })
          });
        })
      })
    }, 3000000)

    return timeout
  }

});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.local.get('token', (request) => {
    if (request.token) {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'showForm' }, () => {
          console.log(chrome.runtime.lastError.message) 
        })
      })
    } else {
      login()
    }
  })
});

function login() {
  chrome.tabs.create(
    { url: 'http://localhost:3000/login' },
    function () {
      chrome.tabs.onUpdated.addListener(() => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (
          tabs,
        ) {
          const tabId = tabs[0].id;
          chrome.tabs.sendMessage(tabId, { type: 'getTokenFromStorage' });
        });
      });
    },
  );
}

function signOut() {
  chrome.storage.local.remove('token', function () {
    chrome.runtime.lastError
    chrome.contextMenus.update('login', { visible: true }, function () {
      chrome.contextMenus.update('logout', { visible: false }, function () {
        chrome.contextMenus.update('ViewDashboard', { visible: false }, function () {
          chrome.contextMenus.update('hide', { visible: false }, function () {
            chrome.contextMenus.update('show', { visible: false }, function() {
              chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "hide" })
                clearTimeout(timeout)
                const notificationOptions = {
                  type: 'basic',
                  iconUrl: './images/icon48.png',
                  title: 'Sign-Out Success!',
                  message:
                    'Your are now logged off. Try saving a new job to log back in!',
                };
                return chrome.notifications.create(notificationOptions);
              })
            })
          })
        })
      });
    });
  });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.runtime.lastError
  chrome.tabs.sendMessage(activeInfo.tabId, { type: "tabActivated" }, () => {
    chrome.runtime.lastError
    console.log('tabActivated message sent')
  })
})



