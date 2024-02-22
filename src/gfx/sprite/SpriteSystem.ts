import { SpriteManager } from "./SpriteManager.js";

export class SpriteSystem {
    private static instance: SpriteSystem | null = null;
    private managers:SpriteManager[] = [];
    private defaultSpriteManager:SpriteManager | null = null;
    private constructor() {this.addSpriteManager(new SpriteManager());}

    static getInstance(): SpriteSystem {
        if (!this.instance) {
            this.instance = new SpriteSystem();
        }
        return this.instance;
    }

    update(deltaTime:number): void {
        for (let manager of this.managers) {
            manager.update(deltaTime);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let manager of this.managers) {
            if (!manager.disabled()) manager.render(ctx);  // Assuming the draw method of SpriteManager requires a CanvasRenderingContext2D parameter
        }
    }

    updatePriority(manager: SpriteManager):void {
        // Remove the manager from its current position
        const index = this.managers.indexOf(manager);
        if (index !== -1) {
            this.managers.splice(index, 1);
        }

        // Find the new correct position for the manager based on its priority
        let newIndex = this.managers.length; // Default to the end of the list
        for (let i = 0; i < this.managers.length; i++) {
            if (this.managers[i].getPriority() > manager.getPriority()) {
                newIndex = i;
                break;
            }
        }

        // Add the manager back into the list at its new position
        this.managers.splice(newIndex, 0, manager);
    }

    addSpriteManager(manager:SpriteManager)
    {
        const index = this.managers.indexOf(manager);

        if (index === -1) {  // Only push if it's not already in the list
            this.managers.push(manager);
    
            if (!this.defaultSpriteManager) {
                this.defaultSpriteManager = manager;
            }
        }
    
        this.updatePriority(manager);  // Update priority regardless
    }

    removeSpriteManager(manager:SpriteManager){
        const index = this.managers.indexOf(manager);
        if (index !== -1) {
            this.managers.splice(index, 1);
    
            // If the removed manager was the default, unset it or set a new default.
            if (this.defaultSpriteManager === manager) {
                this.defaultSpriteManager = null;
            }
        }
    }

    getSpriteManager(index: number): SpriteManager | null {
        if (index >= 0 && index < this.managers.length) {
            return this.managers[index];
        }
        return null; 
    }

    getSpriteManagerCount(): number {
        return this.managers.length;
    }

    getDefaultSpriteManager(): SpriteManager {
        if (this.defaultSpriteManager) {
            return this.defaultSpriteManager;
        } else if (this.managers.length > 0) {
            return this.managers[this.getSpriteManagerCount() - 1]; // Return the last SpriteManager from the list
        } else {
            const newManager = new SpriteManager();
            this.addSpriteManager(newManager);
            return newManager; // Return the newly created SpriteManager
        }
    }

    setDefaultSpriteManager(manager: SpriteManager): void {
        // If the manager is not already part of the system, add it.
        if (!this.managers.includes(manager)) {
            this.addSpriteManager(manager);
        }
    
        this.defaultSpriteManager = manager;
    }

    hasSpriteManager(manager: SpriteManager): boolean {
        return this.managers.includes(manager);
    }

    getSpriteManagerName(name:string):SpriteManager|null {
        for (let i = 0; i < this.managers.length; i++) {
            if (this.managers[i].getName() === name) return this.managers[i];
        }
        return null;
    }
}