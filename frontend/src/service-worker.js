/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

import EncryptionUtils from "../utils/EncryptionUtils";
// SW SETUP

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    (url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg")),
  new CacheFirst({
    cacheName: "eduapp_images",
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
);

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(({ request, url }) => {
  if (request.mode !== "navigate") {
    return false;
  }

  if (url.pathname.startsWith("/app/_")) {
    return false;
  }

  if (url.pathname.match(fileExtensionRegexp)) {
    return false;
  }

  return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html"));

// EVENTS

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clientsClaim();
});

self.addEventListener("message", (event) => {
  if (event.data) {
    switch (event.data.type) {
      case "SKIP_WAITING":
        self.skipWaiting();
        break;
      default:
        break;
    }
  }
});


self.addEventListener('push', e => {
  const data = JSON.parse(e.data.text());
  const title = data.title;
  console.log("e locoS: ", e)
  console.log("data locoS: ", data);

  let body = data.body;
  if (data.privKey) body = EncryptionUtils.decrypt(data.body, atob(data.privKey))
  console.log(body)

  const options = {
    openUrl: '/',
    data: {
      url: data.url,
      id: data.user
    },
    body: body ? body : "Hola caracola",
    icon: data.icon
  };

  e.waitUntil(self.registration.showNotification(title, options));

});


self.addEventListener('notificationclick', event => {

  const notificacion = event.notification;

  const response = self.clients.matchAll()
    .then(all_clients => {

      let client = all_clients.find(c => {
        return c.visibilityState === 'visible';
      });

      if (client !== undefined) {
        client.navigate(notificacion.data.url);
        client.focus();
      } else {
        self.clients.openWindow(notificacion.data.url);
      }
      return notificacion.close();
    });

  event.waitUntil(response);
});
