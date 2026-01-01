window.addEventListener("load",init);

function init(e){
    let curtain = document.querySelectorAll(".tube");
    curtain.forEach((tube)=>{
        let stars = tube.querySelectorAll(".star");
        
        function f(i){
            if (stars[i]){stars[i].classList.toggle("on");
            return setTimeout(f,100,i+1)}
            else{
                f(0);
            }
        }
        f(0);
        })
}

