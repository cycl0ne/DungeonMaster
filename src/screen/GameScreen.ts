import { GameEngine } from "../game/GameEngine.js";
import { BaseScreen } from "./BaseScreen.js";
import { MapScreen } from "./MapScreen.js";
import { StackIF } from "./ScreenStackIF.js";

export class GameScreen extends BaseScreen {
    name = "GameScreen";
    game:GameEngine;

    constructor() {
        super();
        const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
        const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
        this.game = new GameEngine(ctx);
    }

    elapsed(elapsed:number):void {
        super.elapsed(elapsed);
        this.game.update(elapsed);
        this.game.render(elapsed);
    }

    onMouseDown(event: MouseEvent, stack:StackIF): void {this.game.onMouseDown(event);}    
    onMouseUp(event: MouseEvent, stack:StackIF): void {this.game.onMouseUp(event);}  
    onKeyDown(event: KeyboardEvent, stack:StackIF): void {
        this.game.onKeyDown(event);
        if (event.code == "KeyB") {
            //stack.push(new MapScreen());
        }
    }  

    onKeyUp(event: KeyboardEvent): void {this.game.onKeyUp(event);}  
}
