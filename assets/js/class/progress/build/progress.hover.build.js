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
            width: '0px'
        }
    }


    // on mouse move
    onMousemove(e){
        const width = e.clientX
        
        this.style.width = `${width}px`
    }


    // on mouse leave
    onMouseleave(){
        this.style.width = '0px'
    }


    // on click
    onClick(e, {audio}){
        const target = document.querySelector('.progress')
        const currentX = e.clientX
        const {width} = target.getBoundingClientRect()
        const ratio = currentX / width

        audio.currentTime = audio.duration * ratio
    }


    // get
    get(){
        return this.style
    }
}