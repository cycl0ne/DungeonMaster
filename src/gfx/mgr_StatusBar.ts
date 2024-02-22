import { Champion } from "../DMap/Champion.js";
import { GameEngine } from "../game/GameEngine.js";
import { Player } from "../game/Player.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SysFont } from "./fonts/SysFont.js";
import { gfx_StatusTest } from "./gfx_Status.js";
import { Sprite } from "./sprite/Sprite.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";

export class StatusBarManager {
    _isOpen:boolean = false;
    _game:GameEngine;
    _player:Player;
	_status:gfx_StatusTest[] = [];
	_statusSprite:Sprite[] = [];
	_statusBmp:HTMLCanvasElement[] = [];
	_statusBmpCtx:CanvasRenderingContext2D []=[];

    constructor(game:GameEngine, player:Player) {
        this._game = game;
        this._player=player;
		const spriteMgr = SpriteSystem.getInstance().getSpriteManagerName("Status");
		for(let i=0; i<4; i++) 
		{
			this._statusBmp[i] = GraphicsUtility.createCanvasWH(67, 29);
			this._statusSprite[i] = new Sprite(this._statusBmp[i], 69*i, 0, spriteMgr);
			this._statusBmpCtx[i] = this._statusBmp[i].getContext("2d")!;
			this._status[i] = new gfx_StatusTest(i);
		}

    }

	addChampion(which:number, c:Champion) {
		this.enable(which);
		this._status[which].addChampion(c);
		this.update();
	}

	remChampion(which:number) {
		this.disable(which);
		this._status[which].remChampion();
	}

	enable(which:number) {
		this._statusSprite[which].setVisible(true);
	}

	disable(which:number) {
		this._statusSprite[which].setVisible(false);
	}

	enableAll() {
		for (let i=0; i<4; i++) this._statusSprite[i].setVisible(true);
	}

	update() {
		let i = 0;
		for (const status of this._status) {
			const ctx = this._statusBmpCtx[i];
			status.draw(ctx);
			i++;
		}
	}

}

