import { BaseScreen } from "./BaseScreen.js";
import { StackIF } from "./ScreenStackIF.js";

export class MapScreen extends BaseScreen {
    name = "MapScreen";
    ctx;
    canvas;

    constructor() {
        super();
        this.canvas = <HTMLCanvasElement> document.getElementById('canvas1');
        this.ctx = <CanvasRenderingContext2D> this.canvas.getContext('2d');
    }

    elapsed(elapsed: number): void {
        this.ctx.fillRect(0,0,500,500);
    }

    onKeyDown(event: KeyboardEvent, stack:StackIF): void {
        if (event.code == "KeyB") {stack.pop(); return;};
    }
}