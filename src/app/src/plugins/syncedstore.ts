import * as Vue from "vue";
import { Plugin } from 'vue';

import { enableVueBindings } from "@syncedstore/core";

export const SyncedstorePlugin: Plugin = {
  install() {
    enableVueBindings(Vue);
  }
}