"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

if (window.location.protocol != "https:") {window.location.protocol = "https:";}

if (window.applicationCache) {
window.applicationCache.addEventListener('updateready', function(){
		console.log("AppCache: Update found.");
		window.applicationCache.swapCache();
		window.location.reload(true);
}, false);
window.applicationCache.addEventListener('updateready', function(){
		console.log("AppCache: Updating.");
}, false);
window.applicationCache.addEventListener('noupdate', function(){
	console.log("AppCache: No updates."); 
}, false);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
  
  // Listen for claiming of our ServiceWorker
  navigator.serviceWorker.addEventListener('controllerchange', function(event) {
  // Listen for changes in the state of our ServiceWorker
    navigator.serviceWorker.controller.addEventListener('statechange', function() {
    // If the ServiceWorker becomes "activated", let the user know they can go offline!
      if (this.state === 'activated') {
      // Reload like you would with AppCache
      window.location.reload(true);
      }
    });
  });

}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(function(reg) {
    return reg.sync.register('refreshCache');
	console.log("Background sync registered.");
  }).catch(function() {
    // system was unable to register for a sync,
    // this could be an OS-level restriction
    console.log("Couldn't register for background sync.");
  });
} else {
  // serviceworker/sync not supported
  console.log("Background sync not supported.");
}



console.log("Loading browser sdk");

var client = matrixcs.createClient("https://matrix.org");
client.publicRooms(function (err, data) {
    if (err) {
	   console.error("err %s", JSON.stringify(err));
       return;
    }
    console.log("data %s [...]", JSON.stringify(data).substring(0, 100));
    console.log("Congratulations! The SDK is working on the browser!");
    var result = document.getElementById("result");
    result.innerHTML = "<p>The SDK appears to be working correctly.</p>";
});