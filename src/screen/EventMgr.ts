import { FrameTime } from "../module/FrameTime.js";
import { RawScreenIF } from "./RawScreenIF.js";
import { ScreenIF } from "./ScreenIF.js";

export class EventMgr {
    screen:RawScreenIF;
    ctx:CanvasRenderingContext2D;
    fps:number;
    fpsInterval:number;
    now:number;
    then:number;
    elapsed;
    frameTime:FrameTime;
    static instance:EventMgr;

    constructor(scr:RawScreenIF) {
        this.screen = scr;
        console.log("evtmgr constructor"+scr);
        const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
        this.ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
        canvas.width = 1280;
        canvas.height = 800;
        this.now = this.then = this.elapsed = 0;//Date.now();
        this.fps = 60;
        this.fpsInterval = 1/this.fps; //1s / fps

        canvas.addEventListener('mousedown', evt => this.onMouseDown(evt), false);
        canvas.addEventListener('mouseup'  , evt => this.onMouseUp(evt), false);
        canvas.addEventListener('keydown'  , evt => this.onKeyDown(evt), false);
        canvas.addEventListener('keyup'    , evt => this.onKeyUp(evt), false);
        this.frameTime = new FrameTime();

        this.animate();
    }

    animate = () => {
        this.elapsed += this.frameTime.Update();
        //if (this.frameTime.GetFrameCounter() %60 ==0) console.log(this.elapsed);
        if (this.elapsed >= this.fpsInterval)
        {
            this.elapsed =0;
        }
        this.screen.elapsed(this.elapsed);

        requestAnimationFrame(this.animate);
    }

    onMouseDown(evt:MouseEvent) {this.screen.onMouseDown(evt);}
    onMouseUp(evt:MouseEvent) {this.screen.onMouseUp(evt);}
    onKeyDown(evt:KeyboardEvent) {this.screen.onKeyDown(evt);}
    onKeyUp(evt:KeyboardEvent) {this.screen.onKeyUp(evt);}
  
    static getInstance():EventMgr {
        return this.instance;
    }
    static RunScreen(rawScreen:RawScreenIF) {
        this.instance = new EventMgr(rawScreen);
        return this.instance;
     }
}