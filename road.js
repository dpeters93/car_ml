class Road{
    constructor(x, width, laneCount = 3) {
        this.x = x; //100
        this.width = width; //180
        this.laneCount = laneCount; // 3

        this.left = x-width/2; // 10
        this.right = x+width/2; //190

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const topLeft = {x: this.left, y: this.top};
        const bottomLeft = {x: this.left, y: this.bottom};
        const topRight = {x: this.right, y: this.top};
        const bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight],
        ]
    }

    //Math.min sorgt dafür, das wenn der Index für die Spur zu groß ist, nimmt er den äußersten deifinierten Fahrstreifen
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left+laneWidth/2+ Math.min(laneIndex, this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        for(let i = 0; i <= this.laneCount; i++){
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            )

            ctx.setLineDash([30,20])
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        ctx.setLineDash([])

        this.borders.forEach((border)=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke()
        })
    }
}