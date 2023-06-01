varying vec2 uv_coord;


void main() {
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  uv_coord = uv;
}

