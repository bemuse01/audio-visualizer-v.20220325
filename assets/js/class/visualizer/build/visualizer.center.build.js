import * as THREE from '../../../lib/three.module.js'
import Shader from '../shader/visualizer.tunnel.shader.js'
import Ring from '../../objects/ring.js'
import ParentParam from '../param/visualizer.param.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = [
            {
                color: 0x936cc6 - 0x444444,
                radius: ParentParam.radius + 0.7,
                thickness: 15,
                seg: 128,
                opacity: 0.75,
                needsShader: true
            },
            {
                color: 0x936cc6 - 0x111111,
                radius: ParentParam.radius,
                thickness: 0.4,
                seg: 128,
                needsShader: false

            },
            {
                color: 0x936cc6 - 0x111111 + 0x333333,
                radius: ParentParam.radius + 0.7,
                thickness: 0.3,
                seg: 128,
                needsShader: false

            },
        ]

        this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
        this.object = []

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.param.forEach((param, i) => {
            const {color, radius, thickness, seg, needsShader, opacity} = param

            const materialOpt = needsShader ? {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    uColor: {value: new THREE.Color(color)},
                    uOpacity: {value: opacity}
                }
            } : {
                transparent: true,
                // blending: THREE.AdditiveBlending,
                color
            }

            this.object[i] = new Ring({
                innerRadius: radius,
                outerRadius: radius + thickness,
                seg,
                materialOpt
            })

            if(needsShader){
                const count = this.object[i].getGeometry().attributes.position.count
                this.object[i].setAttribute('aOpacity', new Float32Array(Array.from({length: count}, (_, i) => i < count / 2 ? 1 : 0)), 1)
            }

            this.group.add(this.object[i].get())
        })
    }


    // swap material for avoding bloom
    setMaterial(){
        this.object.forEach(object => {
            object.setMaterial(this.darkMaterial) 
        })
    }
    restoreMaterial(){
        this.object.forEach(object => {
            object.setMaterial(object.getMaterial())
        })
    }
}