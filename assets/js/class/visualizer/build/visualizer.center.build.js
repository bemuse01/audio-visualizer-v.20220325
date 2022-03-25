import * as THREE from '../../../lib/three.module.js'
import Ring from '../../objects/ring.js'

export default class{
    constructor({group}){
        this.group = group

        this.param = [
            {
                color: 0x936cc6 - 0x111111,
                radius: 16,
                thickness: 0.4,
                seg: 128,
            },
            {
                color: 0x936cc6 - 0x111111 + 0x333333,
                radius: 16.7,
                thickness: 0.3,
                seg: 128,
            }
        ]

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
            const {color, radius, thickness, seg} = param

            this.object[i] = new Ring({
                innerRadius: radius,
                outerRadius: radius + thickness,
                seg: seg,
                materialOpt: {
                    color: color
                }
            })

            this.group.add(this.object[i].get())
        })
    }
}