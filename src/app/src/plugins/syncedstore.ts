import * as Vue from "vue";
import { Plugin, App } from 'vue';

import { enableVueBindings } from "@syncedstore/core";

export const SyncedstorePlugin: Plugin = {
	install(app: App) {
		app.config.warnHandler = (msg, _instance, trace) => {
			console.log(msg, trace)
		}

		enableVueBindings(Vue);
	}
}