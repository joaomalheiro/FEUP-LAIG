#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float heightScale;
uniform float timeFactor;
uniform sampler2D uSampler;

varying vec4 coords;
varying vec4 normal;
varying vec2 vTextureCoord;
varying vec3 offset;

void main() {

    vTextureCoord = aTextureCoord;
    vec4 heightMapC = texture2D(uSampler, aTextureCoord); 
    float height = heightScale* (heightMapC.r + heightMapC.g + heightMapC.b)/3.0; 
    offset = aVertexNormal*height*0.1;
       
    vec4 vertex= vec4(aVertexPosition+offset,1.0);
    gl_Position = uPMatrix * uMVMatrix * vertex;

}
