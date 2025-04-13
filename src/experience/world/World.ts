import Environment from "./Environment";
import Galaxy from "./galaxy/Galaxy";

class World {
  environment: Environment;
  galaxy: Galaxy;

  constructor() {
    this.environment = new Environment();
    this.galaxy = new Galaxy();
  }

  update() {
    this.galaxy.update();
  }

  dispose() {
    this.galaxy.dispose();
  }
}
export default World;
