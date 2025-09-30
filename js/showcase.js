window.addEventListener("load",registerEvents,false);

function f (i,text){
    let el = document.querySelector("#showcase-text");
        console.log(i);
        if(i >= text.length){return true}
    else{
        el.innerHTML += text[i];
        setTimeout(f,100,i+1,text);
    }
    }

function registerEvents(e){
    
    let text = "Welcome to Codex Lab\n ";
    f(0,text)
    
}
