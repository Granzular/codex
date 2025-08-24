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


class Nobash{
	// nobash shell lang interpreter. authored by michael@granzularcodex 
	
	constructor (){
		this.version = "v0.0.1";
	}
	parse(){}

}
