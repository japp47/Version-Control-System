const path  = require("path");
const fs = require("fs");
const zlib = require("zlib");

class LsTreeCommand {
    constructor(flag, commitSHA) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    }
    execute() {
        const flag = this.flag;
        const commitSHA = this.commitSHA;

        const folder = commitSHA.slice(0,2);
        const file = commitSHA.slice(2);

        const folderPath = path.join(process.cwd(), ".git", "objects", folder);
        const filePath = path.join(folderPath, file);

        if(!fs.existsSync(folderPath)) throw new Error(`Not a valid object name ${commitSHA}`);
        if(!fs.existsSync(filePath)) throw new Error(`Not a valid object name ${commitSHA}`);
        const fileContent = fs.readFileSync(filePath);
        const decompressedContent = zlib.inflateSync(fileContent);
        const output = decompressedContent.toString().split("\0");
        const treecontent = output.slice(1).filter((e)=>e.includes(" "));
        treecontent.forEach((e) => {
            const [modeType, name] = e.split(" ");
            const mode = modeType.slice(0,6);
            const type = modeType.slice(6,10) === "blob"? "blob":"tree";
            const hash = modeType.slice(10);

            if(flag === "--name-only") {
                process.stdout.write(`${name}\n`);
            } else{
                process.stdout.write(`${mode} ${type} ${hash} ${name}\n`);
            }
        });
    }
}
module.exports = LsTreeCommand