"use strict"; // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import PoliceCar from "./objects/police_car.js";

class MyGame extends engine.Scene {
  constructor() {
    super();

    this.kBg = "assets/road_with_roadside_and_lanes_24_04_diffuse.jpg";
    this.kBgNormal = "assets/road_with_roadside_and_lanes_24_04_normal.jpg";

    this.kRobberFacingLeft = "assets/Robber-Thief.png";
    this.kRobberFacingRight = "assets/Robber-Thief-Flipped.png";
    this.kPoliceCar = "assets/police-car.png";
    this.kStreetLamp = "assets/streetlamp.png";
    this.mCamera = null;
  }

  load() {
    engine.texture.load(this.kBg);
    engine.texture.load(this.kBgNormal);
    engine.texture.load(this.kRobberFacingLeft);
    engine.texture.load(this.kRobberFacingRight);
    engine.texture.load(this.kStreetLamp);
    engine.texture.load(this.kPoliceCar);
  }

  unload() {
    engine.texture.unload(this.kBg);
    engine.texture.unload(this.kBgNormal);
    engine.texture.unload(this.kRobberFacingLeft);
    engine.texture.unload(this.kRobberFacingRight);
    engine.texture.unload(this.kStreetLamp);
    engine.texture.unoad(this.kPoliceCar);
  }

  init() {
    this.mCamera = new engine.Camera(
      vec2.fromValues(50, 25), // position of the camera
      100, // width of camera
      [0, 0, 960, 480] // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

    this.mStreetLight1 = new engine.LightSource();
    this.mStreetLight1.getXform().setPosition(10, 15, 10);
    this.mStreetLight1.setColor([1.0, 0.68, 0.26, 1]);

    this.mStreetLight2 = new engine.LightSource();
    this.mStreetLight2.getXform().setPosition(35, 35, 10);
    this.mStreetLight2.setColor([1.0, 0.68, 0.26, 1]);
    this.mStreetLight2.setFalloff([10, 10]);

    this.mStreetLight3 = new engine.LightSource();
    this.mStreetLight3.getXform().setPosition(60, 15, 10);
    this.mStreetLight3.setColor([1.0, 0.68, 0.26, 1]);
    this.mStreetLight3.setFalloff([8, 8]);

    this.mStreetLight4 = new engine.LightSource();
    this.mStreetLight4.getXform().setPosition(85, 37, 10);
    this.mStreetLight4.setColor([1.0, 0.68, 0.26, 1]);

    this.mStreetLightSet = [
      this.mStreetLight1,
      this.mStreetLight2,
      this.mStreetLight3,
      this.mStreetLight4,
    ];

    this.mRedLight = new engine.LightSource();
    this.mRedLight.getXform().setPosition(50, 25, 10);
    this.mRedLight.setColor([1, 0, 0, 1]);
    this.mRedLight.setFalloff([10, 10]);
    this.mRedLight.toggle();

    this.mBlueLight = new engine.LightSource();
    this.mBlueLight.getXform().setPosition(50, 25, 10);
    this.mBlueLight.setColor([0, 0.1, 1, 1]);
    this.mBlueLight.setFalloff([10, 10]);

    this.mStartTime = performance.now();

    this.mLightSet = [
      this.mStreetLight1,
      this.mStreetLight2,
      this.mStreetLight3,
      this.mStreetLight4,
      this.mRedLight,
      this.mBlueLight,
    ];

    this.mBackground = new engine.NormalMapRenderable(
      this.kBg, // Texture
      this.kBgNormal, // Normal map
      this.mLightSet // LightSource array
    );
    this.mBackground.getXform().setSize(100, 50);
    this.mBackground.getXform().setPosition(50, 25);

    this.mStreetLamp1 = new engine.NormalMapRenderable(this.kStreetLamp, null, [
      this.mStreetLight1,
    ]);
    this.mStreetLamp1.getXform().setSize(10, 5);
    this.mStreetLamp1.getXform().setPosition(10, 12);
    this.mStreetLamp1.getXform().incRotationByDegree(90);

    this.mStreetLamp2 = new engine.NormalMapRenderable(this.kStreetLamp, null, [
      this.mStreetLight2,
    ]);
    this.mStreetLamp2.getXform().setSize(10, 5);
    this.mStreetLamp2.getXform().setPosition(35, 38);
    this.mStreetLamp2.getXform().incRotationByDegree(-90);

    this.mStreetLamp3 = new engine.NormalMapRenderable(this.kStreetLamp, null, [
      this.mStreetLight3,
    ]);
    this.mStreetLamp3.getXform().setSize(10, 5);
    this.mStreetLamp3.getXform().setPosition(60, 12);
    this.mStreetLamp3.getXform().incRotationByDegree(90);

    this.mStreetLamp4 = new engine.NormalMapRenderable(this.kStreetLamp, null, [
      this.mStreetLight4,
    ]);
    this.mStreetLamp4.getXform().setSize(10, 5);
    this.mStreetLamp4.getXform().setPosition(85, 38);
    this.mStreetLamp4.getXform().incRotationByDegree(-90);

    this.mRobber = new engine.NormalMapRenderable(
      this.kRobberFacingLeft,
      null,
      this.mLightSet
    );
    this.mRobber.getXform().setSize(8, 8);
    this.mRobber.getXform().setPosition(10, 25);

    this.mRobberFacingLeft = true;

    this.mPoliceCar = new PoliceCar(this.kPoliceCar, null, this.mLightSet);

    this.mCamera.setAmbientIntensity(0.175);

    this.lightFlicker1 = new engine.Shake(0.5, 10, 450);
    this.lightFlicker2 = new engine.Shake(0.5, 8, 300);
    this.lightFlicker2 = new engine.Shake(0.5, 10, 100);
  }

  draw() {
    engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setViewAndCameraMatrix();

    this.mBackground.draw(this.mCamera);
    this.mRobber.draw(this.mCamera);
    this.mPoliceCar.draw(this.mCamera);
    this.mStreetLamp1.draw(this.mCamera);
    this.mStreetLamp2.draw(this.mCamera);
    this.mStreetLamp3.draw(this.mCamera);
    this.mStreetLamp4.draw(this.mCamera);
  }

  // The update function, updates the application state. Make sure to _NOT_ draw
  // anything from this function!
  update() {
    if (performance.now() - this.mStartTime > 750) {
      this.mRedLight.toggle();
      this.mBlueLight.toggle();
      this.mStartTime = performance.now();
    }
    let rate = 1;
    this.mPoliceCar.rotateObjPointTo(
      this.mRobber.getXform().getPosition(),
      rate
    );
    this.mPoliceCar.update();

    if (this.lightFlicker1.mNumCyclesLeft < this.lightFlicker1.mCycles / 1.4) {
      this.lightFlicker.reStart();
    }
    if (this.lightFlicker2.mNumCyclesLeft < this.lightFlicker2.mCycles / 1.4) {
      this.lightFlicker2.reStart();
    }
    this.mStreetLight1.setIntensity(
      this.mStreetLight1.getIntensity() + this.lightFlicker2.getNext()
    );
    this.mStreetLight4.setIntensity(
      this.mStreetLight4.getIntensity() + this.lightFlicker2.getNext()
    );

    if (engine.input.isKeyPressed(engine.input.keys.W)) {
      this.mRobber.getXform().incYPosBy(0.25);
    }
    if (engine.input.isKeyPressed(engine.input.keys.S)) {
      this.mRobber.getXform().incYPosBy(-0.25);
    }
    if (engine.input.isKeyPressed(engine.input.keys.D)) {
      if (this.mRobberFacingLeft) {
        this.mRobberFacingLeft = false;
        this.mRobber.setTexture(this.kRobberFacingRight);
      }
      this.mRobber.getXform().incXPosBy(0.25);
    }
    if (engine.input.isKeyPressed(engine.input.keys.A)) {
      if (!this.mRobberFacingLeft) {
        this.mRobberFacingLeft = true;
        this.mRobber.setTexture(this.kRobberFacingLeft);
      }
      this.mRobber.getXform().incXPosBy(-0.25);
    }

    if (engine.input.isKeyPressed(engine.input.keys.L)) {
      this.mCamera.incAmbientIntensityBy(0.05);
    }
    if (engine.input.isKeyPressed(engine.input.keys.K)) {
      this.mCamera.incAmbientIntensityBy(-0.05);
    }
    if (this.mCamera.getAmbientIntensity() >= 1) {
      this.mCamera.setAmbientIntensity(1);
    }
    if (this.mCamera.getAmbientIntensity() < 0.1) {
      this.mCamera.setAmbientIntensity(0.1);
    }
    if (this.mCamera.getAmbientIntensity() > 0.6) {
      this.mStreetLightSet.forEach((light) => {
        light.setActive(false);
      });
    } else {
      this.mStreetLightSet.forEach((light) => {
        light.setActive(true);
      });
    }

    this.mRedLight
      .getXform()
      .setPosition(
        this.mPoliceCar.getXform().getXPos(),
        this.mPoliceCar.getXform().getYPos(),
        10
      );
    this.mBlueLight
      .getXform()
      .setPosition(
        this.mPoliceCar.getXform().getXPos(),
        this.mPoliceCar.getXform().getYPos(),
        10
      );
  }
}

window.onload = function () {
  engine.init("GLCanvas");

  let myGame = new MyGame();
  myGame.start();
};
