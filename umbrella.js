const canvas = document.getElementById("Umbrella");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t=0;

function drawGlow() {
    const pulse = (Math.sin(t) +1)/2; // 0 to 1

    //backgorund
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //global red wash
    ctx.fillStyle = "rgba(255,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //const radius = 200 + pulse * 100; // 200 to 300

    //dynamic center
    const cx = canvas.width/2 + Math.sin(t*0.5)*100; // oscillate horizontally
    const cy = canvas.height/2 + Math.cos(t*0.3)*60; // oscillate vertically

    const maxRadius = Math.max(canvas.width, canvas.height);
    const radius = maxRadius * (.6 + pulse+.4);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

    gradient.addColorStop(0, `rgba(255,0,0,${.6 + pulse * .4})`);
    gradient.addColorStop(1, 'rgba(255,0,0,0.1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

drawGlow();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawGlow();
});