import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'
import Particle from '../../objects/particle.js'
import ParentParam from '../param/visualizer.param.js'
import Shader from '../shader/visualizer.line.shader.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = {
            count: 3,
            radius: ParentParam.radius + 1.2,
            thickness: 0.3,
            seg: 360,
            // color: 0x936cc6 + 0x222222,
            color: 0x936cc6,
            pointSize: 4,
        }

        this.objects = []
        this.points = []
        this.currentData = 0

        this.max = this.param.seg / this.param.count
        this.audioIsPlaying = false

        this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

        this.init()
    }


    // init
    init(){
        setInterval(() => {
            if(this.audioIsPlaying) this.create()
        }, 200)
    }


    // create
    create(){
        const objects = []
        const points = []

        if(this.currentData === 0) return

        for(let i = 0; i < this.param.count; i++){
            const {radius, thickness, seg, color} = this.param

            const deg = 360 / this.param.count * i
            const currentData = this.currentData

            // line
            const object = new Ring({
                innerRadius: radius,
                outerRadius: radius + thickness,
                seg,
                materialOpt: {
                    color,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    depthWrite: false,
                }
            })
            
            object.getGeometry().setDrawRange(0, currentData * 3 * 2)
            object.get().rotation.z = deg * RADIAN
            
            this.group.add(object.get())
            objects.push(object)

            
            // point
            for(let j = 0; j < 2; j++){
                const point = new Particle({
                    count: 2,
                    materialOpt:{
                        vertexShader: Shader.vertex,
                        fragmentShader: Shader.fragment,
                        transparent: true,
                        // blending: THREE.AdditiveBlending,
                        depthTest: false,
                        depthWrite: false,
                        uniforms: {
                            uColor: {value: new THREE.Color(this.param.color)},
                            uPointSize: {value: this.param.pointSize},
                            uOpacity: {value: 0}
                        }
                    }
                })

                const {position} = this.createAttribute(object, currentData)
                point.setAttribute('position', new Float32Array(position), 3)

                point.get().rotation.z = deg * RADIAN
             
                this.group.add(point.get())
                points.push(point)
            }
        }

        this.createTween(objects, points)

        this.objects.push(objects)
        this.points.push(points)
    }
    createAttribute(object, currentData){
        const position = []

        const array = object.getGeometry().attributes.position.array
        const half = object.getGeometry().attributes.position.count / 2

        for(let i = 0; i < 2; i++){
            const idx = currentData * i * 3

            const x1 = array[idx]
            const y1 = array[idx + 1]
            const z1 = array[idx + 2]

            const x2 = array[idx + half * 3]
            const y2 = array[idx + 1 + half * 3]
            const z2 = array[idx + 2 + half * 3]

            position.push(
                (x1 + x2) / 2,
                (y1 + y2) / 2,
                (z1 + z2) / 2
            )
        }

        return {position}
    }


    // tween
    createTween(objects, points){
        const start = {opacity: 1, z: 0}
        const end = {opacity: 0, z: 200}

        const tw = new TWEEN.Tween(start)
        .to(end, 7000)
        .onUpdate(() => this.onUpdateTween(objects, points, start))
        .onComplete(() => this.onCompleteTween(objects, points))
        .start()
    }
    onUpdateTween(objects, points, {opacity, z}){
        objects.forEach((object, i) => {
            object.get().position.z = z
            object.getMaterial().opacity = opacity
        })

        points.forEach(point => {
            point.get().position.z = z
            point.setUniform('uOpacity', opacity)
        })
    }
    onCompleteTween(objects, points){
        objects.forEach(object => {
            this.group.remove(object.get())
            object.dispose()
        })
        objects.length = 0
        this.objects.shift()

        points.forEach(point => {
            this.group.remove(point.get())
            point.dispose()
        })
        points.length = 0
        this.points.shift()
    }


    // animate
    animate({audioData, audioDataAvg}){
        this.group.rotation.z += 0.01

        this.objects.forEach(child => {
            
            child.forEach(object => {
                object.get().rotation.z -= 0.01
            })

        })

        this.points.forEach(child => {
            
            child.forEach(object => {
                object.get().rotation.z -= 0.01
            })

        })

        if(audioData){
            this.audioIsPlaying = true
            this.currentData = ~~(audioDataAvg * this.max)
        }
    }


    // swap material for avoding bloom
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