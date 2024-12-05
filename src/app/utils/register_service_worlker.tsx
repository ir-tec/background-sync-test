"use client";

import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      // Register the Service Worker if not already registered
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (!registration) {
            // Register the Service Worker
            return navigator.serviceWorker
              .register("/sw.js")
              .then((register) => {
                console.log(
                  "Service Worker registered with scope:",
                  register.scope
                );
                return register;
              });
          }
          console.log(
            "Service Worker already registered with scope:",
            registration.scope
          );
          return registration;
        })
        .then(async (registration) => {
          // Wait for the Service Worker to be ready
          return navigator.serviceWorker.ready.then(() => registration);
        })
        .then((registration) => {
          // Register the sync event
          registration.sync
            .register("sync-input-data")
            .then(() => {
              console.log("Sync event registered successfully.");
            })
            .catch((error) => {
              console.error("Sync registration failed:", error);
            });
        })
        .catch((error) => {
          console.error("Service Worker setup failed:", error);
        });
    } else {
      console.warn(
        "Service Worker or SyncManager not supported in this browser"
      );
    }
  }, []);
}
interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

declare global {
  interface ServiceWorkerRegistration {
    readonly sync: SyncManager;
  }

  interface SyncEvent {
    readonly lastChance: boolean;
    readonly tag: string;
  }

  interface ServiceWorkerGlobalScopeEventMap {
    sync: SyncEvent;
  }
}
