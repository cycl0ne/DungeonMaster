export class Ideas {
// Idea Brainstorming
// WallGfx & FloorGfx for drawing:
/*
Seperation of Logic and Gfx
FloorItem & WallItem -> Logic
FloorGfx & WallGfx -> Drawing

    FOV = an Array of both 
    Fetches Data from Dungeonfloor and stores it in itself
a call could be:
constructor(ctx, dungeonfloor)

    Draw() -> Iterates through the FOV and prints all Infos Items Floor, Ornate, Walls,....

    the new design could be:
    wall object knows all walls and all ornates?
    floor object knows all floor ornates? invisble wall?
*/

/* actual Version

WallGfx_Test creates all WallGfx and gives them the GFX they need to know. Is this logical?

*/

/*
class OrnateManager {
    private ornates: Map<string, Ornate> = new Map();
    private visibleOrnates: Set<Ornate> = new Set(); // Track which ornates are currently visible

    constructor() {
        // Initialization happens here (or you can use another method)
        // Use image paths and type details to initialize ornates based on your game's design
    }

    getOrnate(distance: Distance, position: Position, type: OrnateType): Ornate | undefined {
        const key = `${distance}_${position}_${type}`;
        return this.ornates.get(key);
    }

    // Whenever an ornate's visibility is changed, we adjust our tracking set
    updateOrnateVisibility(ornate: Ornate, visible: boolean): void {
        ornate.updateVisibility(visible);
        if (visible) {
            this.visibleOrnates.add(ornate);
        } else {
            this.visibleOrnates.delete(ornate);
        }
    }

    // Hide all currently visible ornates
    hideAllVisibleOrnates(): void {
        for (const ornate of this.visibleOrnates) {
            ornate.updateVisibility(false);
        }
        this.visibleOrnates.clear(); // Empty the set since none are now visible
    }
}

// Usage example:

const manager = new OrnateManager();

// Assuming we move and FOV changes...
manager.hideAllVisibleOrnates(); // Hide all currently visible ornates

// Now, based on the new FOV, decide which ornates to show and call:
// manager.updateOrnateVisibility(specificOrnate, true);
        const initFloor = [
                { distance: Distance.D3, position: Position.FarLeft },
                { distance: Distance.D3, position: Position.Left },
                { distance: Distance.D3, position: Position.Center },
                { distance: Distance.D3, position: Position.Right },
                { distance: Distance.D3, position: Position.FarRight },
                { distance: Distance.D2, position: Position.FarLeft },
                { distance: Distance.D2, position: Position.Left },
                { distance: Distance.D2, position: Position.Center },
                { distance: Distance.D2, position: Position.Right },
                { distance: Distance.D2, position: Position.FarRight },
                { distance: Distance.D1, position: Position.Left },
                { distance: Distance.D1, position: Position.Center },
                { distance: Distance.D1, position: Position.Right },
                { distance: Distance.D0, position: Position.Left },
                { distance: Distance.D0, position: Position.Center },
                { distance: Distance.D0, position: Position.Right },
        ];

        const initWalls2: FOV[] = [
            { distance: Distance.D3, position: Position.FarLeft },
            { distance: Distance.D3, position: Position.Left },
            { distance: Distance.D3, position: Position.Center },
            { distance: Distance.D3, position: Position.Right },
            { distance: Distance.D3, position: Position.FarRight },
            { distance: Distance.D2, position: Position.FarLeft },
            { distance: Distance.D2, position: Position.Left },
            { distance: Distance.D2, position: Position.Center },
            { distance: Distance.D2, position: Position.Right },
            { distance: Distance.D2, position: Position.FarRight },
            { distance: Distance.D1, position: Position.Left },
            { distance: Distance.D1, position: Position.Center },
            { distance: Distance.D1, position: Position.Right },
            { distance: Distance.D0, position: Position.Left },
            { distance: Distance.D0, position: Position.Right },
        ];

*/

}