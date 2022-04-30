import * as THREE from '../../lib/three.module.js'
import {EffectComposer} from '../../postprocess/EffectComposer.js'
import {FilmPass} from '../../postprocess/FilmPass.js'
import {RenderPass} from '../../postprocess/RenderPass.js'
import {BloomPass} from '../../postprocess/BloomPass.js'
import {ShaderPass} from '../../postprocess/ShaderPass.js'
import {UnrealBloomPass} from '../../postprocess/UnrealBloomPass.js'
import {TestShader} from '../../postprocess/TestShader.js'
import {TestShader2} from '../../postprocess/TestShader2.js'
import {HorizontalBlurShader} from '../../postprocess/HorizontalBlurShader.js'
import {VerticalBlurShader} from '../../postprocess/VerticalBlurShader.js'
import PublicMethod from '../../method/method.js'

import Center from './build/visualizer.center.build.js'
import Child from './build/visualizer.child.build.js'
import Tunnel from './build/visualizer.tunnel.build.js'
import Line from './build/visualizer.line.build.js'
import Logo from './build/visualizer.logo.build.js'
  
export default class{
    constructor({app, audio}){
        this.param = {
            fov: 60,
            near: 0.1,
            far: 10000,
            pos: 100,
            bloom: 2.5,
            strength: 2,
            radius: 0,
            threshold: 0,
        }

        this.modules = {
            tunnel: Tunnel,
            line: Line,
            center: Center,
            child: Child,
            logo: Logo
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

        const renderScene = new RenderPass( this.scene, this.camera )


        // bloom composer
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( width, height ), 
            this.param.strength,
            this.param.radius,
            this.param.threshold
        )

        this.bloomComposer = new EffectComposer(this.renderer)
        this.bloomComposer.renderToScreen = false
        this.bloomComposer.addPass(renderScene)
        this.bloomComposer.addPass(bloomPass)


        // final composer
        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: {value: null},
                    bloomTexture: {value: this.bloomComposer.renderTarget2.texture}
                },
                vertexShader: TestShader.vertexShader,
                fragmentShader: TestShader.fragmentShader,
                defines: {}
            }), "baseTexture"
        )
        finalPass.needsSwap = true

        this.finalPass2 = new ShaderPass(TestShader2)
        this.finalPass2.uniforms['resolution'].value = new THREE.Vector2(width, height)

        const renderTarget = new THREE.WebGLRenderTarget(width, height, {format: THREE.RGBAFormat, samples: 2048})
        this.finalComposer = new EffectComposer(this.renderer, renderTarget)
        this.finalComposer.addPass(renderScene)
        this.finalComposer.addPass(finalPass)
        // this.finalComposer.addPass(this.finalPass2)
    }


    // create
    create(){
        for(const module in this.modules){
            const instance = this.modules[module]
            const group = this.group[module]

            this.comp[module] = new instance({group, size: this.size, ...this.comp})
        }

        for(let i in this.group) this.build.add(this.group[i])
        
        this.scene.add(this.build)
    }


    // animate
    animate(){
        this.render()
        this.animateObject()
        this.animateGroup()
    }
    render(){
        // const rect = this.element.getBoundingClientRect()
        // const width = rect.right - rect.left
        // const height = rect.bottom - rect.top
        // const left = rect.left
        // const bottom = this.renderer.domElement.clientHeight - rect.bottom

        // this.renderer.setScissor(left, bottom, width, height)
        // this.renderer.setViewport(left, bottom, width, height)

        // this.camera.lookAt(this.scene.position)
        // this.renderer.render(this.scene, this.camera)

        // this.renderer.autoClear = false
        // this.renderer.clear()

        // this.camera.layers.set(PROCESS)
        // this.bloomComposer.render()

        // this.renderer.clearDepth()
        // this.camera.layers.set(NORMAL)
        // this.renderer.render(this.scene, this.camera)

        this.setMaterial()
        this.bloomComposer.render()
        this.restoreMaterial()
        this.finalComposer.render()
    }
    animateGroup(){
        const time = window.performance.now()

        const x = SIMPLEX.noise3D(0.005, 0.02, time * 0.0002581)
        const y = SIMPLEX.noise3D(0.015, 0.01, time * 0.0002123)

        this.build.position.x = x * 9
        this.build.position.y = y * 9
    }
    animateObject(){
        const {audioData, audioDataAvg} = this.audio

        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].animate) continue
            this.comp[i].animate({renderer: this.renderer, audioData, audioDataAvg})
        }
    }
    setMaterial(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].setMaterial) continue
            this.comp[i].setMaterial()
        } 
    }
    restoreMaterial(){
        for(let i in this.comp){
            if(!this.comp[i] || !this.comp[i].restoreMaterial) continue
            this.comp[i].restoreMaterial()
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
        this.finalComposer.setSize(width, height)
        this.finalPass2.uniforms['resolution'].value = new THREE.Vector2(width, height)

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