const TestShader = {
    uniforms: {
        tBase: {value: null},
        tBloom: {value: null},
    },

    vertexShader: `
        varying vec2 vUv;

        void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
    `,
    fragmentShader: `
    `
}

export {TestShader}