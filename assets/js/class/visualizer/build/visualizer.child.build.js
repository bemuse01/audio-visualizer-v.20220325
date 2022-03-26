import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'
import ParentParam from '../param/visualizer.param.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = {
            count: 3,
            radius: ParentParam.radius + 0.9,
            thickness: 0.5,
            seg: 360,
            color: 0x936cc6 + 0x222222
        }

        this.max = this.param.seg / this.param.count
        this.object = []

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        for(let i = 0; i < this.param.count; i++){
            const deg = 360 / this.param.count * i

            this.object[i] = new Ring({
                innerRadius: this.param.radius - this.param.thickness / 2,
                outerRadius: this.param.radius + this.param.thickness / 2,
                seg: this.param.seg,
                materialOpt: {
                    color: this.param.color,
                    transparent: true,
                    // opacity: 0.5,
                    // blending: THREE.AdditiveBlending
                }
            })

            this.object[i].getGeometry().setDrawRange(0, 0)

            this.object[i].get().rotation.z = deg * RADIAN

            this.group.add(this.object[i].get())
        }
    }


    // animate
    animate({audioData, audioDataAvg}){
        this.group.rotation.z += 0.01

        if(audioData){
            const data = ~~(audioDataAvg * this.max)

            for(let i = 0; i < this.param.count; i++){
                this.object[i].getGeometry().setDrawRange(0, data * 2 * 3)
            }
        }
    }
}