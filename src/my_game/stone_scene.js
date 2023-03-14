"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
  constructor() {
    super();

    this.kBg = "assets/Rock_044_BaseColor.jpg";
    this.kBgNormal = "assets/Rock_044_Normal.jpg";
    this.kPlayer = "assets/Pebbles_028_BaseColor.jpg";
    this.kPlayerNormal = "assets/Pebbles_028_Normal.jpg";

    this.mCamera = null;
  }

  load() {
    engine.texture.load(this.kBg);
    engine.texture.load(this.kBgNormal);
    engine.texture.load(this.kPlayer);
    engine.texture.load(this.kPlayerNormal);
  }

  unload() {
    engine.texture.unload(this.kBg);
    engine.texture.unload(this.kBgNormal);
    engine.texture.unload(this.kPlayer);
    engine.texture.unload(this.kPlayerNormal);
  }

  init() {
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 40), // position of the camera
      75, // width of camera
      [0, 0, 640, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    // Light objects ------------------------------------------------------------------------------------
    this.lightSource = new engine.LightSource();
    this.lightSource.getXform().setPosition(50, 40, 5);
    this.lightSource.setColor([0.97, 0.76, 0.47, 1.0]);
    this.lightFlicker = new engine.Shake(0.07, 1, 450);

    this.blueLightSource = new engine.LightSource();
    this.blueLightSource.getXform().setPosition(50, 40, 5);
    this.blueLightSource.setColor([0.2, 0.5, 0.97, 1]);

    this.redLightSource = new engine.LightSource();
    this.redLightSource.getXform().setPosition(50, 40, 3);
    this.redLightSource.setColor([0.8, 0.1, 0.1, 1]);
    this.redLightBob = new engine.Oscillate(10, 10, 450);
    this.mRedLightAngle = 0;

    this.mLights = [
      this.lightSource,
      this.blueLightSource,
      this.redLightSource,
    ];

    this.mLights1 = [
      this.lightSource,
      // this.blueLightSource,
      // this.redLightSource,
    ];

    this.mLights2 = [this.redLightSource];

    // Renderables with normal map functionality ------------------------------------------
    this.bgR = new engine.NormalMapRenderable(
      this.kBg, // Texture
      this.kBgNormal, // Normal map
      // null, // Normal map
      this.mLights1
    );
    this.bgR.getXform().setSize(30, 30);
    this.bgR.getXform().setPosition(50, 40);

    this.mPlayer = new engine.NormalMapRenderable(
      this.kPlayer,
      this.kPlayerNormal,
      this.mLights1
    );
    this.mPlayer.getXform().setSize(100, 100);
    this.mPlayer.getXform().setPosition(50, 40);

    // Status messages ------------------------------------------------------------------------------------
    this.mMsg = new engine.FontRenderable("");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(50, 40);
    this.mMsg.setTextHeight(2);

    this.mMsg2 = new engine.FontRenderable("");
    this.mMsg2.setColor([1, 1, 1, 1]);
    this.mMsg2.getXform().setPosition(5, 5);
    this.mMsg2.setTextHeight(2);
  }

  draw() {
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    this.mPlayer.draw(this.mCamera);
    this.bgR.draw(this.mCamera);

    this.mMsg.draw(this.mCamera);
    this.mMsg2.draw(this.mCamera);
  }

  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    // red light movement ------------------------------------------------------------------------------------
    let kOrbitRadius = 15;
    let kRotSpeed = 100;
    let kRotSpeedRadians = (kRotSpeed * 2 * Math.PI) / 360 / 60;

    if (this.redLightBob.mNumCyclesLeft < this.redLightBob.mCycles / 1.4) {
      this.redLightBob.reStart();
    }
    this.redLightSource
      .getXform()
      .setPosition(
        50 + kOrbitRadius * Math.cos(this.mRedLightAngle),
        40 + kOrbitRadius * Math.sin(this.mRedLightAngle),
        3 + this.redLightBob.getNext()
      );
    this.mRedLightAngle += kRotSpeedRadians;

    this.lightSource.setIntensity(
      this.lightSource.getIntensity() + this.lightFlicker.getNext()
    );

    // yellow light intensity and movement ------------------------------------------------------------------------------------
    if (this.lightFlicker.mNumCyclesLeft < this.lightFlicker.mCycles / 1.4) {
      this.lightFlicker.reStart();
    }
    this.lightSource.setIntensity(
      this.lightSource.getIntensity() + this.lightFlicker.getNext()
    );

    this.lightSource
      .getXform()
      .setPosition(
        this.mCamera.mouseWCX(),
        this.mCamera.mouseWCY(),
        this.lightSource.getXform().getZPos()
      );

    // small renderable controls ------------------------------------------------------------------------------------
    if (engine.input.isKeyPressed(engine.input.keys.Up)) {
      this.bgR.getXform().incYPosBy(1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Down)) {
      this.bgR.getXform().incYPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Left)) {
      this.bgR.getXform().incXPosBy(-1);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Right)) {
      this.bgR.getXform().incXPosBy(1);
    }

    // blue light movement controls ------------------------------------------------------------------------------------
    if (engine.input.isKeyPressed(engine.input.keys.W)) {
      this.lightSource.getXform().incZPosBy(-0.5);

      if (this.lightSource.getXform().getZPos() <= 0)
        this.lightSource.getXform().setZPos(0);
    }
    if (engine.input.isKeyPressed(engine.input.keys.Q)) {
      this.lightSource.getXform().incZPosBy(0.5);
    }
    // if (engine.input.isKeyPressed(engine.input.keys.I))
    //   this.blueLightSource.getXform().incYPosBy(1);
    // if (engine.input.isKeyPressed(engine.input.keys.K))
    //   this.blueLightSource.getXform().incYPosBy(-1);
    // if (engine.input.isKeyPressed(engine.input.keys.J))
    //   this.blueLightSource.getXform().incXPosBy(-1);
    // if (engine.input.isKeyPressed(engine.input.keys.L))
    //   this.blueLightSource.getXform().incXPosBy(1);

    // blue light falloff controls ------------------------------------------------------------------------------------
    if (engine.input.isKeyPressed(engine.input.keys.F))
      this.lightSource.incFalloffBy([0.5, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.G))
      this.lightSource.incFalloffBy([0, 0.5]);
    if (engine.input.isKeyPressed(engine.input.keys.V))
      this.lightSource.incFalloffBy([-0.5, 0]);
    if (engine.input.isKeyPressed(engine.input.keys.B))
      this.lightSource.incFalloffBy([0, -0.5]);

    if (engine.input.isKeyPressed(engine.input.keys.T)) {
      this.mCamera.zoomBy(1.1);
      this.mCamera.update();
    }
    
    if (engine.input.isKeyPressed(engine.input.keys.Y)) {
      this.mCamera.zoomBy(0.9)
      this.mCamera.update();
    }
      
    // diffuse and specular toggles ------------------------------------------------------------------------------------
    if (engine.input.isKeyClicked(engine.input.keys.O))
      this.mLights.forEach((l) => {
        l.mHasDiffuse = !l.mHasDiffuse;
      });

    if (engine.input.isKeyClicked(engine.input.keys.P))
      this.mLights.forEach((l) => {
        l.mHasSpec = !l.mHasSpec;
      });

    // status messages ------------------------------------------------------------------------------------
    let lightPos = this.lightSource.getXform().getPosition();
    this.mMsg.setText("LightPos: " + lightPos);
    this.mMsg.getXform().setPosition(lightPos[0], lightPos[1]);

    this.mMsg2.setText("Light falloff: " + this.blueLightSource.getFalloff());
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
