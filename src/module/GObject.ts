export class GObject {
    image:any;
    width:number;
    height:number;

    constructor(name:string) {
        this.image = document.getElementById(name);
        this.width = this.image.naturalWidth;
        this.height= this.image.naturalHeight;
//        console.log("width: "+this.width+" height: "+this.height);
    }

    draw(ctx:CanvasRenderingContext2D, x:number, y:number) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image,x*4 ,y*4 ,this.width*4, this.height*4);
    }

    cloneMirHor():HTMLCanvasElement {
        let buffer:HTMLCanvasElement = document.createElement("canvas");
        buffer.width = this.image.width;
        buffer.height = this.image.height;

        let bufferctx  = buffer.getContext("2d");
        if (bufferctx)
        {
            bufferctx.scale(-1,1);
            bufferctx.drawImage(this.image, -buffer.width, 0, buffer.width, buffer.height);
        }
        return buffer;
    }
}
