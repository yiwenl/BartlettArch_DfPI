module.exports = `
precision mediump float;
varying vec2 vUV;
varying vec3 vColor;


float map(float value, float start, float end, float newStart, float newEnd) {
  float percent = (value - start) / (end - start);
  if (percent < 0.0) {
    percent = 0.0;
  }
  if (percent > 1.0) {
    percent = 1.0;
  }
  float newValue = newStart + (newEnd - newStart) * percent;
  return newValue;
} 

void main() {
  
  gl_FragColor = vec4(vColor * .5 + .5, 1.0);
  
  
}`
