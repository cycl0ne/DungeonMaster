import { Champion } from "../DMap/Champion.js";
import { GameEngine } from "../game/GameEngine.js";
import { Player } from "../game/Player.js";
import { gfx_Inventory } from "./gfx_Inventory.js";
import { gfx_Resurrect } from "./gfx_Resurrect.js";

enum ENUM_INVSTATE {
    NONE,
    NORMAL,
    RESURRECT,
    EYE,
    MAX
}

export class InventoryManager {
    _state:ENUM_INVSTATE = ENUM_INVSTATE.NONE;
    _isOpen:boolean = false;
    _game:GameEngine;
    _player:Player;
    _inventory:gfx_Inventory;
    _resurrect:gfx_Resurrect;

    constructor(game:GameEngine, player:Player) {
        this._game = game;
        this._player=player;
        this._inventory = new gfx_Inventory();
        this._resurrect = new gfx_Resurrect(this);
    }

    openInventory(c:number) {
        console.log("Open Inventory: "+c);
        if (c<0 || c>3) return;
        const champ = this._game.player.champion[c];
        if (champ) {
            if (!this._isOpen) {
                this._isOpen = true;
                this._state = ENUM_INVSTATE.NORMAL;
                this._inventory._champion = champ;
            } else {
                this._isOpen = false;
                this._state = ENUM_INVSTATE.NONE;
                this._inventory._champion = null;
            }
            this._inventory.toggleInventory();
        }
    }

    openReincarnate(c:Champion) {
        console.log("Open Reincarnate: "+this._game.player.maxChampion);
        this._resurrect._champion = c;
        this._isOpen = true;
        this._state = ENUM_INVSTATE.RESURRECT;
        this._resurrect.toggleInventory();
    }

    closeReincarnate(reincarnate:boolean) {
        console.log("Close Reincarnate: "+this._game.player.maxChampion);
        this._resurrect._champion = null;
        this._isOpen = false;
        this._state = ENUM_INVSTATE.NONE;
        this._game.closeReincarnate(reincarnate);
    }

    toggleInventory(state:ENUM_INVSTATE = ENUM_INVSTATE.NORMAL, cnum:number) {
        if (cnum>3) return;
        if (!this._player.champion[cnum]) return;
        this._isOpen = !this._isOpen;
        if (this._isOpen) {
            this._state = state;
            if (state == ENUM_INVSTATE.NORMAL) {
                this._inventory._champion = this._player.champion[0];
                this._inventory.toggleInventory();
            } else
            {
                this._resurrect._champion = this._player.champion[0];
                this._resurrect.toggleInventory();
            }
            //            this._spriteManager?.disable();
        } else {
            this._state = ENUM_INVSTATE.NONE;
            this._inventory.toggleInventory();
//            this._spriteManager?.enable();
        }
    }

    update(deltaTime:number) {
        if (!this._isOpen) return;

        switch (this._state) {
            case ENUM_INVSTATE.NORMAL:
                this._inventory.update();
                break;
            case ENUM_INVSTATE.RESURRECT:
                this._resurrect.update();
                break;
            case ENUM_INVSTATE.EYE:
                break;
            default:
                break;
        }
    }



}