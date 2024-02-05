import { StorageMsg } from "./msg";
import { MessageQueue } from "./queue";

const KEY = "prfs_msg";

export function createStorageKey(appId: string) {
  return `${KEY}__${appId}`;
}

export function dispatchStorageMsg(msg: StorageMsg<any>) {
  if (msg.appId) {
    console.log("dispatch appId: %s", msg.appId);
    const ky = createStorageKey(msg.appId);
    window.localStorage.setItem(ky, msg.value);
  } else {
    console.error("Storage msg needs appId");
  }
}

export async function setupStorageListener(messageQueue: MessageQueue) {
  async function listener(ev: StorageEvent) {
    console.log("ev", ev);
    if (ev.key) {
      const port = messageQueue.dequeue(ev.key);
      if (port) {
        port.postMessage(ev.newValue);
        // window.localStorage.removeItem(ev.key);
      }
    }
  }

  console.log("Setting up storage listener", window.location.host);
  window.addEventListener("storage", listener);
  return listener;
}
