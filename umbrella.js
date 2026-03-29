const canvas = document.getElementById("Umbrella");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t=0;
let umbrellaRotation= 0; //initial rotation angle in radians

function drawBaseLighting() {
    const pulse = (Math.sin(t) +1)/2; // 0 to 1

    //backgorund
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //global red wash
    ctx.fillStyle = "rgba(255,0,0,0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //dynamic center
    const cx = canvas.width/2 + Math.sin(t*0.5)*100; // oscillate horizontally
    const cy = canvas.height/2 + Math.cos(t*0.3)*60; // oscillate vertically

    const maxRadius = Math.max(canvas.width, canvas.height);
    const radius = maxRadius * (0.6 + pulse * 0.4);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

    gradient.addColorStop(0, `rgba(255,0,0,${0.8 + pulse * 0.2})`);
    gradient.addColorStop(0.4, 'rgba(255,0,0,0.5)');
    gradient.addColorStop(1, 'rgba(255,0,0,0.25)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function drawGrid(){
    const spacing = 80;//pixels between lines
    ctx.strokeStyle = "rgba(255,0,0,0.15)";
    ctx.lineWidth = 1;

    //vertical lines
    for( let x=0; x< canvas.width;  x += spacing){
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    //horizontal lines
    for(let y=0; y<canvas.height; y+= spacing){
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }    
}

function drawUmbrella(cx, cy, radius, angle){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle); //spinning effect

    for(let i=0; i<8; i++){
        ctx.beginPath();
        ctx.moveTo(0,0);
        const startAngle= (i * Math.PI/4); // 8 segments for 360 degrees
        const endAngle= startAngle + Math.PI/4;
        const midAngle= (startAngle + endAngle)/2;

        //first edge
        const x1 = radius * Math.cos(startAngle);
        const y1 = radius * Math.sin(startAngle);
        ctx.lineTo(x1,y1);
       
        //second edge
        const x2= radius * Math.cos(endAngle);
        const y2= radius * Math.sin(endAngle);

        //control point for curve (pulling towards center for a dome shape)
        const curveRadius = radius * .85; // how much the curve pulls outward
        const cxCurve=curveRadius * Math.cos(midAngle);
        const cyCurve=curveRadius * Math.sin(midAngle);

        //draw curve
        ctx.quadraticCurveTo(cxCurve, cyCurve, x2, y2);
        ctx.closePath();

        const gradient = ctx.createRadialGradient(0, 0, radius*0.1, 0, 0, radius); //inner glow and outter edge
        if ( i % 2 === 0) {
            gradient.addColorStop(0, 'rgba(255, 80, 80, 0.8)'); // bright red center
            gradient.addColorStop(1, 'rgba(120, 0, 0, 0.4)'); // darker red edges
        } else {
            gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
            gradient.addColorStop(1, 'rgba(200,200,200,0.2)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,.06)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ctx.restore();
}

function drawVignette(){
    const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);//center radius to edge

    vignette.addColorStop(0, 'rgba(0,0,0,0)'); //center is transparent
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)'); // subtle darkening

    ctx.save();
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

}

function glow(){
    t+= 0.03;
    umbrellaRotation += 0.005; //rotate umbrella over time
    drawBaseLighting();
    drawGrid();
    drawUmbrella(canvas.width/2, canvas.height/2, 300, umbrellaRotation);
    drawVignette();
    requestAnimationFrame(glow);
}

glow();

//update dynamically when the window is resized
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});