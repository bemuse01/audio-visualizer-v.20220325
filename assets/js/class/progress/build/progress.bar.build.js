export default class{
    constructor(){
        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.style = {
            width: '0%'
        }
    }


    // animate
    animate({duration, currentTime}){
        if(duration === 0) return
        const width = (currentTime / duration) * 100
        this.style.width = `${width}%`
    }


    // get
    get(){
        return this.style
    }
}