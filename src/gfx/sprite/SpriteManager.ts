import { Sprite } from "./Sprite.js";
import { Point } from "../../DMap/Point.js";
import { SpriteSystem } from "./SpriteSystem.js";

export class SpriteManager {
    private sprites: Sprite[] = [];
    private visibleSprites:Sprite [] = [];
    private name:string;
    private origin:Point;
    private prio:number=0;
    private _disabled:boolean = false;

    constructor() {
        this.origin= new Point(0,0);
        this.name = "empty";
    }

    disabled():boolean {
        return this._disabled;
    } 

    disable() {
        this._disabled = true;
    } 

    enable() {
        this._disabled = false;
    } 

    getName():string {return this.name;}
    setName(newName:string) {this.name=newName}

    getOrigin():Point {return this.origin;}
    setOrigin(x:number, y:number) {this.origin.x = x; this.origin.y=y;}
    
    addSprite(sprite: Sprite) {
        //console.log("priosprite: "+sprite.priority);
        let index = this.sprites.length;  // Default to the end of the list
        for (let i = 0; i < this.sprites.length; i++) {
            //console.log("addSprite: "+this.sprites[i].priority+":"+sprite.priority);
            if (this.sprites[i].priority > sprite.priority) {
                index = i;
                break;
            }
        }
        this.sprites.splice(index, 0, sprite);
    }

    addVis(sprite:Sprite) {
        let index = this.visibleSprites.length;  // Default to the end of the list
        for (let i = 0; i < this.visibleSprites.length; i++) {
            if (this.visibleSprites[i].priority > sprite.priority) {
                index = i;
                break;
            }
        }
        this.visibleSprites.splice(index, 0, sprite);
    }

    clearVis() {
        for (let sprite of this.visibleSprites) sprite.setVisible(false);
        this.visibleSprites.length = 0;
    }

    removeSprite(sprite: Sprite) {
        const index = this.sprites.indexOf(sprite);
        if (index !== -1) {
            this.sprites.splice(index, 1);
        }
    }

    getPriority() {return this.prio;}
    setPriority(prio:number) {
        if (prio == this.prio) return;
        this.prio = prio;
        if (SpriteSystem.getInstance()) SpriteSystem.getInstance().updatePriority(this);
    }

    render(ctx: CanvasRenderingContext2D) {
        for (let sprite of this.sprites) {
            let x=sprite.getX();
            let y=sprite.getY();
            sprite.setPosition(x+this.origin.x, y+this.origin.y);
            sprite.render(ctx);
            sprite.setPosition(x,y);
        }
    }

    // Update highest prio to lowest prio
    update(deltaTime:number) {
        for (let i = this.sprites.length-1; i>=0; i--)
        {
            const sprite:Sprite = this.sprites[i];
            sprite.update(deltaTime);
        }
    }
    
    onClick(x:number, y:number):any {
        for (let i = this.visibleSprites.length-1; i>=0; i--)
        {
            const sprite:Sprite = this.visibleSprites[i];
            //console.log("checking sprites:"+this.origin.x+":"+this.origin.y);
            if (sprite.contains(x-this.origin.x ,y-this.origin.y))
            {
                //console.log("Found: "+sprite.priority);
                return sprite.userData;
            }
        }
    }

    dbg_ListVid() {
        for (let sprite of this.visibleSprites) {
            console.log(`Prios: ${sprite.priority} - ${sprite.image}`);
        }
        console.log(`Total Sprites in List ${this.visibleSprites.length-1}`);
    }

    dbg_showPrioList(){
        for (let sprite of this.sprites) {
            console.log(`Prios: ${sprite.priority} - ${sprite.image}`);
        }
        console.log(`Total Sprites in List ${this.sprites.length-1}`);
    }

    dbg_cnt_Sprites():number {
        return this.sprites.length;
    }
}