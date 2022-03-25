import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'

export default class{
    constructor({group, size}){
        this.group = group 
        this.size = size

        this.param = {
            radius: 16.7,
            thickness: 0.3,
            seg: 128,
            color: 0x936cc6 + 0x111111
        }

        this.init()
    }


    // init
    init(){
        setInterval(() => this.create(), 1000)
    }


    // tween
    createTween(object){
        const start = {opacity: 1, z: 0}
        const end = {opacity: 0, z: 200}

        const tw = new TWEEN.Tween(start)
        .to(end, 8000)
        .onUpdate(() => this.onUpdateTween(object, start))
        .onComplete(() => this.onCompleteTween(object))
        .start()
    }
    onUpdateTween(object, {opacity, z}){
        // object.get().scale.set(scale, scale, scale)
        object.get().position.z = z
        object.getMaterial().opacity = opacity
    }
    onCompleteTween(object){
        this.group.remove(object)
        object.dispose()
    }


    // create
    create(){
        const object = new Ring({
            innerRadius: this.param.radius,
            outerRadius: this.param.radius + this.param.thickness,
            seg: this.param.seg,
            materialOpt: {
                color: this.param.color,
                transparent: true,
                opacity: 1
            }
        })

        this.group.add(object.get())

        this.createTween(object)
    }
}