import { Champion, enum_Inventory } from "../DMap/Champion.js";
import { GameEngine } from "../game/GameEngine.js";
import { Player } from "../game/Player.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SysFont } from "./fonts/SysFont.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

export class AttackMenu {
    _assetManager:AssetManager = AssetManager.getInstance();
    _sysFont:SysFont = SysFont.getInstance();
    _attackMenu:HTMLImageElement;
    _which:number;
    _champ:Champion | null = null;

    _fist:HTMLCanvasElement;

    constructor(which:number) {
        this._which = which;
        this._attackMenu = this._assetManager.getImage("obj0010") as HTMLImageElement;
        this._fist = this.cutImage("obj0048", 9);
        this._fist = GraphicsUtility.setImageColorToTransparent(this._fist, "#444444");
        this._fist = GraphicsUtility.changeColor(this._fist, "#CC8866","#000000");
    }

    addChampion(c:Champion) {
        this._champ = c;
    }

    remChampion() {
        this._champ = null;
    }

    private validAndAlive(c:Champion|null):boolean {
        if (c) return !c._dead;
        return false;
    }

    render(ctx:CanvasRenderingContext2D) {
        if (!this._champ) return;
        ctx.fillStyle = "#00DEDE";
        let x = 22*this._which;
        if (this._which) x+=2;
        ctx.fillRect(22*this._which, 10, 20, 35);
        if (this._champ._inventory[enum_Inventory.HAND_R] === undefined)
        {
            // we fake the hand at the moment.
            x = 22*this._which+2;
            ctx.drawImage(this._fist, x, 18);
        }
    }

    cutImage(where:string, what:number):HTMLCanvasElement {
        const portraits:HTMLImageElement = this._assetManager.getImage(where) as HTMLImageElement;
        const posy = Math.floor(what/16);
        const posx = Math.floor(what%16);
        return GraphicsUtility.cutImage(portraits, posx*16, posy*16, 16, 16);
    }
}

export class AttackMenuManager {
    _assetManager:AssetManager = AssetManager.getInstance();
    _sysFont:SysFont = SysFont.getInstance();
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _spriteManager:SpriteManager|null;
    _disabled:boolean = true;
    _game:GameEngine;
    _player:Player;
    _attackMenu:AttackMenu[]=[];
    _attackCanvas:HTMLCanvasElement;
    _attackCtx:CanvasRenderingContext2D;
    _attackSprite:Sprite;
    _dmgSprite:Sprite;

    constructor(game:GameEngine, player:Player) {
        this._game = game;
        this._player=player;
        this._spriteManager = this._spriteSystem.getSpriteManagerName("Status");
        this._attackCanvas = GraphicsUtility.createCanvasWH(88,45);
        this._attackCtx = this._attackCanvas.getContext('2d') as CanvasRenderingContext2D;
        this._attackSprite  = new Sprite(this._attackCanvas, 320-87, 75, this._spriteManager);
        const img = this._assetManager.getImage("obj0014");
        this._dmgSprite     = new Sprite(img, 320-87, 75, this._spriteManager);
        for (let i=0; i<4; i++) this._attackMenu[i] = new AttackMenu(i);
    }

    addChampion(which:number, c:Champion) {
        this._attackMenu[which].addChampion(c);
        this._attackSprite.setVisible(true);
    }

    remChampion(which:number) {
        this._attackMenu[which].remChampion();
    }

    update(deltaTime:number, ctx:CanvasRenderingContext2D) {
        this._attackCtx.fillStyle = "black";
        this._attackCtx.fillRect(0, 0, 88, 45);
        for (let i=0; i<4; i++) this._attackMenu[i].render(this._attackCtx);
    }
}
