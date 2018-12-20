var appVersion = '0.0.1';
var CACHE_NAME = 'sw-cache-' + appVersion;
var urlsToCache = [
  'index.html',
  'favicon.ico',
  'logo.png',
  'logo.svg',
  'browser-matrix.min.js',
  'favico.js',
  'script.js',
  'style.css',
  'data.html',
  'jax.webmanifest'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  if (event.registerForeignFetch) {
  event.registerForeignFetch({
    scopes: [self.registration.scope],
    origins: ['*']
  });
  }
});

self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                var cacheRequest = event.request.clone();
                cache.put(cacheRequest, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('foreignfetch', event => {
  // The new Request will have credentials omitted by default.
  const noCredentialsRequest = new Request(event.request.url);
  event.respondWith(
    // Replace with your own request logic as appropriate.
    fetch(noCredentialsRequest)
      .catch(() => caches.match(noCredentialsRequest))
      .then(response => ({response}))
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', function(event) {

  if (event.tag == 'refreshCache') {
    event.waitUntil(function(){
	  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
	});
  }

});