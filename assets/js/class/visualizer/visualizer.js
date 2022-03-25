import * as THREE from '../../lib/three.module.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {FilmPass} from '../../postprocess/FilmPass.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {BloomPass} from '../../postprocess/BloomPass.js'
import {ShaderPass} from '../../postprocess/ShaderPass.js'
import {FXAAShader} from '../../postprocess/FXAAShader.js'

import PublicMethod from '../../method/method.js'

import Center from './build/visualizer.center.build.js'
import Child from './build/visualizer.child.build.js'
import Tunnel from './build/visualizer.tunnel.build.js'
  
export default class{
    constructor({app, audio}){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 100,
            bloom: 2.5
        }

        this.modules = {
            tunnel: Tunnel,
            center: Center,
            child: Child,
        }
        this.group = {}
        this.comp = {}
        this.build = new THREE.Group()

        this.renderer = app.renderer
        this.audio = audio

        this.init()
    }


    // init
    init(){
        this.initGroup()
        this.initRenderObject()
        this.initComposer()
        this.create()
        this.add()
    }
    initGroup(){
        for(const module in this.modules){
            this.group[module] = new THREE.Group()
            this.comp[module] = null
        }
    }
    initRenderObject(){
        this.element = document.querySelector('.visualizer-object')

        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.param.fov, width / height, this.param.near, this.param.far)
        this.camera.position.z = this.param.pos
        
        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PublicMethod.getVisibleWidth(this.camera, 0),
                h: PublicMethod.getVisibleHeight(this.camera, 0)
            }
        }
    }
    initComposer(){
        const {right, left, bottom, top} = this.element.getBoundingClientRect()
        const width = right - left
        const height = bottom - top
        
        this.bloomComposer = new EffectComposer(this.renderer)
        this.bloomComposer.setSize(width, height)

        const renderPass = new RenderPass(this.scene, this.camera)

        this.bloomComposer.addPass(renderPass)
    }


    // add
    add(){
        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // create
    create(){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, size: this.size, ...this.comp})
        }
    }


    // animate
    animate(){
        this.render()
        this.animateObject()
    }
    render(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top
        const left = rect.left
        const bottom = this.renderer.domElement.clientHeight - rect.bottom

        this.renderer.setScissor(left, bottom, width, height)
        this.renderer.setViewport(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        this.renderer.render(this.scene, this.camera)

        // app.renderer.autoClear = false
        // app.renderer.clear()

        // this.camera.layers.set(PROCESS)
        // this.composer.render()

        // app.renderer.clearDepth()
        // this.camera.layers.set(NORMAL)
        // app.renderer.render(this.scene, this.camera)
    }
    animateObject(){
        const {audioData, audioDataAvg} = this.audio

        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate({renderer: this.renderer, audioData, audioDataAvg})
        }
    }


    // resize
    resize(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.bloomComposer.setSize(width, height)

        this.size = {
            el: {
                w: width,
                h: height
            },
            obj: {
                w: PublicMethod.getVisibleWidth(this.camera, 0),
                h: PublicMethod.getVisibleHeight(this.camera, 0)
            }
        }

        this.resizeObject()
    }
    resizeObject(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].resize) continue
            this.comp[i].resize(this.size)
        }
    }
}