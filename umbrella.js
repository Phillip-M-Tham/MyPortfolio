const canvas = document.getElementById("Umbrella");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t=0;

function drawGlow() {
    const pulse = (Math.sin(t) +1)/2; // 0 to 1
    const radius = 200 + pulse * 100; // 200 to 300

    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, radius);

    gradient.addColorStop(0, `rgba(255,0,0,${.6 + pulse * .4})`);
    gradient.addColorStop(1, 'rgba(255,0,0,0)');

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

drawGlow();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawGlow();
});