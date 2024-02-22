import { Champion } from "../DMap/Champion.js";
import { GameEngine } from "../game/GameEngine.js";
import { InputManager } from "../game/InputManager.js";
import { Player } from "../game/Player.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { RuneFont } from "./fonts/RuneFont.js";
import { SysFont } from "./fonts/SysFont.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

const MAGICRUNES: string[] = [
    "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x"
];

/*
	magic_system_colors = {
		{0, 0, 0},       -- character name
		{255, 255, 255}, -- flash background
		{0, 222, 222},   -- active rune
		{0, 222, 222},   -- spell in progress
		{0, 64, 64}      -- disabled rune
	},

	power_multipliers = { 1.0, 1.5, 2.0, 2.5, 3.0, 3.5 },

	rune_costs = {
		10, 20, 30, 40, 50, 60,
		20, 30, 40, 50, 60, 70,
		40, 50, 60, 70, 70, 90,
		20, 20, 30, 40, 60, 70
	}
}
*/


export class MagicMenu {
    _which:number;
    _sysFont:RuneFont = RuneFont.getInstance();
    _assetManager:AssetManager = AssetManager.getInstance();
    _mMenu:HTMLImageElement;
    _champ:Champion | null = null;
    _pendingSpell:string ="";
    _active:boolean = false;
    _mRuneMenu:HTMLCanvasElement[]=[];

    constructor(which:number) {
        this._which = which;
        this._mMenu = this._assetManager.getImage("obj0009") as HTMLImageElement;
        for (let i=0; i<4; i++) {
            this._mRuneMenu[i] = GraphicsUtility.cloneCanvas(this._mMenu);
            const ctx = this._mRuneMenu[i].getContext('2d');
            if (!ctx) return;
            let x=5;
            for (let j=0; j<6; j++) {
                this._sysFont.setHorizontalAlignment("left");
                this._sysFont.renderTextAligned(ctx, x, 4, MAGICRUNES[i*6+j]);
                x +=14;
            }
        }
    }

    addChampion(c:Champion) {
        this._champ = c;
    }

    remChampion() {
        this._champ = null;
    }

    drawRunes(ctx:CanvasRenderingContext2D)
    {
        let pos = this._pendingSpell.length;
        if (pos >3) {pos -=4;}
        if (pos >4) this._pendingSpell ="";
        ctx.drawImage(this._mRuneMenu[pos], 0,8);
        let x=8;
        for (let i=0; i<this._pendingSpell.length;i++) {
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, x, 24, this._pendingSpell[i]);
            x+= 9;
        }
/*
        x=5;
        let pos = this._pendingSpell.length * 6;
        for (let i=0; i<6; i++) {
            this._sysFont.setHorizontalAlignment("left");
            this._sysFont.renderTextAligned(ctx, x, 12, MAGICRUNES[pos+i]);
            x +=14;
        }
*/
    }

    render(ctx:CanvasRenderingContext2D, x:number, y:number) {
        //if (!this._champ) return;
        //ctx.drawImage(this._mMenu, 0, 8);
        this.drawRunes(ctx);
    }
}

export class MagicMenuManager {
    _assetManager:AssetManager = AssetManager.getInstance();
    _sysFont:SysFont = SysFont.getInstance();
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _spriteManager:SpriteManager|null;
    _inputMgr:InputManager = InputManager.getInstance();
    _disabled:boolean = true;

    _game:GameEngine;
    _player:Player;
    _mMenu:HTMLImageElement;
    _magicCanvas:HTMLCanvasElement;
    _magicCtx:CanvasRenderingContext2D;
    _magicSprite:Sprite;
    _magicMenu:MagicMenu[] = [];
    _active:number = 0;
    _cNameBmp:HTMLCanvasElement[]=[];

    constructor(game:GameEngine, player:Player) {
        this._game = game;
        this._player=player;
        this._spriteManager = this._spriteSystem.getSpriteManagerName("Status");
        this._mMenu = this._assetManager.getImage("obj0009") as HTMLImageElement;
        this._magicCanvas = GraphicsUtility.createCanvasWH(87,33);
        this._magicCtx = this._magicCanvas.getContext('2d') as CanvasRenderingContext2D;
        this._magicSprite = new Sprite(this._magicCanvas, 320-87, 74-33, this._spriteManager);
        for (let i=0; i<4; i++) 
        {
            this._magicMenu[i] = new MagicMenu(i);
            this._cNameBmp[i] = GraphicsUtility.createCanvasWH(45, 8);
        }
    }

    bufferChampName(which:number, c:Champion) {
        const ctx = this._cNameBmp[which].getContext("2d");
        if (!ctx) return;
        const name = c._name;
        ctx.fillStyle = "#00DEDE";
        const champ = this._player.champion[which];
        ctx.fillRect(0, 0, 45, 8);
        this._sysFont.setHorizontalAlignment("left");
        this._sysFont.renderTextAligned(ctx, 1, 2, name.padEnd(7, " "), "#000000", "#00dede");
    }

    addChampion(which: number, c:Champion) {
        if (this._disabled) {
            //console.log("w:"+where);
            this._disabled = false;
            this._magicSprite.setVisible(true);
        } 
        this.bufferChampName(which, c);
        this._magicMenu[which].addChampion(c);
        this.activateClick();
    }

    remChampion(where:number) {
        if (where == 0) {
            this._disabled = true;
            this._magicSprite.setVisible(false);
        }
        this._magicMenu[where].remChampion();
    }

    private validAndAlive(c:Champion|null):boolean {
        if (c) return !c._dead;
        return false;
    }

    renderActiveName() {
        let tx:number = 0;
        this._magicCtx.fillStyle = "#00DEDE";
        for (let i=0; i<4; i++) {
            if (i===this._active) {
                this._magicCtx.drawImage(this._cNameBmp[i], tx, 0);
                tx +=33;
/*
                    let name = "";
                    const champ = this._player.champion[i];
                    if (champ) name = champ._name;
                    this._magicCtx.fillRect(tx, 0, 45, 8);
                    this._sysFont.setHorizontalAlignment("left");
                    this._sysFont.renderTextAligned(this._magicCtx, 1+tx, 2, name.padEnd(7, " "), "#000000", "#00dede");
                    tx += 33;
*/
            } else {
                if (this.validAndAlive(this._player.champion[i])) this._magicCtx.fillRect(tx, 0, 12, 7);
            }
            tx += 14;
        }
    }

    activateClick() {
        //233,41
        this.deactivateClick();
        console.log(this._inputMgr.listButtonAreas());
        switch(this._active) 
        {
            case 0:
            this._inputMgr.addButtonArea("Champ2", {x:280, y:41,  w:12,  h:7, action:this.onClickChamp2.bind(this)});
            this._inputMgr.addButtonArea("Champ3", {x:294, y:41,  w:12,  h:7, action:this.onClickChamp3.bind(this)});
            this._inputMgr.addButtonArea("Champ4", {x:308, y:41,  w:12,  h:7, action:this.onClickChamp4.bind(this)});
            break;
            case 1:
            this._inputMgr.addButtonArea("Champ1", {x:233, y:41,  w:12,  h:7, action:this.onClickChamp1.bind(this)});
            this._inputMgr.addButtonArea("Champ3", {x:294, y:41,  w:12,  h:7, action:this.onClickChamp3.bind(this)});
            this._inputMgr.addButtonArea("Champ4", {x:308, y:41,  w:12,  h:7, action:this.onClickChamp4.bind(this)});
            break;
            case 2:
            this._inputMgr.addButtonArea("Champ1", {x:233, y:41,  w:12,  h:7, action:this.onClickChamp1.bind(this)});
            this._inputMgr.addButtonArea("Champ2", {x:247, y:41,  w:12,  h:7, action:this.onClickChamp2.bind(this)});
            this._inputMgr.addButtonArea("Champ4", {x:308, y:41,  w:12,  h:7, action:this.onClickChamp4.bind(this)});
            break;
            case 3:
            this._inputMgr.addButtonArea("Champ1", {x:233, y:41,  w:12,  h:7, action:this.onClickChamp1.bind(this)});
            this._inputMgr.addButtonArea("Champ2", {x:247, y:41,  w:12,  h:7, action:this.onClickChamp2.bind(this)});
            this._inputMgr.addButtonArea("Champ3", {x:261, y:41,  w:12,  h:7, action:this.onClickChamp3.bind(this)});
            break;
        }
        this.activateRuneClick();
    }

    activateRuneClick() {
        this._inputMgr.addButtonArea("Rune1", {x:235, y:50,  w:13,  h:11, action:this.onClickRune1.bind(this)});
        this._inputMgr.addButtonArea("Rune2", {x:249, y:50,  w:13,  h:11, action:this.onClickRune2.bind(this)});
        this._inputMgr.addButtonArea("Rune3", {x:263, y:50,  w:13,  h:11, action:this.onClickRune3.bind(this)});
        this._inputMgr.addButtonArea("Rune4", {x:277, y:50,  w:13,  h:11, action:this.onClickRune4.bind(this)});
        this._inputMgr.addButtonArea("Rune5", {x:291, y:50,  w:13,  h:11, action:this.onClickRune5.bind(this)});
        this._inputMgr.addButtonArea("Rune6", {x:305, y:50,  w:13,  h:11, action:this.onClickRune6.bind(this)});
    }

    onClickRune1() {
        const char = "a"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune1");
    }

    onClickRune2() {
        const char = "b"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune2");
    }

    onClickRune3() {
        const char = "c"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune3");
    }

    onClickRune4() {
        const char = "d"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune4");
    }

    onClickRune5() {
        const char = "e"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune5");
    }

    onClickRune6() {
        const char = "f"
        const code = char.charCodeAt(0) + this._magicMenu[this._active]._pendingSpell.length*6;
        this._magicMenu[this._active]._pendingSpell += String.fromCharCode(code);
        console.log("rune6");
    }

    deactivateClick() {
        this._inputMgr.remButtonArea("Champ1");
        this._inputMgr.remButtonArea("Champ2");
        this._inputMgr.remButtonArea("Champ3");
        this._inputMgr.remButtonArea("Champ4");
    }

    onClickChamp1(x:number, y:number) {
        this._active = 0;
        this.activateClick();
    }

    onClickChamp2(x:number, y:number) {
        this._active = 1;
        this.activateClick();
    }

    onClickChamp3(x:number, y:number) {
        this._active = 2;
        this.activateClick();
    }

    onClickChamp4(x:number, y:number) {
        this._active = 3;
        this.activateClick();
    }

    update(deltaTime:number, ctx:CanvasRenderingContext2D) {
        if (this._disabled) return;
        this._magicCtx.fillStyle = "black";
        this._magicCtx.fillRect(0, 0, 87, 33);
//        this.renderActiveName();
        if (this._magicMenu[this._active]) this._magicMenu[this._active].render(this._magicCtx, 0, 0);
        this.renderActiveName();
    }
}