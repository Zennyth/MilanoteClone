import { syncedStore, getYjsDoc } from "@syncedstore/core";

// Create your SyncedStore store
export const store = syncedStore({ components: [], fragment: "xml" });

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(store);

import { WebsocketProvider } from 'y-websocket'
const provider = new WebsocketProvider("ws://localhost:8080", "syncedstore-board-4", doc)

// import { WebrtcProvider } from "y-webrtc";
// const provider = new WebrtcProvider("syncedstore-board-5", doc);

export const disconnect = () => provider.disconnect();
export const connect = () => provider.connect();
