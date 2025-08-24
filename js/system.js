class FileKlass{
    constructor(name,dir,type){
        this.name = name;
	this.parentDir = dir;
        this.path = dir.path;
        this.content = "";
        this.type = type;
	dir.content.push(...[this]);
    }

    read(){
	    let buf="";
	    let i;
	for(i in this.content){
		console.log(this.content[i]);
		buf += this.content[i];
	}
	    return buf;
    }

    write(data){
	    this.content = data;
	    return true;
    }
    append(data){
	    this.content += data;
	    return true;
    }
    whatIs(){return "file";}


}

const RootDir = {
		name : "root",
		parentDir : null,
		childDirs : [],
		content : [],
		path : "~/",
	}; // the root dir, direct object instead of making a base class to inherit root and normal dir(probably set a flag for root).a bit of "syntatic sugar. afterall this is just experimental, and a black box approach to the idea of fileSystem,lol.
class Dir{
	static root = RootDir;
	static currentDir = Dir.root;
	static rootPath = Dir.root.path;
    
    constructor(name,parentDir){
	
	this.name = name;
	this.parentDir = parentDir;
	this.childDirs = [];
        this.content = [];
	this.path = this.name + "/";
	parentDir.content.push(...[this]);
	
       	
    }
    add(item){
        this.content.push(item);
    }
    remove(item){
        this.content.pop(item);
    }
    listContent(){
	   let buf=[];
	   for (i of this.content){
		   buf.push([,i.name])
		   console.log(i.name);
	   }
	   return buf;
   }
   whatIs(){return "dir";}
    
}

function nameExist(name,type){
	let flag;
	let dir = Dir.currentDir.content;
        for(i of dir){
		if(i.name === name && i.whatIs() === type){
			flag = true;
			break;
		    }
		else{flag = false;}
	    }
	return flag;
	
    }
function getAbsPath(dirItem){
	// dirItem can be a directory or file.
	
	let path = "~/";
	dir_chain = [];
	dir_chain.push(...[dirItem]);
	let node = dirItem.parentDir;
	
	while (true){
		if(node.name !== "root"){
			dir_chain.push(...[node]);
			node = node.parentDir;
		}
		else{
			break;
		}
	}
	dir_chain.reverse();
	for(item of dir_chain){
		if (item.whatIs()==="file"){
			continue;
		}
		else{
		path += item.path;
		}
	}
	return path;
	
	
}

function mkdir(name){

	if (nameExist(name,"dir")){throw Error("directory with name already exist: "+ name); }
	const _dir = new Dir(name,Dir.currentDir);
	return _dir;
}
function touch(name){
	if (nameExist(name,"file")){throw Error("File with name already exist: "+name)}
	let index = name.indexOf('.');
	let ext = name.slice(index);
	let type;
	if (index == -1){
		type = "unknown";
	}
	else{
		if (ext === ".txt"){type = "text"}
		else if(ext === ".nsh"){type = "nobash"}
		else{type = ext.slice(1)}

	}

	let file = new FileKlass(name,Dir.currentDir,type);
	return file;

}

function cd(newDir){
	Dir.currentDir = newDir;

}

function ls(){
	let dirList = [];
	for(item of Dir.currentDir.content){
		console.log(item.name);
		dirList.push(item.name);
	}
	return dirList;
}

function pwd(){
	return getAbsPath(Dir.currentDir);
}

/*
 * NoBash Interpreter
 * */
class Nobash{
	// nobash shell lang interpreter. authored by michael@granzularcodex 
	constructor(){
		this.output = {"log":"","errors":""};
		this.VAR = {};
	}
	init(fname){
		this.parse(fname);
	}
	parse(fname){
		// fname: file name. this method checks for the file existence and parse it if it exist, return Error if not found in current directory.
		let d =  Dir.currentDir.content;
		let item;
		let src;
		for(item of d){

			if(item.name===fname && item.whatIs()==="file"){
				src = item.content;
				break;
			}
			else{
				src = null;
			}
		}
		if(src===null){throw ReferenceError("file does not exist: " + fname)}
		else{ this.run(src.split(";"));
		}
	}

	run(src){
		// RUN
		let buff="";
		let line;
		for (line=0;line < src.length;line++){
			let exp = this.check(src[line]);
			this.execute(exp);
			
		}	
	}

	check(exp){
		// CHECK
		exp = exp.split(/\s+/);
		let opcodePattern = /\badd\b|\bsub\b|\bmul\b|\bdiv\b|\bmov\b|\bdim\b|\bout\b/i ;
		if (opcodePattern.test(exp[0]) !==true){throw SyntaxError("invalid opcode: "+exp[0])}
		let len = exp.length -1;
		if (len === 3){
			
			// for operations like add,sub...
			if(/\b[a-z]\b/i.test(exp[1]) && /\b^[a-z]|\d\b/i.test(exp[2]) && /\b^[a-z]|\d\b/i.test(exp[3])){
				return exp;
			}
			else{ throw SyntaxError("invalid trioperand : "+ exp)}
		}
		else if(len === 2){
			// for operations like mov
			if(/\b^[a-z]\b/i.test(exp[1]) && /\b\d|[a-z]\b/i.test(exp[2])){
				return exp;
			}
			else{ throw SyntaxError("invalid dioperand : "+ exp)
			}
		}
		else if(len === 1){
			// for opertions like dim
			if(/\b^[a-z]\b/i.test(exp[1])){
				return exp;
			}
			else {throw SyntaxError("invalid monooperand : "+ exp)}

		}
		else if(len == 0){
			throw SyntaxError("No operands specified");
		}
	}

	execute(exp){
		// EXECUTE
		let cmd = exp[0];
		let args = exp.slice(1);
		let len = args.length;
		let lit = (x)=>{
			if(/^\[\d+\]$/.test(x)){
				return x.split(/\W/)[1];
			}
			else if(/^\(\w+\)$/.test(x)){
				return x.split(/\W/)[1];
			}
			else if(/\b[a-z]+\b/i.test(x)){
				x=this.VAR[x];
				if(x===undefined){throw ReferenceError("variable is not declared: "+x)}
				else{return x;}
			}
			else{
				throw SyntaxError("Invalid Literal")
			}
		}
		switch (cmd.toLowerCase()){
			case "add":
				if(len !== 3){throw SyntaxError("incorrect number of argument for: "+cmd)}

				this.VAR[args[0]] = Number(lit(args[1])) + Number(lit(args[2]))
				break;

			case "sub":
				if(len !== 3){throw SyntaxError("incorrect number of argument for: "+cmd)}

				this.VAR[args[0]] = Number(lit(args[1])) - Number(lit(args[2]))
				break;

			case "mul":
				 if(len !== 3){throw SyntaxError("incorrect number of argument for: "+cmd)}

				this.VAR[args[0]] = Number(lit(args[1])) * Number(lit(args[2]))
				break;

			case "div":
				if(len !== 3){throw SyntaxError("incorrect number of argument for: "+cmd)}

				this.VAR[args[0]] = Number(lit(args[1])) / Number(lit(args[2]))
				break;

			case "mov":
				if(len !== 2){throw SyntaxError("incorrect number of argument for: "+cmd)}

				this.VAR[args[0]] = lit(args[1])
				break;

			case "out":
				if(len !== 1){throw SyntaxError("incorrect number of argument for: "+cmd)}
				this.output.log +=this.VAR[args[0]] + "\n";
				break;
			default:
				console.log("command not found");
		}
	}
// end of class
}



