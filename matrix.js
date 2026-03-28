const canvas= document.getElementById('Matrix');
const ctx= canvas.getContext('2d');

canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

const letters= 'アァイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤャユュヨョラリルレロワヲン';
let fontSize= 14;
let columns= Math.floor(canvas.width / fontSize);
let drops= Array(columns).fill(1);

function draw() {
    ctx.fillStyle= 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle= '#0F0';
    ctx.font= fontSize + 'px monospace';

    for (let i= 0; i < drops.length; i++) {
        const text= letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i]= 0;
        }
        
        drops[i]++;
    }
}

setInterval(draw, 33);

window.addEventListener('resize', () => {
    canvas.width= window.innerWidth;
    canvas.height= window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
    drops= Array(columns).fill(0);
});