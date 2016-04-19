import * as utils from './utils'

export default function confetti(canvas, numberOfPieces = 20, friction = 0.99, wind = 0, gravity = 0.1) {

  var context = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  let colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548'
  ];

  let generator1 = new particleGenerator(0, 0, W, 0, numberOfPieces);

  function loadImage(url) {
    var img = document.createElement("img");
    img.src = url;
    return img;
  }

  var mouse = {
    x: 0,
    y: 0
  };
  canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  }, false);

  function particle(x, y) {
    this.radius = utils.randomRange(.1, 1);
    this.x = x;
    this.y = y;
    this.vx = utils.randomRange(-4, 4);
    this.vy = utils.randomRange(-10, -0);
    this.type = utils.randomInt(0,1);

    this.w = utils.randomRange(5, 20);
    this.h = utils.randomRange(5, 20);

    this.r = utils.randomRange(5, 10);

    this.angle = utils.degreesToRads(utils.randomRange(0, 360));
    this.anglespin = utils.randomRange(-0.2, 0.2);
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.rotateY = utils.randomRange(0, 1);

  }

  particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    this.vx += wind;
    this.vx *= friction;
    this.vy *= friction;
    this.radius -= .02;

    if (this.rotateY < 1) {
      this.rotateY += 0.1;

    } else {
      this.rotateY = -1;

    }
    this.angle += this.anglespin;

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);

    context.scale(1, this.rotateY);

    context.rotate(this.angle);
    context.beginPath();
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.lineCap="round";
    context.lineWidth = 2;

    if (this.type === 0) {
      context.beginPath();
      context.arc(0, 0, this.r, 0, 2 * Math.PI);
      context.fill();
    }else if(this.type === 2){
      context.beginPath();
      for (i = 0; i < 22; i++) {
        angle = 0.5 * i;
        x = (.2 + 1.5 * angle) * Math.cos(angle);
        y =(.2 + 1.5 * angle) * Math.sin(angle);

        context.lineTo(x, y);
      }
      context.stroke();

    }else if(this.type === 1){
      context.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }

    context.closePath();
    context.restore();


  }

  function particleGenerator(x, y, w, h, number, text) {
    // particle will spawn in this aera
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.number = number;
    this.particles = [];
    this.text = text;
    this.recycle = true;

    this.type=1;

  }
  particleGenerator.prototype.animate = function() {

    context.fillStyle = "grey";

    context.beginPath();
    context.strokeRect(this.x, this.y, this.w, this.h);

    context.font = "13px arial";
    context.textAlign = "center";

    context.closePath();
    //	   for (var i = 0; i < 100; i++) {

    if (this.particles.length < this.number) {
      this.particles.push(new particle(utils.clamp(utils.randomRange(this.x, this.w + this.x), this.x, this.w + this.x),

                                       utils.clamp(utils.randomRange(this.y, this.h + this.y), this.y, this.h + this.y), this.text));
    }

    if (this.particles.length > this.number) {
      this.particles.length = this.number;
    }

    for (var i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.update();
      if (p.y > H || p.y < -100 || p.x > W+100 || p.x < -100&& this.recycle) {
        //a brand new particle replacing the dead one
        this.particles[i] = new particle(utils.clamp(utils.randomRange(this.x, this.w + this.x), this.x, this.w + this.x),

                                         utils.clamp(utils.randomRange(this.y, this.h + this.y), this.y, this.h + this.y), this.text);
      }
    }
  }
  toggleEngine();

  function toggleEngine(){
    if(generator1.type ===0){
      generator1.type =1;
      generator1.x =W/2;
      generator1.y =H/2;
      generator1.w =0;

    }else{
      generator1.type =0;
      generator1.x =1;
      generator1.w =W;
      generator1.y =0;

    }

  }

  update();

  function update() {
    generator1.number = numberOfPieces;

    // context.globalAlpha=.5;
    context.fillStyle="white";    context.clearRect(0, 0, W, H);
    generator1.animate();
    requestAnimationFrame(update);

  }
}
