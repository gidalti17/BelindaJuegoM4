/* ============================================================
   SERVICE WORKER V2 - Actualizado para forzar limpieza
   ============================================================ */
const CACHE_NAME = 'belinda-core-v2'; // <--- CAMBIADO A V2

const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './luz.jpg',
  './manifest.json',
  './contaminacion.mp4' // Agregado para que el video también cargue offline
];

// Instalación: Guarda los nuevos archivos en caché
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache V2 instalada');
            return cache.addAll(assets);
        })
    );
    self.skipWaiting(); // Fuerza a que el nuevo SW se active de inmediato
});

// Activación: Borra la versión vieja (v1) para liberar espacio
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Toma el control de la página inmediatamente
});

// Estrategia de respuesta: Primero busca en caché, si no, va a internet
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    );
});