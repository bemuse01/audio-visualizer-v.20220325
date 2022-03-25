import ShaderMethod from '../../../method/method.shader.js'

export default {
    draw: {
        vertex: `
            varying vec2 vUv;
            varying vec3 vPosition;

            uniform float uPointSize;
            uniform float uTime;
            uniform float uAudio;
            uniform float uBoost;

            ${ShaderMethod.snoise4D()}

            void main(){
                vec3 newPosition = position;

                float x = snoise4D(vec4(position * 0.1 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;
                float y = snoise4D(vec4(position * 0.2 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;
                float z = snoise4D(vec4(position * 0.3 * 0.25, uTime * 0.001 + uAudio)) * uBoost * uAudio;

                newPosition.x += x;
                newPosition.y += y;
                newPosition.z += z;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                
                gl_PointSize = uPointSize;

                vUv = uv;
                vPosition = position;
            }
        `,
        fragment: `
            varying vec2 vUv;
            varying vec3 vPosition;

            uniform vec3 uColor;
            uniform float uSize;

            ${ShaderMethod.executeNormalizing()}

            void main(){
                // float max = length(vec3(uSize));
                // float dist = length(vPosition);
                // float n = 1.0 - executeNormalizing(dist, 0.0, 1.0, uSize, max);

                // float max = uSize;
                // float x = length(vPosition.x);
                // float n = executeNormalizing(x, 0.25, 1.0, 0.0, max);

                // vec4 color = vec4(vec3(1.0, n, n), 1.0);
                vec4 color = vec4(vec3(vUv, 1.0), 1.0);

                gl_FragColor = color;
            }
        `
    },
}