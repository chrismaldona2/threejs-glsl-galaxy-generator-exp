// @ts-nocheck
import Experience from "../Experience";

class FullscreenHandler {
  private readonly experience: Experience;
  canvas: HTMLCanvasElement;

  constructor() {
    this.experience = Experience.getInstance();
    this.canvas = this.experience.canvas.domElement;

    window.addEventListener("keydown", this.toggleFullscreenHandler);
    window.addEventListener("dblclick", this.toggleFullscreenHandler);
  }

  goFullscreen = () => {
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen();
    } else if (this.canvas.webkitRequestFullscreen) {
      this.canvas.webkitRequestFullscreen();
    } else if (this.canvas.mozRequestFullscreen) {
      this.canvas.mozRequestFullscreen();
    } else if (this.canvas.msRequestFullscreen) {
      this.canvas.msRequestFullscreen();
    }
  };

  exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozExitFullscreen) {
      document.mozExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  toggleFullscreen() {
    const hasFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.msFullscreenElement;

    if (hasFullscreen) {
      this.exitFullscreen();
    } else {
      this.goFullscreen();
    }
  }

  private toggleFullscreenHandler = (e: Event) => {
    if (e instanceof KeyboardEvent) {
      if (e.key.toLowerCase() === "f") {
        this.toggleFullscreen();
      }
    } else if (e instanceof MouseEvent) {
      this.toggleFullscreen();
    }
  };

  dispose() {
    window.removeEventListener("keydown", this.toggleFullscreenHandler);
    window.removeEventListener("dblclick", this.toggleFullscreenHandler);
  }
}

export default FullscreenHandler;
