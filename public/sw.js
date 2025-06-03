/**
 * Service Worker for Daily Check-in Push Notifications
 * InvoicePatch - Alberta Contractor System
 */

const CACHE_NAME = 'invoicepatch-v1';
const NOTIFICATION_TAG = 'daily-checkin';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/daily-checkin',
        '/trial-dashboard',
        '/offline.html'
      ]);
    })
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients
  self.clients.claim();
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  let notificationData = {
    title: 'InvoicePatch Daily Check-in',
    body: 'Time to log today\'s work - Quick 2-minute check-in',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: NOTIFICATION_TAG,
    requireInteraction: false,
    actions: [
      {
        action: 'checkin',
        title: 'Log Work Now',
        icon: '/action-checkin.png'
      },
      {
        action: 'later',
        title: 'Remind Later',
        icon: '/action-later.png'
      }
    ],
    data: {
      url: '/daily-checkin',
      timestamp: Date.now()
    }
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData,
        data: {
          ...notificationData.data,
          ...pushData.data
        }
      };
    } catch (error) {
      console.error('[SW] Error parsing push data:', error);
    }
  }

  // Show notification based on type
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  if (action === 'later') {
    // Schedule a reminder for 30 minutes later
    scheduleReminderLater();
    return;
  }
  
  // Default action or 'checkin' action - open daily check-in page
  const urlToOpen = data.url || '/daily-checkin';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if daily check-in page is already open
      for (let client of clientList) {
        if (client.url.includes('/daily-checkin') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Check if any InvoicePatch page is open
      for (let client of clientList) {
        if (client.url.includes(self.location.origin) && 'navigate' in client) {
          return client.navigate(urlToOpen).then(() => client.focus());
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for offline check-ins
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'daily-checkin-sync') {
    event.waitUntil(syncPendingCheckIns());
  }
});

// Fetch event - handle network requests with offline support
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(request);
        })
    );
    return;
  }
  
  // Handle page requests with cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// Helper function to schedule reminder later
function scheduleReminderLater() {
  // This would typically integrate with a backend scheduling service
  console.log('[SW] Scheduling reminder for later');
  
  // For now, just show a local notification after 30 minutes
  setTimeout(() => {
    self.registration.showNotification('Daily Check-in Reminder', {
      body: 'Don\'t forget to log today\'s work before end of day',
      icon: '/icon-192x192.png',
      tag: NOTIFICATION_TAG + '-reminder',
      data: {
        url: '/daily-checkin'
      }
    });
  }, 30 * 60 * 1000); // 30 minutes
}

// Helper function to sync pending check-ins
async function syncPendingCheckIns() {
  try {
    // Get pending check-ins from IndexedDB
    const pendingCheckIns = await getPendingCheckIns();
    
    for (const checkIn of pendingCheckIns) {
      try {
        const response = await fetch('/api/daily-checkin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkIn.data)
        });
        
        if (response.ok) {
          // Remove from pending list
          await removePendingCheckIn(checkIn.id);
          console.log('[SW] Synced pending check-in:', checkIn.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync check-in:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Error during sync:', error);
  }
}

// IndexedDB helpers for offline storage
function getPendingCheckIns() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InvoicePatchDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingCheckIns'], 'readonly');
      const store = transaction.objectStore('pendingCheckIns');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('pendingCheckIns')) {
        db.createObjectStore('pendingCheckIns', { keyPath: 'id' });
      }
    };
  });
}

function removePendingCheckIn(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InvoicePatchDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingCheckIns'], 'readwrite');
      const store = transaction.objectStore('pendingCheckIns');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
}); 