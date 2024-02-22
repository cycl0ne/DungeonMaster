import { Builder } from "../builder/BuildChampion.js";
import { BuildGame } from "../builder/BuildGame.js";
import { StairCell } from "../DMap/Cell_Stair.js";
import { Champion } from "../DMap/Champion.js";
import { DMap } from "../DMap/DMap.js";
import { Dungeon } from "../DMap/Dungeon.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { MapCell } from "../DMap/MapCell.js";
import { Point } from "../DMap/Point.js";
import { SUBSTAIRS } from "../DMap/sub_Stairs.js";
import { gfx_DungeonView } from "../gfx/gfx_DungeonView.js";
import { Fonts } from "../gfx/fonts/Fonts.js";
import { gfx_Inventory } from "../gfx/gfx_Inventory.js";
import { SpriteManager } from "../gfx/sprite/SpriteManager.js";
import { SpriteSystem } from "../gfx/sprite/SpriteSystem.js";
import { GuruMeditation } from "../GuruMeditation.js";
import { UI_MovementArrows } from "../module/UI_MovementArrows.js";
import { tiles } from "../testing/Tiles.js";
import { Direction } from "./enum_Direction.js";
import { enum_Moves } from "./enum_Move.js";
import { GameEventHandler } from "./GameEventHandler.js";
import { Player } from "./Player.js";
import { InventoryManager } from "../gfx/mgr_Inventory.js";
import { MagicMenuManager } from "../gfx/mgr_MagiceMenu.js";
import { AttackMenuManager } from "../gfx/mgr_AttackMenu.js";
import { MirrorWOObject } from "../DMap/Cell_Wall.js";
import { StatusBarManager } from "../gfx/mgr_StatusBar.js";
import { InputManager } from "./InputManager.js";

export class GameEngine {
    player:Player;
    private delta_x:number;
    private delta_y:number;
    private ui_a:UI_MovementArrows;
    private ctx:CanvasRenderingContext2D;
    private light:number;

    //debug
    private showMap:boolean = false;
    tiles:tiles;
    srini:boolean=false;
    dmap:DMap;
    dungeon:Dungeon;
    gameEventHandler:GameEventHandler;
    fov:gfx_DungeonView;
    fovchange:boolean = true;
    _spriteSystem:SpriteSystem = SpriteSystem.getInstance();
    _fovSpriteManager:SpriteManager;
    _uiSpriteManager:SpriteManager;
    _InventorySpriteManager:SpriteManager;
    _InputMgr:InputManager = InputManager.getInstance();
    // Test:
    _renderCanvas:HTMLCanvasElement;
    _renderCTX:CanvasRenderingContext2D;

    // Text:
    _systemFont:Fonts;
    _wallFont:Fonts;
    _storyFont:Fonts;

    // Test
    _invCanvas:HTMLCanvasElement;
    _invCtx:CanvasRenderingContext2D;
    _infoCanvas:HTMLCanvasElement;
    _infoCtx:CanvasRenderingContext2D;
    _champTest:Champion;
    _StatusSpriteManager:SpriteManager;
    _invManager:InventoryManager;

    mMenuTest:MagicMenuManager;
    aMenuTest:AttackMenuManager;
    sMenuTest:StatusBarManager;

    static game:GameEngine;

    createCanvas(w:number, h:number):HTMLCanvasElement {
        const canvas:HTMLCanvasElement = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    constructor(ctx:CanvasRenderingContext2D)
    {
        //console.log("Converting Dungeon");
        //ConvertDungeon.convert();
        this.dungeon = BuildGame.getInstance().BuildDungeon();
        console.log("BuildGame finished");
        this._systemFont = new Fonts("obj0695", "!~#$§&'()*+,-./0123456789:;<=>? ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmonpqrstuvwx", 6, 6, 2, 266);
        this._wallFont = new Fonts("obj0258", "ABCDEFGHIJKLMNOPQRSTUVWXYZ ", 8, 8, 0);
        this._storyFont = new Fonts("obj0695", " ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8, 6, 0);
        this._renderCanvas = this.createCanvas(320,200);  
        this._renderCTX = this._renderCanvas.getContext('2d') as CanvasRenderingContext2D;
        this._infoCanvas = this.createCanvas(67,29);
        this._infoCtx = this._infoCanvas.getContext('2d')as CanvasRenderingContext2D;

        this._invCanvas = this.createCanvas(224,136);
        this._invCtx = this._invCanvas.getContext('2d')as CanvasRenderingContext2D;
        this._fovSpriteManager = this._spriteSystem.getDefaultSpriteManager();
        this._fovSpriteManager.setOrigin(0,32);
        this._fovSpriteManager.setName("FOV");

        this._uiSpriteManager = new SpriteManager();
        this._uiSpriteManager.setName("UX");
        this._InventorySpriteManager = new SpriteManager();
        this._InventorySpriteManager.setOrigin(0,32);
        this._InventorySpriteManager.setName("Inventory");

        this._StatusSpriteManager = new SpriteManager();
        this._StatusSpriteManager.setOrigin(0,0);
        this._StatusSpriteManager.setName("Status");

        this._spriteSystem.addSpriteManager(this._uiSpriteManager);
        this._spriteSystem.addSpriteManager(this._InventorySpriteManager);
        this._spriteSystem.addSpriteManager(this._StatusSpriteManager);
/*
        this._systemFont.setHorizontalAlignment("center");
        this._systemFont.renderTextAligned(this._renderCTX, 320/2, 0, "#");
        this._systemFont.renderTextAligned(this._renderCTX, 320/2, 40/2, "DUNGEON MASTER", "0x00CCCC", "0x0");
        this._wallFont.renderTextCentered(this._renderCTX, 320/2, 10/2, "DUNGEON MASTER");
*/        
        this.ui_a = new UI_MovementArrows(ctx);
        //this.player = new Player(3,1,0, Direction.West);
//        this.player = new Player(6,8,0, Direction.South);
        this.player = new Player(1,3,0, Direction.South);
        this.ctx = ctx;
        this.delta_x = this.delta_y = this.light = 0;
        this.dmap = this.dungeon.getLevel(this.player.level);
        console.log("Player Level:"+this.player.level);
        this.tiles = new tiles(ctx, this.dungeon);
        this.gameEventHandler = new GameEventHandler(this.dungeon);
        this.fov = new gfx_DungeonView(this._fovSpriteManager, this);

//        this._inventoryTest = new gfx_Inventory();
        this._invManager = new InventoryManager(this, this.player);
        const c = this._champTest = new Champion("ALEX", "ANDER", "M", 500, 570, 130, 440, 550, 450, 400, 350, 400, 500, 0, 4, 0, 3, 11);
//        this._status[0] = new gfx_Status(0);
//        this._status[1] = new gfx_Status(1);
//        this._status[2] = new gfx_Status(2);
//        this._status[3] = new gfx_Status(3);
        this.mMenuTest  = new MagicMenuManager(this, this.player);
        this.aMenuTest  = new AttackMenuManager(this, this.player);
        this.sMenuTest  = new StatusBarManager(this, this.player);
        GameEngine.game = this;
        this._InputMgr.addButtonArea("FOV", {x:0, y:32, w:224, h:102, action:this.onClickFov.bind(this)});
    }

    private face2delta(face:Direction) {
        this.delta_x =  (face)%2;
        this.delta_y = ((face+1)%2);
        if (face == Direction.North) this.delta_y*=-1;
        if (face == Direction.West)  this.delta_x*=-1;
    }

    stairsPlayer(cell:MapCell) {
        let stairs:StairCell = cell as StairCell;
        let lvl:DMap;
        if (stairs.direction == SUBSTAIRS.DOWN) {
            if (this.player.level == 1) return; //no more levels ATM
            lvl = this.dungeon.getLevel(this.player.level+1);
//            console.log(`Offset: ${lvl.offset.x}${lvl.offset.y}`)
            this.player.dir = (this.player.dir + 1)%4;
            this.player.posX -= lvl.offset.x;
            this.player.posY -= lvl.offset.y;
            this.player.level+= 1;
            let p:Point = new Point(this.player.posX, this.player.posY);
            let cell:StairCell = lvl.cell(p) as StairCell;
            this.player.dir = cell.facing;
            this.dmap = lvl;
            this.fovchange = true;
        } else {
            if (this.player.level == 0) return;
            lvl = this.dungeon.getLevel(this.player.level-1);
            this.player.posX += this.dmap.offset.x;
            this.player.posY += this.dmap.offset.y;
            this.player.dir = (this.player.dir - 1)%4;
            let p:Point = new Point(this.player.posX, this.player.posY);
            let cell:StairCell = lvl.cell(p) as StairCell;
            this.player.dir = cell.facing;
            this.player.level-= 1;
            this.dmap = lvl;
            this.fovchange = true;
        }
    }

    movePlayer(move:enum_Moves)
    {
        let p = new Point();
        p.x = this.player.posX;
        p.y = this.player.posY;

        if (move <= enum_Moves.MOVE_LEFT)
        {
            if ((move == enum_Moves.MOVE_BACK) && (this.dmap.cell(p).type == enum_MapCell.STAIRS)) {
                this.stairsPlayer(this.dmap.cell(p));
            }

            let newpos:Direction = (this.player.dir+move)%4;
            this.face2delta(newpos);
            p.x = this.player.posX + this.delta_x;
            p.y = this.player.posY + this.delta_y;
            // A wall? Then return, no walking..
            let cell:MapCell = this.dmap.cell(p)
            if (this.dmap.blocked(p)) return;
            this.player.posX=p.x;
            this.player.posY=p.y;
            if (cell.type == enum_MapCell.STAIRS) this.stairsPlayer(cell);
            cell = this.dmap.cell(p);
            cell.exc(this.player);
        } else
        {
            if (move == enum_Moves.MOVE_TURNRIGHT)
            {
                if (this.dmap.cell(p).type == enum_MapCell.STAIRS) {
                    this.stairsPlayer(this.dmap.cell(p));
                }
                else this.player.dir = (this.player.dir + Direction.East) % 4;
            } else if (move == enum_Moves.MOVE_TURNLEFT)
            {
                if (this.dmap.cell(p).type == enum_MapCell.STAIRS) {
                    this.stairsPlayer(this.dmap.cell(p));
                }
                else this.player.dir = (this.player.dir + Direction.West) % 4;
            }
        }
        this.fovchange = true;
    }

    private cnt:number = 0;
    private arr:enum_Moves[] = [
        enum_Moves.MOVE_LEFT, enum_Moves.MOVE_UP, enum_Moves.MOVE_LEFT,
        enum_Moves.MOVE_TURNRIGHT, enum_Moves.MOVE_LEFT,enum_Moves.MOVE_LEFT,enum_Moves.MOVE_LEFT, 
        enum_Moves.MOVE_UP, enum_Moves.MOVE_LEFT, enum_Moves.MOVE_TURNRIGHT, 
        enum_Moves.MOVE_UP,enum_Moves.MOVE_UP,enum_Moves.MOVE_UP,enum_Moves.MOVE_TURNRIGHT,
        enum_Moves.MOVE_UP,enum_Moves.MOVE_UP,enum_Moves.MOVE_UP,enum_Moves.MOVE_UP, 
    ];

    update(deltaTime:number)
    {
        this.cnt += deltaTime;
//        this._status[0].renderStatus(this._renderCTX, 0);
//        this._status[1].renderStatus(this._renderCTX, 0);
//        this._status[2].renderStatus(this._renderCTX, 0);
//        this._status[3].renderStatus(this._renderCTX, 0);

        this._invManager.update(deltaTime);
        this.mMenuTest.update(deltaTime, this._renderCTX);
        this.aMenuTest.update(deltaTime, this._renderCTX);
//        if (this._inventoryTest._isOpen) {
//            this._inventoryTest.update();
//        } else {
 //       if (this.fovchange) {
            this._fovSpriteManager.clearVis();
            this.fovchange = this.fov.updateFieldOfView(this.player, this.dmap);
 //       }
 //       } else
 //       {
 //           const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
 //           GuruMeditation.drawError(canvas, 0xdeadbeef, 'An unexpected error occurred.', deltaTime);
 //       }        
 //       }
    }

    render(deltaTime:number)
    {
        this._renderCTX.fillStyle= "black";
        //this._renderCTX.fillRect(0, 32, 224, 136);
        this._renderCTX.fillRect(0, 0, 320, 200);
        //if (this.skipframe) return (this.skipframe=!this.skipframe);
        SpriteSystem.getInstance().draw(this._renderCTX);
        

//        if (this._inventoryTest._isOpen) {
            //this.ctx.drawImage(this._renderCanvas, 0, 0, 224, 168+32, 0, 0,  224*4, 168*4);
           // this.ctx.drawImage(this._renderCanvas, 0, 32, 224, 136, 0, 32*4,  224*4, 136*4);
            //this.ctx.drawImage(this._renderCanvas, 0, 0, 320, 200, 0, 0,  1280, 800);
//        } else 
        { 
            this.fov.renderText(this._renderCTX, this.player, this.dmap);
            //        this.ctx.drawImage(this._renderCanvas, 0, 0, 320, 200, 0, 0,  1280, 800);
            //this.ctx.drawImage(this._renderCanvas, 0, 32, 224, 136, 0, 32*4,  224*4, 136*4);
            //        this.ctx.drawImage(this._renderCanvas, 0, 0, 320, 32, 0, 0, 1280, 32*4);


            //        this._champTest.update();
            //        this._champTest.renderInfoBoxDun(this._infoCtx, 0);
            //        this.ctx.drawImage(this._infoCanvas, 0, 0, 67,29, 0,0, 67*4,29*4)
            //        this._champTest.showInventory(this._invCtx);
            //        this.ctx.drawImage(this._invCanvas, 0, 0, 224, 136, 0, 32*4, 224*4, 137*4);        
        }
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this._renderCanvas, 0, 0, 320, 200, 0, 0,  1280, 800);
        this.ui_a.draw();
        if (this.showMap) this.tiles.draw(this.player.posX,this.player.posY, this.player.dir, this.player.level);
        //else this.tiles.clear();
    }
 
    private lastKey:any;

    onKeyUp(event:KeyboardEvent) {
        switch (this.lastKey)
        {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'KeyQ':
            case 'KeyW':
            case 'KeyE':
            case 'KeyA':
            case 'KeyS':
            case 'KeyD':
                this.ui_a.draw();
            break;
        }
    }


    onKeyDown(event:KeyboardEvent) {
        this.lastKey = event.code;
        switch (event.code)
        {
            case 'ArrowUp':
            case 'KeyW':
                this.movePlayer(enum_Moves.MOVE_UP); 
                this.ui_a.drawUp();
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.movePlayer(enum_Moves.MOVE_BACK); 
                this.ui_a.drawBack();
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.movePlayer(enum_Moves.MOVE_LEFT); 
                this.ui_a.drawLeft();
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.movePlayer(enum_Moves.MOVE_RIGHT);
                this.ui_a.drawRight();
                break;
            case 'KeyQ':
                this.movePlayer(enum_Moves.MOVE_TURNLEFT);
                this.ui_a.drawTurnLeft();
                break;
            case 'KeyE':
                this.movePlayer(enum_Moves.MOVE_TURNRIGHT);
                this.ui_a.drawTurnRight();
                break;
            case 'KeyM':
                this.showMap = !this.showMap;
                break;
            case 'KeyP':
                //this.srini = !this.srini;
                const sm = SpriteSystem.getInstance();
                sm.getDefaultSpriteManager().dbg_ListVid();
                //sm.getDefaultSpriteManager().dbg_showPrioList();
                break;
            case 'KeyN':
 //               this._inventoryTest._champion = this._champTest;
 //               this._inventoryTest.toggleInventory();
 //               if (this._inventoryTest._isOpen) this._fovSpriteManager.disable();
//                else  this._fovSpriteManager.enable();
                if (this.player.maxChampion>3) return;
                this.player.champion[this.player.maxChampion] = this._champTest;
//                this._status[this.player.maxChampion].addChamp(this._champTest);
                this.mMenuTest.addChampion(this.player.maxChampion, this._champTest);
                this.aMenuTest.addChampion(this.player.maxChampion, this._champTest);
                this.sMenuTest.addChampion(this.player.maxChampion, this._champTest);
                this.player.maxChampion++;
                break;
            case 'KeyB':
                this.player.posX= 4;
                this.player.posY= 15;
                this.player.dir = Direction.West;
                //this.player.level = 1;
                //this.dmap = this.dungeon.getLevel(1);
                this.fovchange = true;
                //BuildGame.getInstance().BuildDungeon(this.dmap);
                break;
            case 'KeyI':
                this._invManager.toggleInventory(2,0);
            break;
        }
        //console.log(event);
    }

    _tmp:MirrorWOObject|null = null;

    openReincarnate(c:Champion, m:MirrorWOObject) {
        if (this.player.maxChampion>3) return;
        this._tmp = m;
        this.disableClick();
        this._fovSpriteManager.disable();
        this.player.champion[this.player.maxChampion] = c;
//        this._status[this.player.maxChampion].addChamp(c);
        this.mMenuTest.addChampion(this.player.maxChampion, c);
        this.aMenuTest.addChampion(this.player.maxChampion, c);
        this.sMenuTest.addChampion(this.player.maxChampion, c);
        this._invManager.openReincarnate(c);
    }

    closeReincarnate(reinc:boolean) {
        if (!reinc) {
            this.player.champion[this.player.maxChampion]=null;
            //this._status[this.player.maxChampion].remChamp();
            this.mMenuTest.remChampion(this.player.maxChampion);
            this.aMenuTest.remChampion(this.player.maxChampion);
            this.sMenuTest.remChampion(this.player.maxChampion);
        } else{
            if (this._tmp) this._tmp.champion = null;
            this.player.maxChampion++;
        }
        this.enableClick();
        this._fovSpriteManager.enable();
    }

    disableClick() {
        this._InputMgr.remButtonArea("FOV");
    }

    enableClick() {
        this._InputMgr.addButtonArea("FOV", {x:0, y:32, w:224, h:102, action:this.onClickFov.bind(this)});      
    }

    onMouseUp(event:MouseEvent) {
        this.ui_a.onRelease();
    }

    onClickFov(x:number,y:number) {
//        this._InputMgr.remButtonArea("FOV");
        this.fov.onClickFOV(x,y);
//        this._InputMgr.addButtonArea("FOV", {x:0, y:32, w:224, h:102, action:this.onClickFov.bind(this)});
    }

    onMouseDown(event:MouseEvent) {
        const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width/rect.width;
        var scaleY = canvas.height/rect.height;
        var xx = Math.floor((event.clientX - rect.left) * scaleX);
        var yy = Math.floor((event.clientY - rect.top) * scaleY);

        //console.log(xx+":"+yy);
//        this.fov.onClickFOV(xx/4,yy/4);
        let move = this.ui_a.onclick(xx,yy);
        if (move ==  enum_Moves.MOVE_MAX) return;
        this.movePlayer(move);
        //console.log(move);
    }
}