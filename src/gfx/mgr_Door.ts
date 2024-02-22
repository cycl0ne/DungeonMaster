import { Door, initDoor, INIT_DOOR } from "./Door_Door.js";
import { DoorButton, initDoorB, initDoorButton } from "./Door_Doorbutton.js";
import { DoorFrame, DoorFrameInit, initDoorFrameData } from "./Door_Doorframe.js";
import { DoorObject } from "./Door_Object.js";
import { MgrBase } from "./mgr_Base.js";
import { SpriteManager } from "./sprite/SpriteManager.js";

export class DoorManager extends MgrBase<DoorObject> {
    constructor(sm:SpriteManager) {
        super(sm);
        this.initClass(initDoorFrameData,(data)=> new DoorFrame(data));
        this.initClass(initDoorB, initDoorButton,  (data, data2) => new DoorButton(data, data2));
        this.initClass(INIT_DOOR, initDoor,  (data, data2) => new Door(data, data2));
    }
}

