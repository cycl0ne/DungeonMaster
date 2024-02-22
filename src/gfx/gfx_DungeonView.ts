import { DMap } from "../DMap/DMap.js";
import { MapCell } from "../DMap/MapCell.js";
import { Point } from "../DMap/Point.js";
import { AssetManager } from "../module/AssetManager.js";
import { Direction } from "../game/enum_Direction.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { Player } from "../game/Player.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { FloorManager } from "./mgr_Floor.js";
import { DoorManager } from "./mgr_Door.js";
import { Sprite } from "./sprite/Sprite.js";
import { StairManager } from "./mgr_Stairs.js";
import { WallManager } from "./mgr_Wall.js";
import { enum_MapCell } from "../DMap/enum_MapCell.js";
import { SpriteSystem } from "./sprite/SpriteSystem.js";
import { DoorButton } from "./Door_Doorbutton.js";
import { SpriteManager } from "./sprite/SpriteManager.js";
import { GameEngine } from "../game/GameEngine.js";

type FOV = {
    distance: Distance,
    position: Position
};

export class gfx_DungeonView {
    floor:Sprite[] = [];
    ceiling:Sprite[] = [];
    altView:boolean = false;
    wallmgr:WallManager;
    floormgr:FloorManager;
    doormgr:DoorManager;
    stairmgr:StairManager;
    _assetManager:AssetManager = AssetManager.getInstance();
    _spriteMgr:SpriteManager;
    _game:GameEngine;

    constructor(sm:SpriteManager, game:GameEngine ) {
        this._spriteMgr = sm;
        this._game = game;
        this.ceiling[0] = new Sprite(AssetManager.getInstance().getImage("obj0079"), 0, 0, sm);
        this.ceiling[1] = new Sprite(GraphicsUtility.mirrorImageHorizontally(this._assetManager.getImage("obj0079")as HTMLImageElement), 0, 0, sm);
        this.floor[0]   = new Sprite(AssetManager.getInstance().getImage("obj0078"), 0, 39, sm);
        this.floor[1]   = new Sprite(GraphicsUtility.mirrorImageHorizontally(this._assetManager.getImage("obj0078")as HTMLImageElement), 0, 39, sm);
        this.floor[0].setPriority(-100);
        this.floor[1].setPriority(-100);
        this.floor[0].setVisible(true);
        this.ceiling[0].setVisible(true);
        this.ceiling[0].setPriority(-100);
        this.ceiling[1].setPriority(-100);
        this.wallmgr    = new WallManager(sm);
        this.doormgr    = new DoorManager(sm);
        this.floormgr   = new FloorManager(sm);
        this.stairmgr   = new StairManager(sm);
    }

    /**
     * Determines and returns the cell in the dungeon that corresponds to the player's 
     * field of view based on their position, direction, distance, and position in the FOV.
     * @param dungeon - The dungeon map
     * @param posX - Player's X position
     * @param posY - Player's Y position
     * @param direction - Player's current direction
     * @param distance - Distance in the FOV
     * @param position - Position in the FOV
     * @returns Corresponding dungeon cell or null if not found
     */
    getCellForView(dungeon: DMap, posX: number, posY: number, direction: Direction, distance: Distance, position: Position): MapCell | null {
        const CENTER_OFFSET = Position.Center;
        const positionOffset = position - CENTER_OFFSET;
        const distanceOffset = -distance;
    
        switch (direction) {
            case Direction.North:
                return dungeon.cell(new Point(posX + positionOffset, posY + distanceOffset));
            case Direction.East:
                return dungeon.cell(new Point(posX - distanceOffset, posY + positionOffset));
            case Direction.South:
                return dungeon.cell(new Point(posX - positionOffset, posY - distanceOffset));
            case Direction.West:
                return dungeon.cell(new Point(posX + distanceOffset, posY - positionOffset));
        }
        return null;
    }

    public onClickFOV(x:number, y:number):any
    {
        if (this._spriteMgr.disabled()) return;
        if (x>0 && x<224 && y>32 && y<(136+32)) {
            //console.log("Click in FOV");
            let clas = SpriteSystem.getInstance().getDefaultSpriteManager().onClick(x,y) as DoorButton;
            if (clas === undefined) return clas;
            clas.onClick();
            return clas;
        }
    }

    public renderText(ctx:CanvasRenderingContext2D, player: Player, dungeon:DMap){
        const FOVText = [{ distance: Distance.D1, position: Position.Center },
            { distance: Distance.D2, position: Position.Center },
            { distance: Distance.D3, position: Position.Center },
        ];
        const { posX, posY, dir } = player;
        for (const init of FOVText) {
            const cell = this.getCellForView(dungeon, posX, posY, dir, init.distance, init.position);
            if (cell) {
                switch (cell.type)
                {
                    case enum_MapCell.WALL:
//                        this.wallmgr.render(ctx, init.distance, init.position, cell, player.dir, this.altView);
//                        const wcell:WallCell = cell as WallCell;
//                        const text:string = wcell.text[(dir-2+4)%4];
                        //if (text) console.log(text);
                    break;
                }
            }
        }
    }

    public updateFieldOfView(player: Player, dungeon:DMap): boolean {
        this.altView = Boolean((2 + player.posX + player.posY + player.dir) % 2); // Just make some Alt Walls by toggling even and odd
        // Toggle visibility based on altView
        [this.floor, this.ceiling].forEach((element) => {
            element[Number(this.altView)].setVisible(true);
            element[Number(!this.altView)].setVisible(false);
        });

        // Extracting player position for readability
        const { posX, posY, dir } = player;
        // Our FOV (Field of Vision)
        const initializations: FOV[] = [
            { distance: Distance.D0, position: Position.Left },
            { distance: Distance.D0, position: Position.Center },
            { distance: Distance.D0, position: Position.Right },
            { distance: Distance.D1, position: Position.Left },
            { distance: Distance.D1, position: Position.Center },
            { distance: Distance.D1, position: Position.Right },
            { distance: Distance.D2, position: Position.FarLeft },
            { distance: Distance.D2, position: Position.Left },
            { distance: Distance.D2, position: Position.Center },
            { distance: Distance.D2, position: Position.Right },
            { distance: Distance.D2, position: Position.FarRight },
            { distance: Distance.D3, position: Position.FarLeft },
            { distance: Distance.D3, position: Position.Left },
            { distance: Distance.D3, position: Position.Center },
            { distance: Distance.D3, position: Position.Right },
            { distance: Distance.D3, position: Position.FarRight }
        ];

        for (const init of initializations) {
            const cell = this.getCellForView(dungeon, posX, posY, dir, init.distance, init.position);

            if (cell) {
                switch (cell.type)
                {
                    case enum_MapCell.BAD:
                    case enum_MapCell.WALL:
                        this.wallmgr.update(init.distance, init.position, cell, player.dir, this.altView);
                        break;
                    case enum_MapCell.PIT:
                    case enum_MapCell.FLOOR:
                        this.floormgr.update(init.distance, init.position, cell, player.dir, this.altView);
                        break;
                    case enum_MapCell.STAIRS:
                        this.stairmgr.update(init.distance, init.position, cell, player.dir, this.altView);
                        break;
                    case enum_MapCell.DOOR:
                        this.doormgr.update(init.distance, init.position, cell, player.dir, this.altView);
                        break;
                }
            }
        }
        return false;
    }
}
