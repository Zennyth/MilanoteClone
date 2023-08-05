interface IEventHandler<T = void> {
	subscribe(callback: (args?: T) => void): void
	unsubscribe(callback: (args?: T) => void): void

	fire(args?: T): void
}

export class EventHandler<T = void> implements IEventHandler<T> {
	handlers: { [id: string]: (args?: T) => void } = {}

	subscribe(callback: (args?: T | undefined) => void): void {
		this.handlers[callback.toString()] = callback
	}
	unsubscribe(callback: (args?: T | undefined) => void): void {
		delete this.handlers[callback.toString()]
	}

	fire(args?: T | undefined): void {
		Object.values(this.handlers).forEach(c => c(args));
	}
}