import { SpriteManager } from "./SpriteManager.js";
import { SpriteSystem } from "./SpriteSystem.js";

export class Sprite {
    x:number=0;
    y:number=0;
    originX:number  = 0;
    originY:number  = 0;
    visible:boolean = false;
    priority:number = 0;
    image:HTMLImageElement|HTMLCanvasElement|null = null;
    spriteManager:SpriteManager;
    userData:any;
    cut:boolean = false;
    heightpercent:number=0;
    shadow:boolean = false;

    constructor(image:HTMLImageElement|HTMLCanvasElement|null=null, x:number=0, y:number=0, sm:SpriteManager|null=null) 
    {
        //console.log("x/y"+x+" "+y);
        if (image) {
            this.image = image;
        }
        this.x = x;//*4;
        this.y = y;//*4;
        

        if (!sm) {
            this.spriteManager = SpriteSystem.getInstance().getDefaultSpriteManager();
        } else
        {
            this.spriteManager = sm;
        }
        this.spriteManager.addSprite(this)
    }
    setUserData(data:any) {this.userData = data;}

    setShadow(shadow:boolean) {this.shadow = shadow;}

    getX():number {return this.x;}
    getY():number {return this.y;}
    getOriginX():number {return this.originX;}
    getOriginY():number {return this.originY;}
    setPosition(x:number, y:number) {this.x=x; this.y=y;}

    setX(x:number) {this.x=x;}
    setY(y:number) {this.y=y;}
    setOriginX(x:number) {this.originX=x;}
    setOriginY(y:number) {this.originY=y;}

    isVisible():boolean {return this.visible;}
    setVisible(vis:boolean) {
        this.visible=vis; 
        if (vis) this.spriteManager.addVis(this);
    }

    getImage():HTMLImageElement|HTMLCanvasElement|null { return this.image;}
    setImage(img:HTMLImageElement|HTMLCanvasElement|null) {this.image = img;};

    getSpriteManager():SpriteManager {return this.spriteManager;}
    setSpriteManager(manager:SpriteManager) {
        if (manager === this.spriteManager) return;
        if (this.spriteManager) this.spriteManager.removeSprite(this);
        this.spriteManager = manager;
        if (this.spriteManager) this.spriteManager.addSprite(this);
    }

    getPriority():number {return this.priority;}
    setPriority(pri:number) {
        if (pri == this.priority) return;
        //console.log("SetPrio Sprite:"+pri);
        if (this.spriteManager) this.spriteManager.removeSprite(this);
        this.priority = pri;
        if (this.spriteManager) this.spriteManager.addSprite(this);
    }

    contains(x: number, y: number): boolean {
        if (!this.image) return false;
        //console.log(`sprite: ${this.getX()}:${this.getY()} - ${this.image?.width*4 + this.x}:${this.image?.height*4 + this.y} :::: ${x}:${y}`);
        return     x >= this.x && x <= this.x + this.image.width 
                && y >= this.y && y <= this.y + this.image.height;
    }

    update(deltaTime:number) {console.log("Sprite.ts implement me!");}
    

    render(ctx:CanvasRenderingContext2D) 
    {
        if (!this.visible) return;
        if (this.image == null) return;
        ctx.imageSmoothingEnabled = false;
        if (this.shadow)
        {
            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // Use a half-transparent black shadow
            ctx.shadowBlur = 1; // Adjust for desired shadow blur size
            ctx.shadowOffsetX = 3; // Shadow horizontal offset
            ctx.shadowOffsetY = 3; // Shadow vertical offset
        }
        ctx.drawImage(this.image, this.x-this.getOriginX(), this.y-this.getOriginY(), this.image.width, this.image.height);
        if (this.shadow) ctx.restore();
    }
}