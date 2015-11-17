class Trainer {
	private onTickCB : Function;
	private tickCount;

	constructor(onTickCB : Function) {
		this.tickCount = 0;
		this.onTickCB = onTickCB;
	}

	public onTick() {
		this.tickCount++;
		this.onTickCB();
	}

	public getTicks() {
		return this.tickCount;
	}
}

export = Trainer;