window.addEventListener("load",reg);
function reg(e){
    
    let history = "COMMAND HISTORY\n";
    const inp = document.querySelector("input");
    inp.addEventListener("keydown",run);
    function argParse(exp){
        exp = exp.split(" ");
        let cmd = exp[0];
        let args = exp.slice(1);
        return [cmd,args];
    }
    
    function gurlCmd(args){
        let url = args[0];
        console.log(args);
        fetch (url)
        .then(res => res.text())
        .then(data => {
            document.querySelector("textarea").value = ">>>\n"+data;
        })
        .catch(err => {
            document.querySelector("textarea").value = ">>>\n"+err;
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
        const display = document.querySelector("textarea");
         if (cmd === "clear"){
             display.value = "";
         }
         else if(cmd === "help"){
             result = "COMMAND : USAGE\n\necho: same old echo\nclear : clear output display\ninfo : display website author info\ntime : outputs device time\ncolor : changes background-color. recieves single argument <color>. example=> color blue\ngurl : a low budget curl,opens a url. example=> gurl https://exp.com/\nhelp : display this help";
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
         else if(cmd === "gurl"){
             gurlCmd(args);
         }
         else if(cmd === "echo"){
             result = args.toString();
         }
         else{
             result = cmd +": no such command, type help to see available commands";
         }
        display.value = ">>> " + result ; 
         inp.value = "";
     }
    }
}

