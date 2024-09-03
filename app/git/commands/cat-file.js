const path  = require("path");
const fs = require("fs");
const zlib = require("zlib");
class CatFileCommand {
    constructor(flag, commitSHA) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    }
    execute() {
        const flag = this.flag;
        const commitSHA = this.commitSHA;

        switch(flag) {
            case "-p":
                {
                    const folder = commitSHA.slice(0, 2);
                    const file = commitSHA.slice(2);
                    const filePath = path.join(
                        process.cwd(), 
                        ".git",
                        "objects",
                        folder,
                        file
                    );
                    if(!fs.existsSync(filePath)) {
                        throw new Error(`Not a valid object name ${commitSHA}`);
                    }
                    const fileContent = fs.readFileSync(filePath);
                    const fileBuffer = zlib.inflate(fileContent);

                    const output = fileBuffer.toString().split("\x00")[1];
                    process.stdout.write(output);

                }
                break;
        }
    }
}
module.exports = CatFileCommand;