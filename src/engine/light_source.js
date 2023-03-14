"use strict";

import Transform from "./utils/transform.js";

class LightSource {
  constructor() {
    this.mXform = new Transform();
    this.mColor = [1.0, 1.0, 1.0, 1.0];
    this.mFalloff = [10, 5];

    this.mHasDiffuse = true;
    this.mHasSpec = true;
    this.mIsActive = true;
  }

  getXform() {
    return this.mXform;
  }

  getColor() {
    return this.mColor;
  }

  setColor(color) {
    this.mColor = color;
  }

  getIntensity() {
    return this.mColor[3];
  }

  setIntensity(newVal) {
    this.mColor[3] = this._clampVal(newVal, 0, 1);
  }

  IncIntensityBy(delta) {
    this.mColor[3] = this._clampVal(this.mColor[3] + delta, 0, 1);
  }

  getFalloff() {
    return this.mFalloff;
  }
  setFalloff(newVal) {
    this.mFalloff = newVal;
  }
  incFalloffBy(delta) {
    this.mFalloff[0] = Math.max(this.mFalloff[0] + delta[0], 0);
    this.mFalloff[1] = Math.max(this.mFalloff[1] + delta[1], 0);
  }

  _clampVal(val, min, max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
  }

  isActive() {
    return this.mIsActive;
  }

  setActive(val) {
    this.mIsActive = val;
  }

  toggle() {
    this.mIsActive = !this.mIsActive;
  }

  hasDiffuse() {
    return this.mHasDiffuse;
  }

  setDiffuse(val) {
    this.mHasDiffuse = val;
  }

  hasSpec() {
    return this.mHasSpec;
  }

  setSpec(val) {
    this.mHasSpec = val;
  }
}

export default LightSource;
