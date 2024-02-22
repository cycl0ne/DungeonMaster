import { MainMenu } from "./module/MainMenu.js";
import { UI_MovementArrows } from "./module/UI_MovementArrows.js";
import { ScreenStack } from "./screen/ScreenStack.js";
import { GameScreen } from "./screen/GameScreen.js";
import { BuildGame } from "./builder/BuildGame.js";
import { SpriteManager } from "./gfx/sprite/SpriteManager.js";
import { SpriteSystem } from "./gfx/sprite/SpriteSystem.js";
//import { CsvLoader } from "./module/CSVParse.js";

//

window.addEventListener('load', function() {

    const canvas = <HTMLCanvasElement> document.getElementById('canvas1');
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 800;



    (async function main() {
        let sm = SpriteSystem.getInstance();
        await BuildGame.getInstance().loadAllImages();
        //bg.processAssets();
/*
        const csvLoader = new CsvLoader("./data/itemcoords.csv");

        try {
            const data = await csvLoader.load();
            console.log("csv_data:", data);
        } catch (error) {
            console.error('Error loading CSV:', error);
        }
*/
        const screen= ScreenStack.run_Screen(new GameScreen);

//        const mainMenu = new MainMenu(ctx);
        const ui_arrow = new UI_MovementArrows(ctx);
        ui_arrow.draw();
        console.log("done");
    })();


/*
            if (steps >3 ) { light += dimmer; steps = 0;}
            if (light > 1) {light = 0.8; dimmer *= -1;}
            if (light < 0) {light = 0.2; dimmer *= -1;}
            console.log("light: "+ light);
            
            ctx.save
            ctx.fillStyle = "rgba(0,0,0,"+light+")";
            ctx.fillRect(0, 32*4, 224*4, 137*4);
            ctx.restore
*/


//        console.log("GURU MEDITATION 00000000000: No Canvas found!");
});
