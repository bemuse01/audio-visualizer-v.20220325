import * as THREE from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'
import ParentParam from '../param/visualizer.param.js'

export default class{
    constructor({group}){
        this.group = group
        
        this.param = {
            width: ParentParam.radius + 4,
            height: ParentParam.radius + 4,
        }

        this.darkMaterial = new THREE.MeshBasicMaterial({transparent: true, color: 0x000000})
        this.src = './assets/src/holox.png'

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const loader = new THREE.TextureLoader()
        
        loader.load(this.src, (texture) => {

            this.object = new Plane({
                width: this.param.width,
                height: this.param.height,
                widthSeg: 1,
                heightSeg: 1,
                materialName: 'MeshBasicMaterial',
                materialOpt: {
                    map: texture,
                    transparent: true
                }
            })

            this.group.add(this.object.get())

        })
    }


    // dispose
    dispose(){
        if(!this.src) return
        
        this.group.clear()
        this.object.dispose()
        this.darkMaterial.dispose()
    }


    setMaterial(){
        if(!this.object) return
        this.object.setMaterial(this.darkMaterial) 
    }
    restoreMaterial(){
        if(!this.object) return
        this.object.setMaterial(this.object.getMaterial())
    }
}