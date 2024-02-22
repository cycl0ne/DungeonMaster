import { EventMgr } from "./EventMgr.js";
import { RawScreenIF } from "./RawScreenIF.js";
import { ScreenIF } from "./ScreenIF.js";
import { StackIF } from "./ScreenStackIF.js";

export class ScreenStack implements StackIF, RawScreenIF {
    name='stack';
    s:ScreenIF[] = [];

    pop() { 
        let popped = this.s.pop(); 
        return popped;
      }
 
    push(screen:ScreenIF) { 
    this.s.push(screen); 
    }

    cur():ScreenIF { return this.s[this.s.length-1]; }

    draw(ctx:CanvasRenderingContext2D) {
        let s = this.cur();
        if (s) { s.draw(ctx); }     
    }  

    elapsed(elapsed:number) {
        let s = this.cur();
        if (s) { s.elapsed(elapsed); }  
    }

    onMouseDown(event:MouseEvent) {
        let s = this.cur();
        if (s) { s.onMouseDown(event, this); }
    }

    onMouseUp(event:MouseEvent) {
        let s = this.cur();
        if (s) { s.onMouseUp(event, this); }
    }

    onKeyDown(event:KeyboardEvent) {
        let s = this.cur();
        if (s) { s.onKeyDown(event, this); }
    }

    onKeyUp(event:KeyboardEvent) {
        let s = this.cur();
        if (s) { s.onKeyUp(event, this); }
    }

    static run_Screen(screen:ScreenIF){
        let stack = new ScreenStack();
        stack.push(screen);
        EventMgr.RunScreen(stack);
    }
}