import { Ref } from 'vue'
import { defineStore } from 'pinia'
import { getBoundingBox, snapValueToGrid } from '@/utils/grid'

import { syncedStore, getYjsDoc } from '@syncedstore/core'
import { WebsocketProvider } from 'y-websocket'
import { BoardComponentData, Shape, Vector2 } from '@/components/board/types'

interface SnapSettings {
  enabled: boolean
  gridSize: number
}

interface BoardSettings {
  snap: SnapSettings
}

interface SyncState {
  provider: any
  doc: any
  store: any
}

interface InteractionState {
  isEvent: boolean
  target: Ref<BoardComponentData> | undefined
  offset: Vector2

  isSelected: boolean

  isDragging: boolean
  hasMoved: boolean
  timeout: ReturnType<typeof setTimeout> | undefined
}

interface BoardState {
  settings: BoardSettings
  sync: SyncState
  board: Ref<HTMLDivElement> | undefined
  interaction: InteractionState
}

export const useBoardStore = defineStore('boardStore', {
  state: (): BoardState => ({
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
    },
    board: undefined,
    interaction: {
      isEvent: false,
      target: undefined,
      offset: { x: 0, y: 0 },
      isSelected: false,
      isDragging: false,
      hasMoved: false,
      timeout: undefined
    }
  }),
  getters: {
    snapValue:
      (state) =>
      (value: number): number =>
        state.settings.snap.enabled ? snapValueToGrid(value, state.settings.snap.gridSize) : value,
    snapVector2() {
      return (vector: Vector2 ): Vector2 => ({
        x: this.snapValue(vector.x),
        y: this.snapValue(vector.y)
      });
    },
    components(): Array<BoardComponentData> {
      return this.board !== undefined ? this.sync.store.components : []
    },
    getComponentsBoundingClientRect(): Shape {
      return getBoundingBox(this.components);
    }
  },
  actions: {
    openBoard(board: HTMLDivElement | undefined, _id: string) {
      // Create your SyncedStore store
      this.sync.store = syncedStore({ components: [], fragment: 'xml' })
      // Create a document that syncs automatically using Y-WebRTC
      this.sync.doc = getYjsDoc(this.sync.store)
      this.sync.provider = new WebsocketProvider(
        'ws://localhost:8080',
        'syncedstore-board-5',
        this.sync.doc
      )

      this.board = board
    },
    addComponent(data: BoardComponentData) {
      this.sync.store.components.push(data)
    }
  }
})
