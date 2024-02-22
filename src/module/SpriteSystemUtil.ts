import { Distance } from "../gfx/enum_Distance.js";
import { Position } from "../gfx/enum_Position.js";
import { SpriteSystem } from "../gfx/sprite/SpriteSystem.js";

export class SpriteSystemUtil {
    static SpritePrio(dis:Distance, pos:Position):number {
        const basePriorityMap = {
            [Distance.D3]: 17,
            [Distance.D2]: 12,
            [Distance.D1]: 7,
            [Distance.D0]: 2
        };
    
        const positionOffset = {
            [Position.FarLeft]: 0,
            [Position.FarRight]: 1,
            [Position.Left]: 2,
            [Position.Right]: 3,
            [Position.Center]: 4
        };
        return -(basePriorityMap[dis] - positionOffset[pos]);
    }
}