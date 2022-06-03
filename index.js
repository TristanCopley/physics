let c = document.getElementById('canvas');
let ctx = c.getContext('2d');

let camera = {

    position: {

        x: 0,
        y: 0

    },

    zoom: 1,
    width: 0,
    height: 0,
    aspect: 0

}

camera.width = window.innerWidth / 2;
camera.height = window.innerHeight / 2;

c.width = window.innerWidth;
c.height = window.innerHeight;


refreshCamera();

window.addEventListener('resize', () => {

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    refreshCamera();

});

function rx(x) {

    return (x - camera.position.x) * camera.aspect * camera.zoom + camera.width;

}

function ry(y) {

    return (y - camera.position.y) * camera.aspect * camera.zoom + camera.height;

}

function refreshCamera() {

    camera.width = window.innerWidth / 2;
    camera.height = window.innerHeight / 2;

    camera.aspect = (camera.width / 1920) > (camera.height / 1080) ? camera.width / 1920 : camera.height / 1080;

}

let timesteps = 1;
let friction = 0.002 * (1/timesteps);
let gravity = -0.01;
let particles = [];
let boundryRadius = 800;

for(let i = 0; i < 1000; i++) {
    let rx = Math.random() * 600 - 300;
    let ry = Math.random() * 600 - 300;
    let rr = //Math.random() * 60 + 5;
    particles.push({
        posNew: [rx, ry],
        posOld: [rx + Math.random()*2-1, ry + Math.random()*2-1],
        radius: 10
    })
}

function renderTick(timeStamp = 0) {

    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = 'red';
    for(let t = 0; t < 4; t++) {

        for (let i = 0; i < timesteps; i++) {

            collideParticles();
            updateParticles();
            collideBounds();

        }

    }

    drawParticles();

    requestAnimationFrame( renderTick );

}

renderTick()

function collideParticles() {

    for(let a = 0; a < particles.length; a++){

        for(let b = a+1; b < particles.length; b++){

            let xDiff = particles[a].posNew[0] - particles[b].posNew[0];
            let yDiff = particles[a].posNew[1] - particles[b].posNew[1];

            if((xDiff)**2 + (yDiff)**2 < (particles[a].radius + particles[b].radius)**2) {

                let scalar = Math.sqrt(xDiff**2 + yDiff**2);
                let dir = Math.atan2(yDiff, xDiff);
                let distDelta = (scalar - particles[a].radius - particles[b].radius) * (1/timesteps)**2;

                particles[a].posNew[0] -= Math.cos(dir) * distDelta * 0.5;
                particles[a].posNew[1] -= Math.sin(dir) * distDelta * 0.5;
                particles[b].posNew[0] += Math.cos(dir) * distDelta * 0.5;
                particles[b].posNew[1] += Math.sin(dir) * distDelta * 0.5;

            }

        }

    }

}

function collideBounds() {

    for(let particle of particles) {

        if(particle.posNew[0]**2 + particle.posNew[1]**2 > (boundryRadius - particle.radius)**2) {

            let scalar = (boundryRadius - particle.radius) / Math.sqrt(particle.posNew[0]**2 + particle.posNew[1]**2) || 1;

            particle.posNew[0] *= scalar;
            particle.posNew[1] *= scalar;

        }

    }

}

function updateParticles() {

    for(let particle of particles) {

        particle.posNew[1] -= gravity * (1/timesteps ** 2);

        let tempOld = particle.posNew[0];
        particle.posNew[0] = (2 - friction) * particle.posNew[0] - (1 - friction) * particle.posOld[0];
        particle.posOld[0] = tempOld;
        tempOld = particle.posNew[1];
        particle.posNew[1] = (2 - friction) * particle.posNew[1] - (1 - friction) * particle.posOld[1];
        particle.posOld[1] = tempOld;

    }

}

function drawParticles() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(rx(0), ry(0), boundryRadius* camera.aspect * camera.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'red';

    for(let particle of particles) {

        ctx.beginPath();
        ctx.arc(rx(particle.posNew[0]), ry(particle.posNew[1]), particle.radius* camera.aspect * camera.zoom, 0, Math.PI * 2);
        ctx.fill();

    }

}