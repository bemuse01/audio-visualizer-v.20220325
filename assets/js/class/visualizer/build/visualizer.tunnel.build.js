import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'
import Shader from '../shader/visualizer.tunnel.shader.js'

export default class{
    constructor({group, size}){
        this.group = group 
        this.size = size

        this.param = [
            {
                radius: 15.7,
                thickness: 10,
                seg: 128,
                color: 0x936cc6 - 0x444444,
                opacity: 0.6,
                needsShader: true
            },
            {
                radius: 15.7,
                thickness: 1.6,
                seg: 128,
                color: 0x000000,
                opacity: 1,
                needsShader: true
            },
            {
                radius: 15.7,
                thickness: 0.2,
                seg: 128,
                color: 0x936cc6 - 0x222222,
                opacity: 1,
                needsShader: false
            },
        ]

        this.audioIsPlaying = false

        this.init()
    }


    // init
    init(){
        setInterval(() => {
            if(this.audioIsPlaying) this.create()
        }, 800)
    }


    // tween
    createTween(objects){
        const start = {opacity: 0, z: 0}
        const end = {opacity: [1, 0, 0, 0], z: 200}

        const tw = new TWEEN.Tween(start)
        .to(end, 6000)
        .onUpdate(() => this.onUpdateTween(objects, start))
        .onComplete(() => this.onCompleteTween(objects))
        .start()
    }
    onUpdateTween(objects, {opacity, z}){
        objects.forEach((object, i) => {
            const needsShader = this.param[i].needsShader
            const o = this.param[i].opacity * opacity

            object.get().position.z = z
            if(needsShader) object.setUniform('uOpacity', o)
            else object.getMaterial().opacity = o
        })
    }
    onCompleteTween(objects){
        objects.forEach(object => {
            this.group.remove(object)
            object.dispose()
        })
    }


    // create
    create(){
        const objects = []

        this.param.forEach(param => {
            const {radius, thickness, seg, color, needsShader} = param

            const materialOpt = needsShader ? {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                // blending: THREE.AdditiveBlending,
                uniforms: {
                    uColor: {value: new THREE.Color(color)},
                    uOpacity: {value: 0}
                }
            } : {
                // blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0,
                color
            }

            const object = new Ring({
                innerRadius: radius,
                outerRadius: radius + thickness,
                seg,
                materialOpt
            })

            if(needsShader){
                const count = object.getGeometry().attributes.position.count
                object.setAttribute('aOpacity', new Float32Array(Array.from({length: count}, (_, i) => i < count / 2 ? 1 : 0)), 1)
            }

            this.group.add(object.get())
            objects.push(object)
        })

        this.createTween(objects)
    }


    // animate
    animate({audioData}){
        if(audioData) this.audioIsPlaying = true
    }
}