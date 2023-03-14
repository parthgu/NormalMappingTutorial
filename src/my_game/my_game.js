"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
  constructor() {
    super();
    this.kBg = "assets/bg.png";
    this.kBgNormal = "assets/bg_normal.png";

    // The camera to view the scene
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
    // Step A: set up the cameras
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 40), // position of the camera
      100, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    // sets the background to gray

    this.lightSource = new engine.LightSource();
    this.lightSource.getXform().setPosition(50, 40, 1);

    // Large background image
    this.bgR = new engine.NormalMapRenderable(
      this.kBg,
      this.kBgNormal,
      this.lightSource
    );
    this.bgR.getXform().setSize(100, 100);
    this.bgR.getXform().setPosition(50, 40);
    
    this.mMsg = new engine.FontRenderable("");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(50, 40);
    this.mMsg.setTextHeight(3);
    
    this.mMsg2 = new engine.FontRenderable("");
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(5, 5);
    this.mMsg2.setTextHeight(3);
  }

  //   _drawCamera(camera) {
  //     camera.setViewAndCameraMatrix();
  //     this.mBg.draw(camera);
  //   }

  // This is the draw function, make sure to setup proper drawing environment, and more
  // importantly, make sure to _NOT_ change any state.
  draw() {
    // Step A: clear the canvas
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    // Step  B: Draw with all three cameras
    this.bgR.draw(this.mCamera);
    
    this.mMsg.draw(this.mCamera);
    this.mMsg2.draw(this.mCamera);
  }
  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    // light y pos
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      this.lightSource.getXform().incYPosBy(1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      this.lightSource.getXform().incYPosBy(-1);
    }
    
    // light x pos
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      this.lightSource.getXform().incXPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      this.lightSource.getXform().incXPosBy(1);
    }
    
    // light Z pos
    if (engine.input.isKeyPressed(engine.input.keys.W)) {
      this.lightSource.getXform().incZPosBy(-0.5);
      
      if (this.lightSource.getXform().getZPos() < 0)
        this.lightSource.getXform().setZPos(0);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Q)) {
      this.lightSource.getXform().incZPosBy(0.5);
    }
    
    // light intensity
    if (engine.input.isKeyPressed(engine.input.keys.L)) {
      this.lightSource.IncIntensityBy(-0.05);
    }
    if (engine.input.isKeyPressed(engine.input.keys.K)) {
      this.lightSource.IncIntensityBy(0.05);
    }

    // falloff controls
    if (engine.input.isKeyPressed(engine.input.keys.F))
      this.lightSource.incFalloffBy([0.01, 0, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.G))
      this.lightSource.incFalloffBy([0, 0.01, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.H))
      this.lightSource.incFalloffBy([0, 0, 0.01]);
    if (engine.input.isKeyPressed(engine.input.keys.V))
      this.lightSource.incFalloffBy([-0.01, 0, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.B))
      this.lightSource.incFalloffBy([0, -0.01, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.N))
    this.lightSource.incFalloffBy([0, 0, -0.01]);
    
    // diffuse and specular toggles
    if (engine.input.isKeyClicked(engine.input.keys.O))
      this.lightSource.mHasDiffuse = !this.lightSource.mHasDiffuse;
    if (engine.input.isKeyClicked(engine.input.keys.P))
      this.lightSource.mHasSpec = !this.lightSource.mHasSpec;
    
    // status message
    let lightPos =  this.lightSource.getXform().getPosition();
    this.mMsg.setText("LightPos: " + lightPos);
    this.mMsg.getXform().setPosition(
      lightPos[0],
      lightPos[1]
    );

    this.mMsg2.setText("Light falloff: " + this.lightSource.getFalloff());
  }

}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
