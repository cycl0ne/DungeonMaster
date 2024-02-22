import { Champion, ENUM_BAR } from "../DMap/Champion.js";
import { InputManager } from "../game/InputManager.js";
import { SysFont } from "../gfx/fonts/SysFont.js";
import { Sprite } from "../gfx/sprite/Sprite.js";
import { SpriteManager } from "../gfx/sprite/SpriteManager.js";
import { SpriteSystem } from "../gfx/sprite/SpriteSystem.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";

enum ENUM_PLAYERNAMECOLOR {
    SYSTEM,
    UNKNOWN,
    ACTIVE,
    LEADER,
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


export class gfx_Inventory {
    _assetManager:AssetManager = AssetManager.getInstance();
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _inputManager:InputManager = InputManager.getInstance();
    _spriteManager:SpriteManager|null;

    _sysFont:SysFont = SysFont.getInstance();
    _eye:Sprite[] = [];
    _mouth:Sprite[] = [];

    _humanBody:Sprite[][] = Array(6).fill(null).map(() => Array(2).fill(null)); // Initialize to 6 body partd + 6 hurtables
    _neckBody:Sprite;
    _pouchBody:Sprite;
    _quiverBody:Sprite;
    _bagBody:Sprite;
    _invScreen:Sprite;
    _invScreenImg:HTMLCanvasElement;
    _screen:HTMLCanvasElement;
    _screenCtx:CanvasRenderingContext2D |null;
    _champion:Champion|null = null;
    _isOpen:boolean = false;
    _flask:Sprite;

    constructor() {
        this._spriteManager = this._spriteSystem.getSpriteManagerName("Inventory");
        this.createHumanSprites();
        this._neckBody    = this.createSprite("obj0048", 16,  6, 33);
        this._pouchBody   = this.createSprite("obj0048", 17,  6, 73);
        this._quiverBody  = this.createSprite("obj0048", 18, 62, 73);
        this._bagBody     = this.createSprite("obj0048", 19, 66, 33);
        this._eye[0]      = this.createSprite("obj0048", 10, 12, 13);
        this._eye[1]      = this.createSprite("obj0048", 11, 12, 13);
        this._mouth[0]    = this.createSprite("obj0048", 13, 56, 13);
        this._mouth[1]    = this.createSprite("obj0048", 14, 56, 13);
        this._mouth[2]    = this.createSprite("obj0048", 15, 56, 13);
        this._flask       = this.createSprite("obj0048", 3, 0, 0);
        this._flask.setImage(GraphicsUtility.setImageColorToTransparent(this._flask.getImage() as HTMLCanvasElement, "0x444444"));
        this._flask.setOriginX(8);
        this._flask.setOriginY(8);
        this._flask.setShadow(true);
        // TODO: Cleanup this mess!
        const invscreen = this._assetManager.getImage("obj0017") as HTMLImageElement;
        console.log("w:"+invscreen.width+" h:"+invscreen.height);
        this._invScreen = new Sprite(invscreen, 0, 0, this._spriteManager);
        this._invScreen.setPriority(2);
        this._invScreenImg= this._invScreen.getImage() as HTMLCanvasElement;
        this._screen = GraphicsUtility.createCanvas(this._invScreen.getImage() as HTMLImageElement);
        console.log("w:"+this._invScreenImg.width+" h:"+this._invScreenImg.height);
        this._screenCtx = this._screen.getContext('2d');
        if (!this._screenCtx) return;
    }

    cutImage(where:string, what:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = this._assetManager.getImage(where) as HTMLImageElement;
        const posy = Math.floor(what/16);
        const posx = Math.floor(what%16);
        return GraphicsUtility.cutImage(portraits, posx*16, posy*16, 16, 16);
    }

    createHumanSprites() {
        let canvas:HTMLCanvasElement;
        canvas = this.cutImage("obj0048", 20);
        this._humanBody[0][0] = new Sprite(canvas, 6, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 21);
        this._humanBody[0][1] = new Sprite(canvas, 6, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 22);
        this._humanBody[1][0] = new Sprite(canvas, 62, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 23);
        this._humanBody[1][1] = new Sprite(canvas, 62, 53, this._spriteManager);
        canvas = this.cutImage("obj0048", 24);
        this._humanBody[2][0] = new Sprite(canvas, 34, 26, this._spriteManager);
        canvas = this.cutImage("obj0048", 25);
        this._humanBody[2][1] = new Sprite(canvas, 34, 26, this._spriteManager);
        canvas = this.cutImage("obj0048", 26);
        this._humanBody[3][0] = new Sprite(canvas, 34, 46, this._spriteManager);
        canvas = this.cutImage("obj0048", 27);
        this._humanBody[3][1] = new Sprite(canvas, 34, 46, this._spriteManager);
        canvas = this.cutImage("obj0048", 28);
        this._humanBody[4][0] = new Sprite(canvas, 34, 66, this._spriteManager);
        canvas = this.cutImage("obj0048", 29);
        this._humanBody[4][1] = new Sprite(canvas, 34, 66, this._spriteManager);
        canvas = this.cutImage("obj0048", 30);
        this._humanBody[5][0] = new Sprite(canvas, 34, 86, this._spriteManager);
        canvas = this.cutImage("obj0048", 31);
        this._humanBody[5][1] = new Sprite(canvas, 34, 86, this._spriteManager);
        for (let i=0; i<6;i++) {
            for (let j=0; j<2; j++) {
                if (this._humanBody[i][j]) {
                    this._humanBody[i][j].setPriority(5);
                    this._humanBody[i][j].setVisible(false);
                    //if (j==0) this._humanBody[i][j].setVisible(true);
                }
            }
        }
    }

    createSprite(img:string, no:number, x:number, y:number):Sprite {
        const canvas = this.cutImage(img, no);
        const sprite =  new Sprite(canvas, x, y, this._spriteManager);
        sprite.setPriority(5);
        return sprite;
    }

    toggleInventory() {
        this._isOpen = !this._isOpen;
        if (!this._isOpen) {
            this._spriteManager?.disable();
        } else {
            this._spriteManager?.enable();
        }
    }

    openInventory(champ:Champion) {
        this._champion = champ;
    }

    closeInventory(champ:Champion) {
        this._champion = null;
    }

    createInvScreen(ctx:CanvasRenderingContext2D) {
        if (!this._champion) return;
        const champ=this._champion;
        ctx.drawImage(this._invScreenImg, 0, 0);
        const fname:string = champ._name+" "+champ._title;
        this._sysFont.setHorizontalAlignment("left");
        this._sysFont.renderTextAligned(ctx, 3, 3, fname, PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.LEADER]);
        for (let i=0; i<ENUM_BAR.MAX; i++) {
            let bar = champ._bar[i];
            let dbar = Math.floor(bar/10);
            let mbar = champ._barMax[i];
            let mdbar = Math.floor(mbar/10);

            this._sysFont.setHorizontalAlignment("right");
            let temp:string = dbar.toString();
            this._sysFont.renderTextAligned(ctx, 72, 8*i+112, dbar.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.renderTextAligned(ctx, 96, 8*i+112, mdbar.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, 72, 8*i+112, "/", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
            this._sysFont.renderTextAligned(ctx, 4, 8*i+112, ENUM_BAR[i], PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        }
        this._sysFont.setHorizontalAlignment("left");
        this._sysFont.renderTextAligned(ctx, 104, 128, "LOAD", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 166, 128, ".", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 178, 128, "/", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.renderTextAligned(ctx, 208, 128, "KG", PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]);
        this._sysFont.setHorizontalAlignment("right");
        const maxLoad = champ._maxload/10;//champ.calcMaxLoad()/10;
        //todo: Draw currentload and use THIS. Vars!
        this._sysFont.renderTextAligned(ctx, 202, 128, maxLoad.toString(), PLAYERNAMECOLOR[ENUM_PLAYERNAMECOLOR.SYSTEM]); 
        this._bagBody.setVisible(true);
        this._neckBody.setVisible(true);
        this._pouchBody.setVisible(true);
        this._quiverBody.setVisible(true);
        for (let i=0; i<6;i++) {
            this._humanBody[i][0].setVisible(true);
        }
    }

    frameCnt:number = 0;
    curImg:number=0;
    fps:number = Math.floor(60 *(0.5/9));
    animMouth:boolean=false;
    loop:number= 0;

    updateAnim() {
        this.frameCnt++;
        if (this.frameCnt >= this.fps) {
            this._mouth[this.curImg].setVisible(false);
            this.curImg = (this.curImg + 1) % 3;
            this._mouth[this.curImg].setVisible(true);
            this.frameCnt=0;
            this.loop++;
            if (this.loop >8) {this.animMouth=false;this.loop=0;this._mouth[this.curImg].setVisible(false);}
        }
    }

    inhand:boolean = true;
    lastClickTime:number = 0;
    debounceTime:number = 200;

    newChamp() {
        console.log("inventory: New Champ");
    }

    update() { 
        const ctx = this._screenCtx;
        if (!ctx) return;
        this.createInvScreen(ctx);
        this._invScreen.setImage(this._screen);
        this._invScreen.setVisible(true);
        this._bagBody.setVisible(true);
//        if (this._inputManager.isMouseButtonPressed(0)) console.log("Mouse pressed "+this._inputManager.getMousePosition().x);
        if (this._inputManager.isMouseWithin(12,13+32, 12+16, 13+16+32)) {
            this._eye[0].setVisible(false);
            this._eye[1].setVisible(true);
        } else {
            this._eye[0].setVisible(true);
            this._eye[1].setVisible(false);
        }
        if (this._inputManager.isMouseWithin(56, 13+32, 56+16, 13+16+32)) {
            this.animMouth=true;
        }
        if (this.animMouth) this.updateAnim();
/*
        this._flask.setVisible(true);
        if (this.inhand) this._flask.setPosition(this._inputManager.getMousePosition().x, this._inputManager.getMousePosition().y-32);
        
        const currentTime = Date.now();
        if (this._inputManager.isMouseButtonPressed(0)&& currentTime - this.lastClickTime > this.debounceTime) 
        {
            this.lastClickTime = currentTime;
            this.inhand = !this.inhand;
            this._flask.setShadow(this.inhand);
        }
*/
    }

    render(ctx:CanvasRenderingContext2D) {

    }
}