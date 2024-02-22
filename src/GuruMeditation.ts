export class GuruMeditation {
    private static isBlinking = true;
    private static canvas:HTMLCanvasElement;
    private static blinkingIntervall:number = 0;

    private static drawErrorScreen(ctx: CanvasRenderingContext2D, errorCode: number, errorText: string) {
        const rectHeight = 100;
        const rectTop = 10;
        const rectWidth = this.canvas.width - 20;
        const rectLeft = 10;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

        // Blinking red frame
        if (this.isBlinking) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.strokeRect(rectLeft, rectTop, rectWidth, rectHeight);
        }
    
        ctx.font = '20px monospace';
        ctx.fillStyle = '#ff0000'; // Red text color
    
        // First line centered within the red frame
        ctx.textAlign = 'center';
        ctx.fillText('Software failure. Press any key to continue', this.canvas.width / 2, rectTop + 30);
    
        // Second line centered within the red frame
        const hexErrorCode = errorCode.toString(16).toUpperCase();
        ctx.fillText(`Guru Meditation #${errorCode}.0x${hexErrorCode}`, this.canvas.width / 2, rectTop + 60);
    
        // Third line centered within the red frame
        ctx.fillText(errorText, this.canvas.width / 2, rectTop + 90);
    }

    static drawError(canvas: HTMLCanvasElement, errorCode: number, errorText: string, deltaTime: number) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const canvasWidth = canvas.width;

            this.drawErrorScreen(ctx, errorCode, errorText);

            // Toggle blinking based on delta time
            this.blinkingIntervall += deltaTime;
            if (this.blinkingIntervall > 1) 
            {
                this.isBlinking = !this.isBlinking;
                this.blinkingIntervall =0;
            }
        }
    }
}
/*
// Usage
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);

const errorCode = 123;
const errorText = 'An unexpected error occurred.';
const deltaTime = 1 / 60; // 1/60th of a second

GuruMeditation.drawError(canvas, errorCode, errorText, deltaTime);
*/
