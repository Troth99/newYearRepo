let canvas = document.getElementById('fireworks');
let ctx = canvas.getContext('2d');

const textElement = document.getElementById('text');
const wishElement = document.getElementById('wish')

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
        trail: [],
        sparks: [],
        headWith: 18,
        headHeigth: 30,
        bodyWith: 10,
        bodyHeight: 30,
        lifetime: Math.random() * 50 + 150,
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
                color: `hsl(${Math.random() * 360}, 100%, 70%)`,
                lifetime: 200
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
                    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                    lifetime: 150
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
                color: `hsl(${Math.random() * 360}, 100%, 80%)`,
                lifetime: 300
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
        
        let color;
        if (type === `bright`){
            color = `hsl(${Math.random() * 360}, 100%, 80%)`;
        }else if (type === `waterfall`){
            color = `hsl(${Math.random() * 360}, 50%, 60%)`;
        }else {
            color = `hsl(${Math.random() * 360}, 100%, ${Math.random() < 0.5 ? '60%' : '70%'})`;
        }
     

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + (type === 'waterfall' ? gravity: 0 ),
            alpha: 1,
            gravity: 0.05,
            color: color,
            lifetime: 200
        });
    }

    for (let i = 0; i < 30; i++){
        let angle = Math.random() * 2 * Math.PI;
        let speed = Math.random() * 1.5;
        particles.push({
            x:x,
            y:y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.5,
            alpha: 0.5,
            color: 'rgba(200, 200, 200, 0.5)'
        })
    }
}

function drawFirework(fw) {
    ctx.save()
    ctx.translate(fw.x , fw.y)

    ctx.rotate(Math.atan2(fw.speedY, fw.speedX) + Math.PI / 2)

    ctx.fillStyle = fw.color || 'white';

    ctx.globalAlpha = 1;

    ctx.fillRect(-fw.bodyWith / 2, -fw.bodyHeight, fw.bodyWith, fw.bodyHeight);

    ctx.beginPath();
    ctx.moveTo(-fw.headWith / 2, -fw.bodyHeight);
    ctx.lineTo(fw.headWith / 2, -fw.bodyHeight);
    ctx.lineTo(0, -fw.bodyHeight - fw.headHeigth);
    ctx.closePath();
    ctx.fill()

    for (let i = 0; i < fw.sparks.length; i++) {
        let p = fw.sparks[i];
        ctx.beginPath();
        ctx.arc(p.x - fw.x, p.y - fw.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
    }

 
    ctx.restore()
}

function updateParticles(){
  
    particles = particles.filter(p =>{
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;
    
        p.color = `hsl(${(360 - p.alpha * 360)}, 100%, 50%`;
        if (p.alpha > 0){
            ctx.beginPath();
            if (Math.random() < 0.5){
                ctx.rect(p.x -2, p.y -2, 4 ,4);
            }else {   ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            }
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill()
            return true;
        }
        return false;
    })
}


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

 
    for (let i = 0; i < fireworks.length; i++) {
        let fw = fireworks[i];
        
        fw.x += fw.speedX;
        fw.y += fw.speedY;

        fw.speedY += fw.gravity;

        if (fw.exploded){
            fw.trail = []
        }else {
            if(!fw.exploded){
                fw.trail.push({x: fw.x, y: fw.y, alpha: 1});
            }
        }

        if (Math.random() < 0.05){
            fw.sparks.push({
                x:fw.x,
                y:fw.y,
                vx:(Math.random() - 0.5) * 2,
                vy:(Math.random() - 0.5) * 2,
                alpha: 1,
            })
        }
        
        if(fw.trail.length > 10){
            fw.trail.shift()
        }
        if (!fw.exploded) {
            if (fw.x >= fw.targetX - 20 && fw.x <= fw.targetX + 20 && fw.y <= fw.targetY) {
                fw.exploded = true;
                let explosionTypes = ['default', 'bright', 'waterfall', 'complex'];
                let randomType = explosionTypes[Math.floor(Math.random() * explosionTypes.length)];
                explode(fw.x, fw.y, randomType);
            } else {
                drawFirework(fw);
            }
        }


        for (let i = 0; i < fw.sparks.length; i++){
            let p = fw.sparks[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.01


            if (p.alpha > 0){
                ctx.beginPath();
                ctx.arc(p.x - fw.x, p.y - fw.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
                ctx.fill();
            }else {
                fw.sparks.splice(i, 1);
                i--
            }
        }

        ctx.save()
        ctx.translate(fw.x, fw.y);
        ctx.globalAlpha = 0.5

        for (let i = 0; i < fw.trail.length; i++){
            let p = fw.trail[i];

            ctx.beginPath();
            ctx.arc(p.x - fw.x, p.y - fw.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(169, 169, 169, ${p.alpha})`
            ctx.globalAlpha = p.alpha;
            ctx.fill()
        }
        ctx.restore()
    }


    updateParticles();


    if (Math.random() < 0.04) { 
        createFirework(Math.random() < 0.5); 
    }

    requestAnimationFrame(update);
}

update();
