export default {
    effect: {
        vertex: `
            varying vec2 vUv;

            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;
            
            uniform sampler2D tDiffuse;
            uniform vec2 lightPosition;
            uniform float exposure;
            uniform float decay;
            uniform float density;
            uniform float weight;
            uniform int samples;

            const int MAX_SAMPLES = 100;

            void main(){

                vec2 texCoord = vUv;
                vec2 deltaTextCoord = texCoord - lightPosition;
                deltaTextCoord *= 1.0 / float(samples) * density;
                vec4 color = texture2D(tDiffuse, texCoord);
                float illuminationDecay = 1.0;

                for(int i=0; i < MAX_SAMPLES; i++){
                    if(i == samples){
                        break;
                    }

                    texCoord -= deltaTextCoord;
                    vec4 SSS = texture2D(tDiffuse, texCoord);
                    SSS *= illuminationDecay * weight;
                    color += SSS;
                    illuminationDecay *= decay;
                }

                gl_FragColor = color * exposure;
            }
        `
    },
    blend: {
        vertex: `
            varying vec2 vUv;

            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;

            uniform sampler2D tDiffuse;
            uniform sampler2D tAdd;

            void main() {
                vec4 color = texture2D(tDiffuse, vUv);
                vec4 add = texture2D(tAdd, vUv);
                gl_FragColor = color + add;
            }
        `
    }
   
}