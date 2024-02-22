import { MapCell } from "../DMap/MapCell.js";
import { MapSymbol } from "../DMap/MapSymbol.js";
import { AssetManager } from "../module/AssetManager.js";
import { GraphicsUtility } from "../module/GraphicsUtility.js";
import { SpriteSystemUtil } from "../module/SpriteSystemUtil.js";
import { Distance } from "./enum_Distance.js";
import { Position } from "./enum_Position.js";
import { OrnamentData } from "./OrnamentData.js";
import { Sprite } from "./sprite/Sprite.js";

class Ornament {
    distance: Distance;
    position: Position;
    ornamentSide:Sprite[] = [];
    ornamentFront:Sprite[] = [];

    constructor(distance:Distance, position:Position) {
        this.distance = distance;
        this.position = position;
        this.createSprite();
    }

    createSprite() {
        let ornamentIndex =0;
        const ornament = OrnamentData.getOrnament(ornamentIndex);
        if (!ornament) return;
        const coordinates = OrnamentData.getCoordinatesForOrnament(ornament.coordinatesSetIndex);
        if (!coordinates) return;
        const img = AssetManager.getInstance().getImage(ornament.images.secondary);
        this.ornamentFront[this.distance] = new Sprite(img);
    }

    update(cell: MapCell, alt:boolean, face:number)
    {

    }  
}

export class OrnamentManager {
    ornament: Map<Distance, Map<Position, Ornament>> = new Map();
 
    constructor() {
        const initializations = [
            { distance: Distance.D1, position: Position.Left },
            { distance: Distance.D1, position: Position.Center },
            { distance: Distance.D1, position: Position.Right },
            { distance: Distance.D2, position: Position.Left },
            { distance: Distance.D2, position: Position.Center },
            { distance: Distance.D2, position: Position.Right },
            { distance: Distance.D3, position: Position.Left },
            { distance: Distance.D3, position: Position.Center },
            { distance: Distance.D3, position: Position.Right },
        ];
        
        for (const init of initializations) {
            if (!this.ornament.has(init.distance)) {
                this.ornament.set(init.distance, new Map());
            }
            // Call Initalisation Routine
            this.ornament.get(init.distance)!.set(init.position, new Ornament(init.distance, init.position));
        }
    }

    update(distance:Distance, position:Position, cell:MapCell, dir:number, alt:boolean):void {
        const ornament = this.ornament.get(distance)?.get(position);
        if (ornament) ornament.update(cell, alt, dir);
    }
}

/*
class OrnateManager {
    constructor(spriteManager, ornateDetails) {
        this.ornates = new Map();

        for (let distance of ['D1', 'D2', 'D3']) {
            for (let position of ['left', 'center', 'right']) {
                const key = `${distance}_${position}`;
                this.ornates.set(key, new Ornate(ornateDetails, spriteManager, distance, position));
            }
        }
    }

    update(distance, position, cell, alt) {
        const key = `${distance}_${position}`;
        this.ornates.get(key).update(cell, alt, position);
    }
}

class Ornate {
    constructor(ornateDetails, spriteManager, distance, position) {
        this.sprites = {};

        for (let ornateType of Object.keys(ornateDetails)) {
            this.sprites[ornateType] = {
                //left: new Sprite(/* initialize using ornateDetails and left properties ),
                //center: new Sprite(/* initialize using ornateDetails and center properties ),
                //right: new Sprite(/* initialize using ornateDetails and right properties ),
            };
        }
    }

    update(cell, alt, position) {
        const ornateType = cell.subtype;

        for (let type of Object.keys(this.sprites)) {
            for (let pos of ['left', 'center', 'right']) {
                this.sprites[type][pos].setVisible(false); // Initially set all to invisible
            }
        }

        // Make the appropriate sprite visible based on cell subtype and other conditions
        this.sprites[ornateType][determineSpritePositionSomehow(cell, position, alt)].setVisible(true);
    }
}
*/