"use strict";

import * as glSys from "../core/gl.js";
import TextureRenderable from "./texture_renderable.js";
import * as shaderResources from "../core/shader_resources.js";
import * as texture from "../resources/texture.js";

class NormalMapRenderable extends TextureRenderable {
  constructor(texture, normalMapTexture, lightSources = null) {
    super(texture);
    this.mNormalTexture = normalMapTexture;
    this.mLightSources = lightSources;

    this.mDiffuseWeight = 0.7;
    this.mSpecularWeight = 0.7;
    this.mShininess = 16;

    super._setShader(shaderResources.getNormalMapShader());
  }

  draw(camera) {
    let gl = glSys.get();
    texture.activate(this.mTexture);
    if (this.mNormalTexture !== null)
      texture.activate(this.mNormalTexture, glSys.get().TEXTURE1);

    this.mShader.activate(this, camera); // always activate the shader first!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  getNormalMapTexture() {
    return this.mSecondTexture;
  }

  setNormalMapTexture(texture) {
    this.mNormalTexture = texture;
  }

  getLightSources() {
    return this.mLightSources;
  }

  setLightSources(newLights) {
    this.mLightSources = newLights;
  }

  addLightSource(light) {
    if (this.mLightSources.length < 8) {
      this.mLightSources.push(light);
    }
  }
}

export default NormalMapRenderable;
