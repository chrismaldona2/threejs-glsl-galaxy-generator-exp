import GUI from "lil-gui";

class DebugGUI {
  instance: GUI;

  constructor() {
    this.instance = new GUI({ title: "Tweaks" });

    window.addEventListener("keydown", this.toggleHandler);
  }

  toggleHandler = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "h") {
      this.instance.show(this.instance._hidden);
    }
  };

  destroy() {
    window.removeEventListener("keydown", this.toggleHandler);
    this.instance.destroy();
  }
}

export default DebugGUI;
