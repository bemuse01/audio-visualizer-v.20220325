import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'
import Shader from '../shader/visualizer.tunnel.shader.js'
import ParentParam from '../param/visualizer.param.js'

export default class{
    constructor({group, size}){
        this.group = group 
        this.size = size

        this.param = [
            {
                radius: ParentParam.radius + 1.2,
                thickness: 10,
                seg: 128,
                color: 0x936cc6 - 0x444444,
                opacity: 0.5,
                needsShader: true
            },
            {
                radius: ParentParam.radius + 1.2,
                thickness: 1.4,
                seg: 128,
                color: 0x000000,
                opacity: 0.9,
                needsShader: true
            },
            {
                radius: ParentParam.radius + 1.2,
                thickness: 0.2,
                seg: 128,
                color: 0x936cc6 - 0x222222,
                opacity: 1,
                needsShader: false
            },
        ]

        this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
        
        this.objects = []
        this.material = []
        this.audioIsPlaying = false

        this.oldTime = window.performance.now()
        this.interval = 800

        this.init()
    }


    // init
    init(){
        // setInterval(() => {
        //     if(this.audioIsPlaying) this.create()
        // }, 800)
    }


    // need to fix or not
    // tween
    createTween(objects){
        const start = {opacity: 0, z: 0}
        const end = {opacity: [1, 0, -1], z: 200}

        const tw = new TWEEN.Tween(start)
        .to(end, 7000)
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
            this.group.remove(object.get())
            object.dispose()
        })

        this.objects.shift()
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

        this.objects.push(objects)
    }


    // animate
    animate({audioData}){
        if(audioData) this.audioIsPlaying = true

        this.generate()
    }
    generate(){
        if(!this.audioIsPlaying) return

        const time = window.performance.now()

        if(time - this.oldTime > this.interval){
            this.create()
            this.oldTime = time
        }
    }

    
    // need to fix or not
    // swap material to avoid bloom
    setMaterial(){
        this.objects.forEach(child => {
            
            child.forEach(object => {
                object.setMaterial(this.darkMaterial) 
            })

        })
    }
    restoreMaterial(){
        this.objects.forEach(child => {
            
            child.forEach(object => {
                object.setMaterial(object.getMaterial()) 
            })

        })
    }
}