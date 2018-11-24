#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;
varying vec2 vTextureCoord;

uniform float timeFactor;
uniform vec4 selColor;
uniform sampler2D uSampler2;
uniform float texScale;

void main() {
    gl_FragColor = texture2D(uSampler2, vTextureCoord+texScale);
}