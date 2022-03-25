import {LineGeometry} from '../../lib/LineGeometry.js'
import {LineMaterial} from '../../lib/LineMaterial.js'
import {Line2} from '../../lib/Line2.js'

export default class{
    constructor({position, color, linewidth}){
        this.color = color
        this.linewidth = linewidth
        this.position = position
        
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        // const count = this.position.length / 3

        // for(let i = 0; i < count / 2; i++){
        //     const pos = []

        //     for(let j = 0; j < 2; j++){
        //         const idx = i * 2 + j
        //         const index = idx * 3

        //         const x = this.position[index]
        //         const y = this.position[index + 1]
        //         const z = this.position[index + 2]

        //         pos.push(x, y, z)
        //     }

        //     const geometry = this.createGeometry(pos)
        //     const material = this.createMaterial()

        //     const mesh = new THREE.Line2(geometry, material)

        //     this.group.add(mesh)
        // }

        const geometry = this.createGeometry()
        const material = this.createMaterial()

        this.mesh = new Line2(geometry, material)
    }
    createGeometry(){
        const geometry = new LineGeometry()
        
        geometry.setPositions(this.position)

        return geometry
    }
    createMaterial(){
        return new LineMaterial({
            color: this.color,
            // vertexColors: true,
            linewidth: this.linewidth,
            dashed: false,
            transparent: true,
            opacity: 1.0,
            // blending: THREE.AdditiveBlending
        })
    }


    // dispose
    dispose(){

    }


    // get
    get(){
        return this.mesh
    }
    getPosition(){
        return this.icosa.position
    }


    // set
    setPositions(array){
        this.mesh.geometry.setPositions(array)
    }
}