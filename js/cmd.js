window.addEventListener("load",reg);
function reg(e){
    
    let history = "COMMAND HISTORY\n";
    const inp = document.querySelector("#cmdbox");
    inp.addEventListener("keydown",run);
    function argParse(exp){
        exp = exp.split(" ");
        let cmd = exp[0];
        let args = exp.slice(1);
        return [cmd,args];
    }
    
    function curlCmd(args){
        let url = args[0];
        console.log(args);
        fetch (url)
        .then(res => res.text())
        .then(data => {
            document.querySelector("#display").innerHTML += ">>>\n"+data;
        })
        .catch(err => {
            document.querySelector("#display").value += inp.value +"\n"+err;
        console.log(err)})
    }
    function run(e){
        
     if(e.key === "Enter"){
         let result = "";
        let exp =e.target.value.toLowerCase();
        history += exp + "\n";
        exp = argParse(exp);
        let cmd = exp[0];
        let args = exp[1];
        const display = document.querySelector("#display");
         if (cmd === "clear"){
             display.innerHTML = "";
         }
         else if(cmd === "help"){
             result = "COMMAND : USAGE\n\necho: same old echo\nclear : clear output display\ninfo : display website author info\ntime : outputs device time\ncolor : changes background-color. recieves single argument <color>. example=> color blue\ncurl : a low budget curl,opens a url. example=> curl https://exp.com/\nhelp : display this help";
         }
         else if(cmd === "info"){
             result = "\nName: Michael Ayeni\nEmail: ayenimichael92@gmail.com\nBrand: granzularcodex"
             
         }
         else if(cmd === "time"){
             result = Date();
         }
         else if(cmd === "color"){
             document.querySelector("body").style.backgroundColor = args[0];
             
         }
         else if(cmd === "history"){
             result = history;
         }
         else if(cmd === "curl"){
             curlCmd(args);
         }
         else if(cmd === "echo"){
             result = args.toString();
         }
         else if(cmd === "nobash"){
             
             result = nobash(args[0]);
         }
         else{
             result = cmd +": no such command, type help to see available commands";
         }
         
         const br = document.createElement("br");
         display.innerHTML += "$_ "+inp.value;
         display.appendChild(br.cloneNode());
         display.innerHTML += result;
         display.appendChild(br.cloneNode());
         inp.value = "";
         inp.focus();
         
     }
    }
}

