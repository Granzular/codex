window.addEventListener("load",init);
let currentAudio;
function init(e){
        
document.addEventListener('click', (e) => {
    document.querySelector(".info").style.display = "none";
  if (currentAudio) {
      if (!currentAudio.paused){
    currentAudio.pause();}
      else{
          currentAudio.play();
      }
    
  }
    else{
  currentAudio = new Audio('media/eminem.mp3'); // assign here
  currentAudio.play();
    }
});
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

