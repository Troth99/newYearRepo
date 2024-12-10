let canvas = document.getElementById('fireworks');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let particles = [];

const treeBaseY = 500;

function createFirework(itSelf) {

    let x = itSelf ? 0 : canvas.width
    let targetX = canvas.width / 2;
    let targetY = canvas.height / 3;

    let initialSpeedY = -8;
    let gravity = 0.1;

    let angle = Math.atan2(targetY - canvas.height, targetX - x);

    let speedX = (targetX - x) / 100
    let speedY = initialSpeedY;

    let firework = {
        x: x,
        y: canvas.height - 400,
        targetX: targetX,
        targetY: targetY,
        speedX: speedX,
        speedY: speedY,
        gravity: gravity,
        exploded: false,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        angle: angle,
        headWith: 12,
        headHeigth: 25,
        bodyWith: 6,
        bodyHeight: 20,
    };
    fireworks.push(firework);
}


function explode(x, y) {
    for (let i = 0; i < 50; i++) {
        let angle = Math.random() * 2 * Math.PI;
        let speed = Math.random() * 4 + 2;
        let color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color
        });
    }
}

function drawFirework(fw) {
    ctx.save()
    ctx.translate(fw.x , fw.y)

    ctx.rotate(Math.atan2(fw.speedY, fw.speedX) + Math.PI / 2)

    ctx.fillStyle = fw.color || 'white';

    ctx.fillRect(-fw.bodyWith / 2, -fw.bodyHeight, fw.bodyWith, fw.bodyHeight);

    ctx.beginPath();
    ctx.moveTo(-fw.headWith / 2, -fw.bodyHeight);
    ctx.lineTo(fw.headWith / 2, -fw.bodyHeight);
    ctx.lineTo(0, -fw.bodyHeight - fw.headHeigth);
    ctx.closePath();
    ctx.fill()

    ctx.restore()
}
function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < fireworks.length; i++) {
        let fw = fireworks[i];

        fw.x += fw.speedX;
        fw.y += fw.speedY;

        fw.speedY += fw.gravity;

        if (!fw.exploded) {

            if (fw.x >= fw.targetX - 5 && fw.x <= fw.targetX + 5 && fw.y <= fw.targetY) {
                fw.exploded = true;
                explode(fw.x, fw.y);
            } else {
                drawFirework(fw)
            }
        }
    }


    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        } else {
            particles.splice(i, 1);
            i--;
        }
    }

    if (Math.random() < 0.05) { 
        createFirework(Math.random() < 0.5); 
    }
    requestAnimationFrame(update);
}

update();
