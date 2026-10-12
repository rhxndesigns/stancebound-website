
/* STANCEBOUND Admin Push Service Worker */

self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      body: event.data ? event.data.text() : ""
    };
  }

  const title = data.title || "STANCEBOUND Admin";
  const options = {
    body: data.body || "You have a new notification.",
    icon: "/favicon.png",
    badge: "/favicon.png",
    tag: data.tag || "stancebound-booking",
    renotify: true,
    data: {
      url: data.url || "/admin/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const destination = new URL(
    event.notification.data?.url || "/admin/",
    self.location.origin
  );

  if (destination.origin !== self.location.origin) {
    return;
  }

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async (windows) => {
      for (const windowClient of windows) {
        if (windowClient.url.startsWith(destination.origin + "/admin/")) {
          await windowClient.focus();
          if ("navigate" in windowClient) {
            return windowClient.navigate(destination.href);
          }
          return;
        }
      }

      return clients.openWindow(destination.href);
    })
  );
});
