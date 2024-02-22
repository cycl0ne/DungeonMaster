import { Champion, ENUM_BAR } from "../DMap/Champion.js";
import { GameEngine } from "../game/GameEngine.js";
import { InputManager } from "../game/InputManager.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SysFont } from "./fonts/SysFont.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

enum ENUM_PLAYERNAMECOLOR {
    SYSTEM, UNKNOWN, ACTIVE, LEADER,
}

const PLAYERNAMECOLOR:string [] = [
    "#B6B6B6",
    "#B6A060",
    "#FFB600",
    "#FFFF00",
];

const PLAYERCOLOR:string [] = [
    "#00DE00",
    "#FFFF00",
    "#FF0000",
    "#0000FF",
];

const STATUSPOSITION:any [] = [
    
];

export class gfx_StatusTest {
    _am:AssetManager            = AssetManager.getInstance();
    _sysFont:SysFont            = SysFont.getInstance();
    _statusNumber:number;
    _champion:Champion|null     = null;
    _statusDead:HTMLImageElement;
    _statusAlive:HTMLImageElement;
    _statusBox:HTMLImageElement[]   = [];
    _statusHands:HTMLCanvasElement[] = [];
    _statusCName:HTMLCanvasElement[] = [];
    _statusBars:HTMLCanvasElement;
    _statusRefresh:boolean=true;

    constructor(pos:number) {
        this._statusNumber=pos;
        this._statusAlive   = this._am.getImage("obj0007") as HTMLImageElement;
        this._statusDead    = this._am.getImage("obj0008") as HTMLImageElement;
        this._statusBox[0]  = this._am.getImage("obj0033") as HTMLImageElement;
        this._statusBox[1]  = this._am.getImage("obj0034") as HTMLImageElement;
        this._statusBox[2]  = this._am.getImage("obj0035") as HTMLImageElement;
        this._statusHands[0]= GraphicsUtility.cutImage16x16("obj0048", 20);
        this._statusHands[1]= GraphicsUtility.cutImage16x16("obj0048", 22);
        this._statusCName[0]= GraphicsUtility.createCanvasWH(48, 6);
        this._statusCName[1]= GraphicsUtility.createCanvasWH(48, 6);
        this._statusCName[2]= GraphicsUtility.createCanvasWH(48, 6);
        this._statusBars    = GraphicsUtility.createCanvasWH(24, 29);
    }

    private drawBars() {
        const ctx = this._statusBars.getContext("2d");
        if (!ctx) return;
        if (!this._champion) return;
        ctx.fillStyle = "#444444";
        ctx.fillRect(0, 0, 24, 29);

        for (let i =0; i<ENUM_BAR.MAX;i++) {
            const barSize = 25;
            let barAct = this._champion._bar[i];
            let barMax = this._champion._barMax[i];

            if (barMax < barAct) barMax = barAct;
            if (barAct > 0) {
                let cut = (barSize - Math.floor(barSize * (Math.floor(barAct/10) / Math.floor(barMax/10))));
                const dest_x = 3 + 7 * i;
                if (i < ENUM_BAR.MANA || (barAct>=10)) {
                    if (cut == barSize) {
                        cut -=2;
                    }
                }
                if (cut < barSize*2) {
                    ctx.fillStyle = PLAYERCOLOR[this._statusNumber];
                    //console.log("fillrect: "+dest_x+" "+(cut+4)+" : "+(dest_x+4)+" 24");
                    ctx.fillRect(dest_x, 2+cut, 4, 25-cut);
                }
            }
        }
    }
    
    addChampion(c:Champion) {
        this._champion = c;
        this.refresh();
    }

    remChampion() {
        this._champion = null;
    }

    writeChampName() {
        const ctx = this._statusCName[0].getContext("2d");
        if (!ctx) return;
        if (!this._champion) return;
        ctx.fillStyle = "#666666"
        ctx.fillRect(0,0, 43,7);
        this._sysFont.setHorizontalAlignment("left");
        if (this._champion._leader) this._sysFont.renderTextAligned(ctx, 0, 0, this._champion._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.LEADER]);
        else this._sysFont.renderTextAligned(ctx, 0, 0, this._champion._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.ACTIVE]);
    }

    refresh() {
        this.writeChampName();
        this.drawBars();
        this._statusRefresh = false;
    }

    draw(ctx:CanvasRenderingContext2D) {
        if (!this._champion) return;
        if (this._statusRefresh) this.refresh();
        ctx.drawImage(this._statusAlive,     0, 0);
        ctx.drawImage(this._statusBox[0],    3, 9);
        ctx.drawImage(this._statusBox[0],   23, 9);
        ctx.drawImage(this._statusHands[0],  4, 10);
        ctx.drawImage(this._statusHands[1], 24, 10);
        ctx.drawImage(this._statusCName[0],  0, 1);
        ctx.drawImage(this._statusBars,     43, 0);
    }
}


export class gfx_StatusOLD {
    _assetManager:AssetManager = AssetManager.getInstance();
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _inputManager:InputManager = InputManager.getInstance();
    _sysFont:SysFont           = SysFont.getInstance();
    _spriteManager:SpriteManager|null;

    _hands:Sprite[] = [];
    _statusScreen:Sprite[] = [];
    _statusScreenCanvas:HTMLCanvasElement[] = [];
    _statusScreenCtx:CanvasRenderingContext2D[] = [];
    _statusDraw:HTMLCanvasElement;
    _statusDrawCtx:CanvasRenderingContext2D;
    _champion:Champion|null = null;
    _PosStatus:number;
    _PosX:number;
    _PosY:number;
    _StatusBoxLeft:Sprite[] =[];
    _StatusBoxRight:Sprite[] =[];

    constructor(pos:number) {
        this._spriteManager = this._spriteSystem.getSpriteManagerName("Status");
        this._PosStatus=pos;
        const x = this._PosX = this._PosStatus * 69;//67 ;
        const y = this._PosY = 0;


        this._hands[0] = this.createSprite("obj0048", 20,  x+4,10);
        this._hands[1] = this.createSprite("obj0048", 22, x+24,10);
        const img = this._assetManager.getImage("obj0033");
        const img2 = this._assetManager.getImage("obj0034");
        const img3 = this._assetManager.getImage("obj0035");
        this._StatusBoxLeft[0]  = new Sprite(img,   x+3, 9, this._spriteManager);
        this._StatusBoxLeft[1]  = new Sprite(img2,  x+3, 9, this._spriteManager);
        this._StatusBoxLeft[2]  = new Sprite(img3,  x+3, 9, this._spriteManager);
        this._StatusBoxRight[0] = new Sprite(img,  x+23, 9, this._spriteManager);
        this._StatusBoxRight[1] = new Sprite(img2, x+23, 9, this._spriteManager);
        this._StatusBoxRight[2] = new Sprite(img3, x+23, 9, this._spriteManager);
        for (let i=0; i<3;i++) {this._StatusBoxLeft[i].setPriority(4);this._StatusBoxRight[i].setPriority(4);}

        this._statusScreenCanvas[0] = GraphicsUtility.cloneCanvas(this._assetManager.getImage("obj0007") as HTMLImageElement);
        this._statusScreenCanvas[1] = GraphicsUtility.cloneCanvas(this._assetManager.getImage("obj0008") as HTMLImageElement);
        this._statusScreenCtx[0] = this._statusScreenCanvas[0].getContext('2d') as CanvasRenderingContext2D;
        this._statusScreenCtx[1] = this._statusScreenCanvas[1].getContext('2d') as CanvasRenderingContext2D;

        this._statusDraw = GraphicsUtility.createCanvas(this._statusScreenCanvas[0]);
        this._statusDrawCtx =  this._statusDraw.getContext('2d') as CanvasRenderingContext2D;

        this._statusScreen[0] = new Sprite(this._assetManager.getImage("obj0007") as HTMLImageElement, x, y, this._spriteManager);
        this._statusScreen[1] = new Sprite(this._assetManager.getImage("obj0008") as HTMLImageElement, x, y, this._spriteManager);
        this._statusScreen[0].setPriority(2);
        this._statusScreen[1].setPriority(2);
        this._spriteManager?.enable();
    }

    cutImage(where:string, what:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = this._assetManager.getImage(where) as HTMLImageElement;
        const posy = Math.floor(what/16);
        const posx = Math.floor(what%16);
        return GraphicsUtility.cutImage(portraits, posx*16, posy*16, 16, 16);
    }
    
    createSprite(img:string, no:number, x:number, y:number):Sprite {
        const canvas = this.cutImage(img, no);
        const sprite =  new Sprite(canvas, x, y, this._spriteManager);
        sprite.setPriority(5);
        return sprite;
    }

    addChamp(c:Champion) {this._champion = c;}
    remChamp() {
        this._champion = null;
        this._hands[0].setVisible(false);
        this._hands[1].setVisible(false);
        this._StatusBoxRight[0].setVisible(false);
        this._StatusBoxLeft[0].setVisible(false);
        this._statusScreen[0].setVisible(false);
    }

    private drawBars(ctx:CanvasRenderingContext2D, pos:number) {
        if (!this._champion) return;
        for (let i =0; i<ENUM_BAR.MAX;i++) {
            const barSize = 25;
            let barAct = this._champion._bar[i];
            let barMax = this._champion._barMax[i];

            if (barMax < barAct) barMax = barAct;
            if (barAct > 0) {
                let cut = (barSize - Math.floor(barSize * (Math.floor(barAct/10) / Math.floor(barMax/10))));
                const dest_x = 46 + 7 * i;
                if (i < ENUM_BAR.MANA || (barAct>=10)) {
                    if (cut == barSize) {
                        cut -=2;
                    }
                }
                if (cut < barSize*2) {
                    ctx.fillStyle = PLAYERCOLOR[pos];
                    //console.log("fillrect: "+dest_x+" "+(cut+4)+" : "+(dest_x+4)+" 24");
                    ctx.fillRect(dest_x, 2+cut, 4, 25-cut);
                }
            }
        }
    }

    writeChampName() {
        if (!this._champion) return;
        this._sysFont.setHorizontalAlignment("left");
        if (this._champion._leader) this._sysFont.renderTextAligned(this._statusDrawCtx, 0, 1, this._champion._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.LEADER]);
        else this._sysFont.renderTextAligned(this._statusDrawCtx, 0, 1, this._champion._name, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.ACTIVE]);
    }

    lastClickTime:number = 0;
    debounceTime:number = 200;

    refresh() {
        if (!this._champion) {return;}

    }

    renderStatus(ctx:CanvasRenderingContext2D, color:number) {
        if (!this._champion) {return;}

        if (!this._champion._dead) {
            this._statusDrawCtx.drawImage(this._statusScreenCanvas[0],0,0); // Clear Screen
            this.writeChampName();
            this.drawBars(this._statusDrawCtx, this._PosStatus);
            this._hands[0].setVisible(true);
            this._hands[1].setVisible(true);
            this._StatusBoxRight[0].setVisible(true);
            this._StatusBoxLeft[0].setVisible(true);
            this._statusScreen[0].setImage(this._statusDraw);
            this._statusScreen[0].setVisible(true);
        } else {

        }

        const currentTime = Date.now();
        if (this._inputManager.isMouseWithin(0+this._PosX, 0, 67+this._PosX, 29) && currentTime - this.lastClickTime > this.debounceTime ) {
            this.lastClickTime = currentTime;            
            GameEngine.game._invManager.openInventory(this._PosStatus);
        }
    }
}