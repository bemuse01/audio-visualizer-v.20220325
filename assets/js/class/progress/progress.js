import BAR from './build/progress.bar.build.js'
import HOVER from './build/progress.hover.build.js'

export default class{
    constructor(){
        this.group = {
            hover: null,
            bar: null
        }

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.createHover()
        this.createBar()
    }
    createHover(){
        this.group.hover = new HOVER()
    }
    createBar(){
        this.group.bar = new BAR()
    }


    // animate
    animate({audio}){
        this.group.bar.animate(audio)
    }
}