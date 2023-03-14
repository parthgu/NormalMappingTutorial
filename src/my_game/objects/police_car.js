"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class PoliceCar extends engine.GameObject {
  constructor(texture, normalMapTexture, lightSources) {
    super(null);
    this.kDeltaDegree = 1;
    this.kDeltaRad = (Math.PI * this.kDeltaDegree) / 180;
    this.kDeltaSpeed = 0.3;
    this.mRenderComponent = new engine.NormalMapRenderable(
      texture,
      normalMapTexture,
      lightSources
    );
    this.mRenderComponent.setColor([1, 1, 1, 0]);
    this.mRenderComponent.getXform().setPosition(75, 25);
    this.mRenderComponent.getXform().setSize(10, 15);

    this.setSpeed(0.15);
  }

  update() {
    super.update();
  }
}

export default PoliceCar;
