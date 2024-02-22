import { InputManager } from "../game/InputManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { gfx_Inventory } from "./gfx_Inventory.js"
import { InventoryManager } from "./mgr_Inventory.js";
import { Sprite } from "./sprite/Sprite.js";

export class gfx_Resurrect extends gfx_Inventory {
    _sprite:Sprite
    _invMgr:InventoryManager;
    _posX:number = 80;
    _posY:number = 52;

    constructor(invMgr:InventoryManager) {
        super();
        this._invMgr = invMgr;
        const img =  this._assetManager.getImage("obj0040") as HTMLImageElement;
        const canvas = GraphicsUtility.setImageColorToTransparent(img, "0x008800");
        this._sprite  = new Sprite(canvas, this._posX, this._posY, this._spriteManager);
        this._sprite.setPriority(3);
    }

    refresh() {

    }

    toggleInventory() {
        if (!this._isOpen) this.createClick();
        else this._inputManager.remButtonArea("Resurrect");
        super.toggleInventory();
    }

    onClickResurrect() {
        console.log("clickedResu");
        this._sprite.setVisible(false);
        this.toggleInventory();
        this.remClick();
        this._invMgr.closeReincarnate(true);
    }

    onCancel() {
        console.log("Cancel");
        this._sprite.setVisible(false);
        super.toggleInventory();
        this.remClick();
        this._invMgr.closeReincarnate(false);
    }

    remClick() {
        this._inputManager.remButtonArea("Resurrect");
        this._inputManager.remButtonArea("Cancel");
    }

    createClick() {
        this._inputManager.addButtonArea("Resurrect", {x:104, y:85,  w:55,  h:57, action:this.onClickResurrect.bind(this)});
        this._inputManager.addButtonArea("Cancel",    {x:104, y:145, w:114, h:11, action:this.onCancel.bind(this)});
    }

    update() {
        super.update();
        this._sprite.setVisible(true);
        const img:HTMLCanvasElement = this._sprite.getImage() as HTMLCanvasElement;
    }
}