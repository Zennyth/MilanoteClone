import { Ref } from 'vue'
import { defineStore } from 'pinia'
import { getBoundingBox, snapValueToGrid } from '@/utils/grid'

import { syncedStore, getYjsDoc } from '@syncedstore/core'
import { WebsocketProvider } from 'y-websocket'
import { BoardComponentData, Shape, Vector2 } from '@/components/board/types'
import { EventHandler } from '@/utils/events'

import { Awareness } from 'y-protocols/awareness.js'

interface SnapSettings {
	enabled: boolean
	gridSize: number
}

interface AwarenessSettings {
	maxUsersToDisplay: number
}

interface BoardSettings {
	snap: SnapSettings
	awareness: AwarenessSettings
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
	onDragging: EventHandler<BoardComponentData>
	onDropped: EventHandler<BoardComponentData>

	hasMoved: boolean
	timeout: ReturnType<typeof setTimeout> | undefined
}

interface AwarenessUser {
	id: number
	name: string
	img: string
	mousePosition: Vector2
	color: string
}

interface AwarenessState {
	instance: Awareness | undefined,
	users: Array<AwarenessUser>,
}

interface BoardState {
	settings: BoardSettings
	sync: SyncState
	board: Ref<HTMLDivElement> | undefined
	viewport: Ref<HTMLDivElement> | undefined
	interaction: InteractionState
	awareness: AwarenessState
}

export const useBoardStore = defineStore('boardStore', {
	state: (): BoardState => ({
		settings: {
			snap: {
				enabled: true,
				gridSize: 22
			},
			zoom: 1.0,
			awareness: {
				maxUsersToDisplay: 2
			}
		},
		sync: {
			provider: null,
			doc: null,
			store: null
		},
		board: undefined,
		viewport: undefined,
		interaction: {
			isEvent: false,
			target: undefined,
			offset: { x: 0, y: 0 },
			isSelected: false,
			isDragging: false,
			onDragging: new EventHandler<BoardComponentData>(),
			onDropped: new EventHandler<BoardComponentData>(),
			hasMoved: false,
			timeout: undefined
		},
		awareness: {
			instance: undefined,
			users: []
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
		boundingBox(): Shape {
			return getBoundingBox(this.components);
		},
		zoom(): number {
			return this.settings.zoom;
		},
		draggedComponent(): BoardComponentData | undefined {
			return this.interaction.isDragging ? this.interaction.target : undefined;
		},

		// awareness
		me(): AwarenessUser | undefined {
			return this.awareness.instance !== undefined ? this.awareness.users.find(u => u.id === this.awareness.instance!.clientID) : undefined;
		},
		others(): AwarenessUser[] | undefined {
			return this.awareness.instance !== undefined ? this.awareness.users.filter(u => u.id !== this.awareness.instance!.clientID) : undefined;
		},
		numberOfUsersToHide(): number {
			return (this.others?.length ?? this.settings.awareness.maxUsersToDisplay) - this.settings.awareness.maxUsersToDisplay;
		},
		othersToDisplay(): AwarenessUser[] | undefined {
			return this.others?.slice(0, this.settings.awareness.maxUsersToDisplay);
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
		setViewport(viewport: HTMLDivElement | undefined) {
			this.viewport = viewport
		},

		// actions
		openBoard(board: HTMLDivElement | undefined, id: string) {
			// Create your SyncedStore store
			this.sync.store = syncedStore({ components: [], fragment: 'xml' })
			// Create a document that syncs automatically using Y-WebRTC
			this.sync.doc = getYjsDoc(this.sync.store)
			this.sync.provider = new WebsocketProvider(
				'ws://localhost:3000',
				id,
				this.sync.doc
			)

			const awareness = this.sync.provider.awareness as Awareness
			awareness.on('change', () => {
				const users: Array<AwarenessUser> = [];

				awareness.getStates().forEach((state, id) => {
					if (state.user) {
						users.push({ ...state.user, id })
					}
				});

				this.awareness.users = users;
			})
			board!.addEventListener('mousemove', (event: MouseEvent) => this.updateMousePosition({ x: event.offsetX, y: event.offsetY }))
			awareness.setLocalStateField('user', { ...mockProfiles.random(), mousePosition: { x: 0, y: 0 } })
			this.awareness.instance = awareness

			this.board = board
		},
		addComponent(data: BoardComponentData) {
			this.sync.store.components.push(data)
		},
		removeComponent(data: BoardComponentData) {
			this.sync.store.components.splice(this.sync.store.components.indexOf(data), 1);
		},
		addZoom(amount: number) {
			this.setZoom(this.zoom + amount);
		},
		scaleZoomToFit() {
			const viewportRect = this.viewport!.getBoundingClientRect()
			const boardRect = this.board!.getBoundingClientRect()

			const ratio: Vector2 = {
				x: viewportRect!.width / boardRect!.width * this.zoom,
				y: viewportRect!.height / boardRect!.height * this.zoom,
			}

			const newZoomLevel: number = Math.min(ratio.x, ratio.y)
			this.setZoom(newZoomLevel)
		},

		// awareness
		updateMousePosition(mousePosition: Vector2) {
			this.awareness.instance?.setLocalStateField('user', { ...this.me, mousePosition })
		}
	}
})

declare global {
	interface Array<T> {
		random(): T;
	}
}

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
}


const mockProfiles = [
	{
		name: "Asiya Javayant",
		img: "https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png",
		color: 'black'
	},
	{
		name: "Onyama Limba",
		img: "https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png",
		color: 'black'
	},
	{
		name: "Ioni Bowcher",
		img: "https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png",
		color: 'black'
	},
	{
		name: "Xuxu Feng",
		img: "https://primefaces.org/cdn/primevue/images/avatar/xuxuefeng.png",
		color: 'black'
	},
	{
		name: "Amy Elsner",
		img: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png",
		color: 'black'
	}
]