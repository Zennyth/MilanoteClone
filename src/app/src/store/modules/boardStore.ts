import { Ref } from 'vue'
import { defineStore } from 'pinia'
import { getBoundingBox, snapValueToGrid } from '@/utils/grid'

import { syncedStore, getYjsDoc } from '@syncedstore/core'
import { WebsocketProvider } from 'y-websocket'
import { BoardComponentData, Shape, Vector2 } from '@/components/board/types'
import { EventHandler } from '@/utils/events'

interface SnapSettings {
	enabled: boolean
	gridSize: number
}

interface BoardSettings {
	snap: SnapSettings
	zoom: number
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
	onDropped: EventHandler<BoardComponentData>

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
			},
			zoom: 1.0
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
			onDropped: new EventHandler<BoardComponentData>(),
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
			return (vector: Vector2): Vector2 => ({
				x: this.snapValue(vector.x),
				y: this.snapValue(vector.y)
			});
		},
		components(): Array<BoardComponentData> {
			return this.board !== undefined ? this.sync.store.components : []
		},
		getComponentsBoundingClientRect(): Shape {
			return getBoundingBox(this.components);
		},
		zoom(): number {
			return this.settings.zoom;
		},
		draggedComponent(): BoardComponentData | undefined {
			return this.interaction.isDragging ? this.interaction.target : undefined;
		}
	},
	actions: {
		// commit
		setZoom(zoom: number) {
			if (this.board === undefined)
				return;

			this.settings.zoom = zoom;
			this.board!.style.transform = `matrix3d(${zoom}, 0, 0, 0, 0, ${zoom}, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`;
		},

		// actions
		openBoard(board: HTMLDivElement | undefined, _id: string) {
			// Create your SyncedStore store
			this.sync.store = syncedStore({ components: [], fragment: 'xml' })
			// Create a document that syncs automatically using Y-WebRTC
			this.sync.doc = getYjsDoc(this.sync.store)
			this.sync.provider = new WebsocketProvider(
				'ws://localhost:8080',
				'syncedstore-board-21',
				this.sync.doc
			)

			this.board = board
		},
		addComponent(data: BoardComponentData) {
			this.sync.store.components.push(data)
		},
		removeComponent(data: BoardComponentData) {
			this.sync.store.components.splice(this.sync.store.components.indexOf(data), 1);		},
		addZoom(amount: number) {
			this.setZoom(this.zoom + amount);
		}
	}
})
