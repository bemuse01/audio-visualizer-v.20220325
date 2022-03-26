import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'
import Particle from '../../objects/particle.js'
import ParentParam from '../param/visualizer.param.js'
import Shader from '../shader/visualizer.line.shader.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = {
            count: 20,
            iter: 3,
            radius: ParentParam.radius + 1.2,
            thickness: 0.3,
            seg: 360,
            color: 0x936cc6 + 0x222222,
            pointSize: 6,
        }

        this.objects = []
        this.points = []
        this.currentData = 0

        this.max = this.param.seg / this.param.iter
        this.audioIsPlaying = false
        this.index = 0

        this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

        this.init()
    }


    // init
    init(){
        this.create()

        setInterval(() => {
            if(this.audioIsPlaying){
                this.createTween()
                this.index = (this.index + 1) % this.param.count
            }
        }, 200)
    }


    // create
    create(){
        // const points = []

        for(let j = 0; j < this.param.count; j++){
            const objects = []

            for(let i = 0; i < this.param.iter; i++){
                const {radius, thickness, seg, color} = this.param

                const deg = 360 / this.param.iter * i
                

                // line
                const object = new Ring({
                    innerRadius: radius,
                    outerRadius: radius + thickness,
                    seg,
                    materialOpt: {
                        color,
                        transparent: true,
                        opacity: 0,
                        blending: THREE.AdditiveBlending
                    }
                })

                object.getGeometry().setDrawRange(0, 0)
                object.get().rotation.z = deg * RADIAN

                this.group.add(object.get())
                objects.push(object)


                // point
                // for(let j = 0; j < 2; j++){
                //     const point = new Particle({
                //         count: 2,
                //         materialOpt:{
                //             vertexShader: Shader.vertex,
                //             fragmentShader: Shader.fragment,
                //             transparent: true,
                //             uniforms: {
                //                 uColor: {value: new THREE.Color(this.param.color)},
                //                 uPointSize: {value: this.param.pointSize},
                //                 uOpacity: {value: 0}
                //             }
                //         }
                //     })

                //     const {position} = this.createAttribute(object)
                //     point.setAttribute('position', new Float32Array(position), 3)

                //     point.get().rotation.z = deg * RADIAN
                
                //     this.group.add(point.get())
                //     points.push(point)
                // }
            }

            this.objects.push(objects)
            // this.points.push(points)
        }
    }
    createAttribute(object){
        const position = []

        const array = object.getGeometry().attributes.position.array
        const half = object.getGeometry().attributes.position.count / 2

        for(let i = 0; i < 2; i++){
            const idx = this.currentData * i * 3

            const x1 = array[idx]
            const y1 = array[idx + 1]
            const z1 = array[idx + 2]

            const x2 = array[idx + half]
            const y2 = array[idx + 1 + half]
            const z2 = array[idx + 2 + half]

            position.push(
                (x1 + x2) / 2,
                (y1 + y2) / 2,
                (z1 + z2) / 2
            )
        }

        return {position}
    }


    // tween
    createTween(){
        const objects = this.objects[this.index]
        const start = {opacity: 1, z: 0}
        const end = {opacity: 0, z: 200}

        const tw = new TWEEN.Tween(start)
        .to(end, 7000)
        .onStart(() => this.onStartTween(objects))
        .onUpdate(() => this.onUpdateTween(objects, start))
        // .onComplete(() => this.onCompleteTween(objects))
        .start()
    }
    onStartTween(objects){
        objects.forEach((object, i) => {
            const deg = 360 / this.param.iter * i

            object.getGeometry().setDrawRange(0, this.currentData * 3 * 2)
            object.get().rotation.z = deg * RADIAN
        })
    }
    onUpdateTween(objects, {opacity, z}){
        objects.forEach(object=> {
            object.get().position.z = z
            object.get().rotation.z -= 0.01

            object.getMaterial().opacity = opacity
        })
    }
    onCompleteTween(objects){
        objects.forEach(object => {
            this.group.remove(object)
            object.dispose()
        })
        this.objects.shift()

        // points.forEach(point => {
        //     this.group.remove(point)
        //     point.dispose()
        // })
        // this.points.shift()
    }


    // animate
    animate({audioData, audioDataAvg}){
        this.group.rotation.z += 0.01

        // this.objects.forEach(child => {
            
        //     child.forEach((object, i) => {
        //         object.get().rotation.z -= 0.01
        //     })

        // })

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