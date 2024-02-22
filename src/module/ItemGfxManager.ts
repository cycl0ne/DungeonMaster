import { AssetManager } from "./AssetManager.js";
import { GraphicsUtility } from "./GraphicsUtility.js";

export class ItemGfxManager {
    private static instance: ItemGfxManager | null = null;
    private _gfx:HTMLImageElement[] = [];

    private constructor() {
        // Private constructor to prevent external instantiation
        this._gfx[0] = AssetManager.getInstance().getImage("obj0042") as HTMLImageElement;
        this._gfx[1] = AssetManager.getInstance().getImage("obj0043") as HTMLImageElement;
        this._gfx[2] = AssetManager.getInstance().getImage("obj0044") as HTMLImageElement;
        this._gfx[3] = AssetManager.getInstance().getImage("obj0045") as HTMLImageElement;
        this._gfx[4] = AssetManager.getInstance().getImage("obj0046") as HTMLImageElement;
        this._gfx[5] = AssetManager.getInstance().getImage("obj0047") as HTMLImageElement;
        this._gfx[6] = AssetManager.getInstance().getImage("obj0048") as HTMLImageElement;
    }

    // 35 -> Loc 1, 
    // 35 -> 35 - Loc * 32/16 = 3 (y)

    getImage(which:number):HTMLCanvasElement {
        if (which<0||which>223) return GraphicsUtility.createCanvasWH(0,0);
        const loc   = Math.floor(which/32);
        const y     = Math.floor((which -loc*32)/16);
        const x     = Math.floor((which -loc*32)%16);
        console.log(`Cutting ${which} : ${loc} - (${x}):(${y})`);
        return GraphicsUtility.cutImage(this._gfx[loc], x*16, y*16, 16, 16);
    } 

    // Singleton
    static getInstance(): ItemGfxManager {
        if (!ItemGfxManager.instance) {
            ItemGfxManager.instance = new ItemGfxManager();
        }
        return ItemGfxManager.instance;
    }
}