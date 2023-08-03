import { defineStore } from "pinia";
import { snapValueToGrid } from "@/utils/grid";

export const useBoardStore = defineStore("boardStore", {
  state: () => ({
    settings: {
      snap: {
        enabled: true,
        gridSize: 22
      }
    },
    sync: {
      provider: null,
      doc: null,
      store: null
    }
  }),
  getters: {
    computeSnapValue: (state) => (value) => state.settings.snap.enabled ? snapValueToGrid(value, state.settings.snap.gridSize) : value,
  },
  actions: {
    openBoard(id) {
      
    }
  },
});