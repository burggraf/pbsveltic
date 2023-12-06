/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

// get rid of annoying workbox logs in console
self.__WB_DISABLE_DEV_LOGS = true

declare let self: ServiceWorkerGlobalScope

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

  const adminPathRegExp = new RegExp('^\/_\/.*');

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  // { allowlist, denylist:  [new RegExp('/api/')], },
  { allowlist, denylist:  [  /(_|api)(\/.*)?$/  ] },


  // [  /(_|api)(\/.*)?$/  ]
  ))

