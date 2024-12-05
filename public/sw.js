const CACHE_NAME = "static-cache-v2";
const PRECACHE_ASSETS = [
  "/", // Home page
  "/favicon.ico",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/manifest.webmanifest",
];

// Install event: Cache specific static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching precache assets");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Fetch event: Handle requests
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.includes("/_next/")) {
    // Cache Next.js assets dynamically
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
      )
    );
  } else if (!request.url.includes("/api/")) {
    // Handle static assets or fallback for offline
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).catch(() => {
            if (request.mode === "navigate") {
              return caches.match("/"); // Fallback to home page
            }
          })
        );
      })
    );
  }
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Sync event: Handle background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-input-data") {
    console.log("Sync event triggered:", event.tag);
    event.waitUntil(
      (async () => {
        try {
          if (!navigator.onLine) {
            console.log("Still offline, skipping sync.");
            return;
          }
          console.log("Syncing input data...");
          // Simulate a sync task, e.g., syncing data between IndexedDB and server 
          await syncData();
          console.log("Sync completed successfully.");
        } catch (err) {
          console.error("Sync failed:", err);
        }
      })()
    );
  }
});

// Mock sync function
async function syncData() {
  // Perform your sync logic, e.g., read/write from IndexedDB
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated async task
}