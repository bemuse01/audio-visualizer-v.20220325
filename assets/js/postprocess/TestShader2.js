const TestShader2 = {
    uniforms: {
        tDiffuse: {value: null},
        tBase: {value: null},
        radius: {value: 0.25}
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
        uniform sampler2D tBase;
        uniform float radius;

        varying vec2 vUv;

        void main() {
            vec4 color1 = texture2D(tDiffuse, vUv);
            vec4 color2 = texture2D(tBase, vUv);

            float dist = distance(vUv, vec2(0.5));

            vec4 color = mix(color2, color1, dist);

            gl_FragColor = color2;
        }
    `
}

export {TestShader2}