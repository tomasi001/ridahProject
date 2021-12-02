// reference canvas
const canvas = document.getElementById("canvas1");

// reference context
const ctx = canvas.getContext("2d");

// define width and height
canvas.width = 1280;
canvas.height = 800;

// define counter
let i = 2;

// create and load first Image
const myImage = new Image();
myImage.src = "./img/img1.jpg";

// create animation frame reference
let myReq;

// create function which changes
setInterval(function () {
  if (i < 7) {
    cancelAnimationFrame(myReq);
    myImage.src = "./img/img" + i + ".jpg";
    i++;
  } else {
    i = 1;
  }
}, 40000);

// create on load function for when image loads
myImage.addEventListener("load", function () {
  ctx.globalAlpha = 1;

  //   draw image stored in my Image
  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);

  //   get Image data
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //   clear image
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // create particle storage and number
  let particleArray = [];
  const numberOfParticles = 5000;

  // create array to store mapped image information
  let mappedImage = [];

  // iterate through image data
  // extract rgb values and brightness
  // add them to MappedImage array
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[y * 4 * pixels.width + x * 4];
      const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
      const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
      const brightness = calculateRelativeBrightness(red, green, blue);
      const cell = [
        (cellBrightness = brightness - 1),
        (cellColour = `rgb(${red + (i + 13) * 5},${green - (i + 2) * 5},${
          blue - (i + 2) * 5
        })`),
      ];
      row.push(cell);
    }
    mappedImage.push(row);
  }

  //   calculate relative brightness for human perception
  function calculateRelativeBrightness(red, green, blue) {
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  }

  //   create particle class
  class Particle {
    // create constructor values
    // to determine initial state of particles
    constructor() {
      // initial coordinates
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);

      //  initial speed and velocity
      this.speed = 0;
      this.velocity = Math.random() * 0.5;

      //   initial size
      this.size = Math.random() * 1.5 + 1;

      //   initial angle
      this.angle = 0;
    }

    // create update function
    // to update state of particles
    update() {
      //   updated position
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);

      //   make sure the referenced index is not out of bounds
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        this.speed = mappedImage[this.position1][this.position2][0];
      }

      //   changes how quickly the particels move
      let movement = 2.5 - (this.speed + 1.1) * this.velocity;

      //   changes how quickly the particles spin
      this.angle += Math.random() * 0.08 * this.speed;

      //   adjust these values to change direction of fall
      this.y += movement * Math.sin(this.angle);
      this.x += movement * Math.cos(this.angle);

      //   reset particle position if they leave the canvas
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
      if (this.y <= 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }

      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
      if (this.x <= 0) {
        this.x = canvas.width;
        this.y = Math.random() * canvas.height;
      }
    }

    // create draw function
    // to draw rectangles
    draw() {
      // use random to determine fill style
      let chance = Math.random();
      ctx.beginPath();
      if (chance <= 0.99) {
        //   make sure the referenced index is not out of bounds
        if (
          mappedImage[this.position1] &&
          mappedImage[this.position1][this.position2]
        ) {
          ctx.fillStyle = mappedImage[this.position1][this.position2][1];
        }
      }
      if (chance > 0.99) {
        ctx.fillStyle = "white";
      }
      ctx.rect(this.x, this.y, this.size * 2, this.size * 2);
      ctx.fill();
    }
  }

  //   create funciton to initialise particles
  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particle());
    }
  }
  init();

  //  create function to animate particles
  function animate() {
    // set global alpha
    // set color
    // draw black rectangle
    // this creates dissappearing trail effect
    ctx.globalAlpha = 0.01;
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // call draw and update methods
    // change the global alpha dependant on speed
    // before each draw
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
      ctx.globalAlpha = (particleArray[i].speed + 1.1) * 0.5;
      particleArray[i].draw();
    }
    // call animation loop
    myReq = requestAnimationFrame(animate);
  }
  animate();
});
