attribute vec3 aVertexPosition;      // Vertex shader expects one vertex position
attribute vec2 aTextureCoordinate;   // This is the texture coordinate attribute

// texture coordinate that maps image to the square
varying vec2 vTexCoord;
varying vec2 vNormalCoord;
varying vec3 vFragPos;

// to transform the vertex position
uniform mat4 uModelXformMatrix;
uniform mat4 uCameraXformMatrix;

void main(void) { 
    gl_Position = uCameraXformMatrix * uModelXformMatrix * vec4(aVertexPosition, 1.0);
    
    vTexCoord = aTextureCoordinate;
    vFragPos = vec3(uModelXformMatrix * vec4(aVertexPosition, 1.0));
}
