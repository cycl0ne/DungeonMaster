type ButtonCallback = ((xx:number, yy:number) => void)|null;

export interface ButtonArea {
    x: number;
    y: number;
    w: number;
    h: number;
    action: ButtonCallback;
}

export class InputManager {
    private static instance: InputManager | null = null;
    private pressedKeys:Set<string>;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private mouseButtons: Map<number, boolean> = new Map();
    mousePressed:boolean = false;
    private buttonAreas: Map<string | number, ButtonArea> = new Map();
    private pressPosition: { x: number, y: number } | null = null;

    private constructor() {
        // Private constructor to prevent external instantiation
        this.pressedKeys = new Set();

        const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
        canvas.addEventListener("keydown", this.onKeyDown.bind(this));
        canvas.addEventListener("keyup", this.onKeyUp.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("contextmenu", this.handleMenu.bind(this))
        canvas.addEventListener("touchstart", this.handleTouchStart.bind(this));
        canvas.addEventListener("touchend", this.handleTouchEnd.bind(this));
        canvas.addEventListener("touchmove", this.handleTouchMove.bind(this));
        canvas.addEventListener("touchcancel", this.handleTouchCancel.bind(this));
    }

    addButtonArea(id: string | number, area: ButtonArea): void {
        this.buttonAreas.set(id, area);
    }

    remButtonArea(id: string | number): void {
        this.buttonAreas.delete(id);
    }

    listButtonAreas(): Array<[string | number, ButtonArea]> {
        return Array.from(this.buttonAreas.entries());
    }

    private handleMenu(event:MouseEvent) {
        event.preventDefault();
    }

    private onKeyDown(event:KeyboardEvent) {
        this.pressedKeys.add(event.key);
    }

    private onKeyUp(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.key);
    }

    private handleMouseMove(event: MouseEvent): void {
        const canvas = <HTMLCanvasElement>event.target;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
    
        this.mouseX = ((event.clientX - rect.left) * scaleX);
        this.mouseY = ((event.clientY - rect.top) * scaleY);
        this.mouseX /= 4;
        this.mouseY /= 4;
    }

    /*
    private checkButtonPress(): void {
        if (this.pressPosition) {
            this.buttonAreas.forEach((area, id) => {
                if (
                    this.mouseX >= area.x &&
                    this.mouseX <= area.x + area.w &&
                    this.mouseY >= area.y &&
                    this.mouseY <= area.y + area.h
                ) {
                    console.log("INPUTMANAGER: found button");
                    if (area.action) area.action(this.mouseX, this.mouseY);
                    this.mousePressed = false;
                    this.pressPosition = null;
                  }
            });
            console.log("INPUTMANAGER: leaving cBP");
        }
    }
*/
    private checkButtonPress(): void {
        if (this.pressPosition) {
            for (let [id, area] of this.buttonAreas) {
                if (
                    this.mouseX >= area.x &&
                    this.mouseX <= area.x + area.w &&
                    this.mouseY >= area.y &&
                    this.mouseY <= area.y + area.h
                ) {
//                    console.log("INPUTMANAGER: found button");
                    if (area.action) area.action(this.mouseX, this.mouseY);
                    this.mousePressed = false;
                    this.pressPosition = null;
                    break;  // This will exit the loop once the button is found and processed
                }
            }
        }
    }

    private handleMouseDown(event: MouseEvent): void {
        this.mousePressed = true;
        this.mouseButtons.set(event.button, true);
        this.pressPosition = this.getMousePosition();
    }

    private handleMouseUp(event: MouseEvent): void {
        this.mousePressed = false;
        this.mouseButtons.set(event.button, false);
        this.checkButtonPress();
    }

    isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key);
    }

    isMouseButtonPressed(button: number): boolean {
        return this.mouseButtons.get(button) || false;
    }

    isMouseWithin(x1: number, y1: number, x2: number, y2: number): boolean {
        return this.mousePressed &&
               this.mouseX >= x1 &&
               this.mouseX <= x2 &&
               this.mouseY >= y1 &&
               this.mouseY <= y2;
    }

    getMousePosition(): { x: number, y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    clear(): void {
        this.pressedKeys.clear();
    }

    private handleTouchStart(event: TouchEvent): void {
        this.mousePressed = true;
        // Assuming you're only interested in the first touch point
        const touch = event.touches[0];
        this.updateTouchPosition(touch);
    }
    
    private handleTouchEnd(event: TouchEvent): void {
        this.mousePressed = false;
        if (event.touches.length === 0 && event.changedTouches.length > 0) {
            this.updateTouchPosition(event.changedTouches[0]);
        }
    }
    
    private handleTouchMove(event: TouchEvent): void {
        // Assuming you're only interested in the first touch point
        const touch = event.touches[0];
        this.updateTouchPosition(touch);
    }
    
    private handleTouchCancel(event: TouchEvent): void {
        this.mousePressed = false;
    }
    
    private updateTouchPosition(touch: Touch): void {
        const canvas = <HTMLCanvasElement>touch.target;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
    
        this.mouseX = ((touch.clientX - rect.left) * scaleX);
        this.mouseY = ((touch.clientY - rect.top) * scaleY);
        this.mouseX /= 4;
        this.mouseY /= 4;
    }

    //------------------ SINGLETON ---
    static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }
}