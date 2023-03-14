"use strict";

import * as glSys from "../core/gl.js";
import TextureShader from "./texture_shader.js";

class NormalMapShader extends TextureShader {
  constructor(vertexShaderPath, fragmentShaderPath) {
    // Call super class constructor
    super(vertexShaderPath, fragmentShaderPath); // call SimpleShader constructor

    let gl = glSys.get();

    this.mTextureRef = gl.getUniformLocation(
      this.mCompiledShader,
      "textureSampler"
    );

    this.mNormalRef = gl.getUniformLocation(
      this.mCompiledShader,
      "normalSampler"
    );

    this.mAmbientColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uAmbientColor"
    );
    
    this.mHasNormalMap = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasNormalMap"
    );

    // material properties
    this.mMaterialDiffuseWeight = gl.getUniformLocation(
      this.mCompiledShader,
      "uMaterialDiffuseWeight"
    );

    this.mMaterialSpecularWeight = gl.getUniformLocation(
      this.mCompiledShader,
      "uMaterialSpecularWeight"
    );

    this.mMaterialShininess = gl.getUniformLocation(
      this.mCompiledShader,
      "uMaterialShininess"
    );
  }

  activate(renderable, camera) {
    let gl = glSys.get();

    super.activate(
      renderable.mColor,
      renderable.mXform.getTRSMatrix(),
      camera.getCameraMatrix()
    );

    gl.uniform1i(this.mTextureRef, 0);
    
    if (renderable.mNormalTexture !== null) {
      gl.uniform1i(this.mHasNormalMap, true);
      gl.uniform1i(this.mNormalRef, 1);
    } else {
      gl.uniform1i(this.mHasNormalMap, false);
    }
      
    gl.uniform4fv(this.mAmbientColorRef, camera.mAmbientColor);
    gl.uniform1f(this.mMaterialDiffuseWeight, renderable.mDiffuseWeight);
    gl.uniform1f(this.mMaterialSpecularWeight, renderable.mSpecularWeight);
    gl.uniform1f(this.mMaterialShininess, renderable.mShininess);


    let lights = renderable.mLightSources;
    for (let i = 0; i < 8; i++) {
      this.getUniforms(i);

      if (lights != null) {
        if (lights[i] == null) {
          gl.uniform1i(this.mActiveRef, false);
        } else {
          gl.uniform1i(this.mActiveRef, lights[i].isActive());
          gl.uniform3fv(this.mPosRef, lights[i].getXform().getPosition());
          gl.uniform4fv(this.mColorRef, lights[i].getColor());
          gl.uniform2fv(this.mFalloffRef, lights[i].getFalloff());
          gl.uniform1i(this.mHasDiffuseRef, lights[i].hasDiffuse());
          gl.uniform1i(this.mHasSpecRef, lights[i].hasSpec());
        }
      } else {
        gl.uniform1i(this.mActiveRef, false);
      }
    }
  }
  
  getUniforms(index) {
    let gl = glSys.get();
    this.mActiveRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Active"
    );
    this.mPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Pos"
    );
    this.mColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Color"
    );
    this.mFalloffRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].Falloff"
    );
    this.mHasDiffuseRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].HasDiffuse"
    );
    this.mHasSpecRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLights[" + index + "].HasSpec"
    );
  }

  getGLUniformRefs1() {
    let gl = glSys.get();

    this.mLightPosRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightPos"
    );

    this.mLightColorRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightColor"
    );

    this.mFalloffRef = gl.getUniformLocation(this.mCompiledShader, "uFalloff");

    this.mHasDiffuseRef = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse"
    );

    this.mHasSpecRef = gl.getUniformLocation(this.mCompiledShader, "uHasSpec");
  }

  getGLUniformRefs2() {
    let gl = glSys.get();

    this.mIsSecondLightActiveRef = gl.getUniformLocation(
      this.mCompiledShader,
      "isSecondLightActive"
    );

    this.mLightPosRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightPos2"
    );

    this.mLightColorRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uLightColor2"
    );

    this.mFalloffRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uFalloff2"
    );

    this.mHasDiffuseRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasDiffuse2"
    );

    this.mHasSpecRef2 = gl.getUniformLocation(
      this.mCompiledShader,
      "uHasSpec2"
    );
  }
}

export default NormalMapShader;
