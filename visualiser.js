// function main() {
const canvas2 = document.getElementById("canvas2");
let ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

class Bar {
  constructor(x, y, width, height, color, index) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.index = index;
  }
  // micInput
  update(micInput) {
    const sound = micInput * 700;
    if (sound > this.height) {
      this.height = sound;
    } else {
      this.height -= this.height * 0.03;
    }
    //   this.height = micInput * 1000;
  }

  draw(context, volume) {
    context.strokeStyle = this.color;

    context.save();
    context.translate(-160, 0);
    context.rotate(-1.57);
    context.scale(1 + volume * 0.001, 1 + volume * 0.001);
    context.beginPath();

    context.bezierCurveTo(-200, -200, this.x, this.height, this.height, this.y);
    context.stroke();
    //   context.rotate(this.index * 0.02);
    // context.strokeRect(this.y + this.index * 1.5, this.height, this.height / 2, this.height);
    context.beginPath();
    context.arc(this.x, this.y, this.height, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
}

const fftSize = 256;

const microphone = new Microphone(fftSize);
let bars = [];
let barWidth = canvas2.width / (fftSize / 2);
function createBars() {
  for (let i = 0; i < fftSize / 2; i++) {
    let color = "hsl(" + i * 2 + ", 100%, 50%)";
    bars.push(new Bar(0, i * 1.5, 5, 50, color, i));
  }
}
createBars();
console.log(bars);

let angle = 0;
function animate() {
  if (microphone.initialized) {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    const samples = microphone.getSamples();
    const volume = microphone.getVolume();
    //   console.log(samples)
    angle += 0.001;
    ctx2.save();
    ctx2.translate(canvas2.width / 2, canvas2.height / 2);
    //   ctx2.rotate(angle);
    bars.forEach(function (bar, i) {
      bar.update(samples[i]);
      bar.draw(ctx2, volume);
    });
    ctx2.restore();
  }
  requestAnimationFrame(animate);
}
animate();
// }
