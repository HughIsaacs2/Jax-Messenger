chrome.browserAction.setPopup({popup: ''});

chrome.browserAction.onClicked.addListener(function(details) {
   /*
        chrome.tabs.create({
            url: chrome.runtime.getURL("/index.html?platform=chromeExtension")
        });
     */
     
  chrome.windows.create({
            url: chrome.runtime.getURL("/index.html?platform=chromeExtension"),
            type: "popup"
  });
    
});