import ShaderMethod from '../method/method.shader.js'

const TestShader2 = {
    uniforms: {
        tDiffuse: {value: null},
        resolution: {value: null},
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;

        varying vec2 vUv;

        ${ShaderMethod.executeNormalizing()}

        void main() {
            float Pi = 6.28318530718;
    
            float directions = 16.0; // BLUR directions (Default 16.0 - More is better but slower)
            float quality = 4.0; // BLUR quality (Default 4.0 - More is better but slower)
            float size = 16.0; // BLUR size (radius)
           
            vec2 radius = size / resolution;
            vec4 color = texture(tDiffuse, vUv);
            
            for(float d = 0.0; d < Pi; d += Pi / directions){
                for(float i = 1.0 / quality; i <= 1.0; i += 1.0 / quality){
                    color += texture(tDiffuse, vUv + vec2(cos(d), sin(d)) * radius * i);
                }
            }
            
            color /= quality * directions - 15.0;

            vec4 base = texture(tDiffuse, vUv);

            float dist = executeNormalizing(distance(vUv, vec2(0.5)), 0.0, 1.0, 0.0, 0.5);
            // float dist = distance(vUv * 2.0 - 1.0, vec2(0));
            vec4 final = mix(base, color, dist);

            gl_FragColor =  final;
        }
    `
}

export {TestShader2}