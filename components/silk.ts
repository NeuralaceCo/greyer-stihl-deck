/* The brand background for the opening slides: slow silk folds in graphite, with STIHL orange catching the
   light toward the lower right. Our own shader in the spirit of React Bits' Silk/Aurora. Rendered below
   screen resolution (it's all soft) and only while a brand slide is on screen. */

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
out vec4 F;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float t = uTime * 0.11;

  /* Bend the space with layered sine waves: long soft folds that drift and never curl. */
  for (int i = 1; i <= 5; i++) {
    float n = float(i);
    p += vec2(sin(p.y * 1.15 * n + t * 1.6 + n * 1.3), cos(p.x * 0.95 * n - t * 1.2 + n * 2.1)) * (0.24 / n);
  }
  float fold = 0.5 + 0.5 * sin(p.x * 2.1 + p.y * 1.4 + t * 1.8);
  float sheen = pow(fold, 7.0);

  vec3 graphite = vec3(0.078, 0.082, 0.086);
  vec3 heather = vec3(0.34, 0.35, 0.37);
  vec3 ember = vec3(0.45, 0.17, 0.04);
  vec3 orange = vec3(0.953, 0.478, 0.122);

  /* Orange gathers toward the lower right, where the cap sits; the left stays quiet for the type. */
  float warm = smoothstep(0.15, 1.05, uv.x * 0.85 + (1.0 - uv.y) * 0.45);
  vec3 col = graphite + heather * 0.07 * fold;
  col += mix(ember, orange, sheen) * sheen * 0.62 * warm;
  col += ember * 0.10 * fold * warm;

  col *= 1.0 - 0.38 * length(uv - vec2(0.62, 0.45));
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.012;
  F = vec4(max(col, 0.0), 1.0);
}`;

export function createSilk(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return null;

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(program, "a");
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");

  const resize = () => {
    const scale = 0.55 * Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };

  const render = (time: number) => {
    gl.uniform1f(uTime, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return { resize, render };
}
