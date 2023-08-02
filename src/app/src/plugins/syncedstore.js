import * as Vue from "vue";
import { enableVueBindings } from "@syncedstore/core";

export default {
  install(app) {
    enableVueBindings(Vue);
  }
}