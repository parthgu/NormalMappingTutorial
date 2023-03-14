"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
  constructor() {
    super();

    this.kBg = "assets/Rock_044_BaseColor.jpg";
    this.kBgNormal = "assets/Rock_044_Normal.jpg";

    this.mCamera = null;
  }

  load() {
    engine.texture.load(this.kBg);
    engine.texture.load(this.kBgNormal);
  }

  unload() {
    engine.texture.unload(this.kBg);
    engine.texture.unload(this.kBgNormal);
  }

  init() {
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 50), // position of the camera
      100, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mRedLightSource = new engine.LightSource();
    this.mRedLightSource.getXform().setPosition(20, 80, 5);
    this.mRedLightSource.setColor([1, 0, 0, 1.0]);

    this.mGreenLightSource = new engine.LightSource();
    this.mGreenLightSource.getXform().setPosition(80, 80, 5);
    this.mGreenLightSource.setColor([0, 1, 0, 1]);

    this.mBlueLightSource = new engine.LightSource();
    this.mBlueLightSource.getXform().setPosition(50, 20, 5);
    this.mBlueLightSource.setColor([0, 0, 1, 1]);

    this.mLightSet = [
      this.mRedLightSource,
      this.mGreenLightSource,
      this.mBlueLightSource,
    ];

    this.mBackground = new engine.NormalMapRenderable(
      this.kBg, // Texture
      this.kBgNormal, // Normal map
      this.mLightSet // LightSource array
    );
    this.mBackground.getXform().setSize(100, 100);
    this.mBackground.getXform().setPosition(50, 40);

    this.mCamera.setAmbientIntensity(0.25);
  }

  draw() {
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    this.mBackground.draw(this.mCamera);
  }

  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      this.mGreenLightSource.getXform().incYPosBy(1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      this.mGreenLightSource.getXform().incYPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      this.mGreenLightSource.getXform().incXPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      this.mGreenLightSource.getXform().incXPosBy(1);
    }

    if (engine.input.isKeyClicked(engine.input.keys.L)) {
      this.mRedLightSource.toggle();
    }

    if (engine.input.isKeyPressed(engine.input.keys.F))
      this.mBlueLightSource.incFalloffBy([0.5, 0]);

    if (engine.input.isKeyPressed(engine.input.keys.G))
      this.mBlueLightSource.incFalloffBy([0, 0.5]);

    if (engine.input.isKeyPressed(engine.input.keys.V))
      this.mBlueLightSource.incFalloffBy([-0.5, 0]);

    if (engine.input.isKeyPressed(engine.input.keys.B))
      this.mBlueLightSource.incFalloffBy([0, -0.5]);
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
