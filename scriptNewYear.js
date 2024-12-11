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


function explode(x, y, type = 'default') {

    let count = 50;
    let gravity = 0.1;
    let speedBase = 2;

    if (type === 'complex'){

        for (let i = 0; i < 50; i++){
            let angle = Math.random() * 2 * Math.PI;
            let speed = Math.random() * 3 + 2;
            particles.push({
                x:x,
                y:y,
                vx: Math.cos(angle) * speed,
                vy:Math.sin(angle) * speed,
                alpha:1,
                color: `hsl(${Math.random() * 360}, 100%, 70%)`
            })
        }

        for (let i = 0; i < 10; i++){
            let angle = (i / 10) * Math.PI;
            for (let j =0; j <5; j++){
                let speed = 4 +j * 0.5;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1 - j * 0.2, 
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`
                })
            }
        }

        for (let i = 0; i< 30; i++){
            let angle = Math.random() * 2 * Math.PI;
            let speed = Math.random() * 2;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed + 1,
                alpha: Math.random() * 0.5 + 0.5,
                color: `hsl(${Math.random() * 360}, 100%, 80%)`
            });
        }
    }

    if (type === `bright`){
        count = 100;
        speedBase = 4;
    }else if (type === `waterfall`){
        gravity = 0.5;
        speedBase = 1;
    }

    for (let i = 0; i < 100; i++) {
        let angle = Math.random() * 2 * Math.PI;
        let speed = Math.random() * speedBase + 1;

        let color = `hsl(${Math.random() * 360}, 100%, ${type === 'bright' ? '80%' : '60%'})`;

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + (type === 'waterfall' ? gravity: 0 ),
            alpha: 1,
            gravity: gravity,
            color: color,
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
                
                let explosionTypes = ['default', 'bright', 'waterfall', 'complex'];
                let randomType = explosionTypes[Math.floor(Math.random() * explosionTypes.length)]
                explode(fw.x, fw.y, randomType);
            } else {
                drawFirework(fw)
            }
        }
    }
particles = particles.filter(p =>{
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.01;

    if (p.alpha > 0){
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill()
        return true;
    }
    return false;
})
ctx.globalAlpha = 1


    if (Math.random() < 0.05) { 
        createFirework(Math.random() < 0.5); 
    }
    requestAnimationFrame(update);
}

update();
