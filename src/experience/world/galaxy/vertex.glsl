attribute float aScale;
attribute vec3 aRandomness;

uniform float uStarsSize;
uniform float uSpinSpeed;
uniform float uTime;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  /* SPIN */
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * uSpinSpeed;
  angle += angleOffset;

  modelPosition.z = cos(angle) * distanceToCenter;
  modelPosition.x = sin(angle) * distanceToCenter;

  /* RANDOMNESS */
  modelPosition.xyz += aRandomness.xyz;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;


  gl_Position = projectionPosition;
  gl_PointSize = uStarsSize * aScale;
  gl_PointSize *= ( 1.0 / - viewPosition.z );

  vColor = color;
}