class Timer {
	private onTickCB : Function;
	private tickCount;

	constructor(onTickCB : Function) {
		this.tickCount = 0;
		this.onTickCB = onTickCB;
	}

	protected onTick() {
		this.tickCount++;
		this.onTickCB();
	}

	public getTicks() {
		return this.tickCount;
	}
}

export = Timer;