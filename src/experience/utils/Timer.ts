import { Timer as TTimer } from "three/examples/jsm/Addons.js";
import EventEmitter from "./EventEmitter";

class Timer extends EventEmitter {
  instance: TTimer;
  elapsedTime: number;
  deltaTime: number;

  constructor() {
    super();

    this.instance = new TTimer();
    this.elapsedTime = this.instance.getElapsed();
    this.deltaTime = this.instance.getDelta();

    window.requestAnimationFrame(this.update);
  }

  update = () => {
    if (this.instance) {
      this.trigger("tick");
      this.instance.update();
      this.elapsedTime = this.instance.getElapsed();
      this.deltaTime = this.instance.getDelta();
    }
    window.requestAnimationFrame(this.update);
  };

  reset() {
    this.instance.dispose();
    this.instance = new TTimer();
    this.elapsedTime = 0;
    this.deltaTime = 0;
  }

  dispose() {
    this.off("tick");
    this.deltaTime = 0;
    this.elapsedTime = 0;
    this.instance.dispose();
  }
}

export default Timer;
