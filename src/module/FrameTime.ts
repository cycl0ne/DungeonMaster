export class FrameTime {
    initialized:boolean;
    previousFrameTime:number;
    deltaTime:number;
    frameCounter:number;

    constructor() {
        this.initialized = false;
        this.previousFrameTime = 0;
        this.deltaTime = 0;
        this.frameCounter = 0;
    }

    Update() {
        if (!this.initialized)
        {
            this.previousFrameTime = Date.now();
            this.initialized = true;
        }

        this.frameCounter++;
        let currentFrameTime = 0;

        currentFrameTime = Date.now();
        this.deltaTime = currentFrameTime-this.previousFrameTime;
        this.previousFrameTime = currentFrameTime;

        if (this.deltaTime > 1/10) this.deltaTime = 1/60;
        else if (this.deltaTime <= 0) this.deltaTime = 1/60;
        return this.deltaTime;
    }

    GetDeltaTime() {
        return this.deltaTime;
    }

    GetFrameCounter() {
        return this.frameCounter;
    }
}