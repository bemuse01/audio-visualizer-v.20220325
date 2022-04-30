import * as THREE from '../../lib/three.module.js'

export default class{
    constructor({width, height, widthSeg, heightSeg, materialName, materialOpt}){
        this.width = width
        this.height = height
        this.widthSeg = widthSeg
        this.heightSeg = heightSeg
        this.materialName = materialName
        this.materialOpt = materialOpt
    
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const geometry = this.createGeometry()
        this.createMaterial()
        this.mesh = new THREE.Mesh(geometry, this.material)
    }
    createGeometry(){
        return new THREE.PlaneGeometry(this.width, this.height, this.widthSeg, this.heightSeg)
    }
    createMaterial(){
        this.material = new THREE[this.materialName](this.materialOpt)
    }


    // set
    setAttribute(name, array, itemSize){
        this.mesh.geometry.setAttribute(name, new THREE.BufferAttribute(array, itemSize))
    }
    setUniform(name, value){
        this.mesh.material.uniforms[name].value = value
    }
    setMaterial(material){
        this.mesh.material = material
    }

    // get
    get(){
        return this.mesh
    }
    getGeometry(){
        return this.mesh.geometry
    }
    getMaterial(){
        return this.material
    }
    getAttribute(name){
        return this.mesh.geometry.attributes[name]
    }
    getUniform(name){
        return this.mesh.material.uniforms[name].value
    }
}