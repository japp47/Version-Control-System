const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const zlib = require("zlib")

class HashObjectCommand {
    constructor(flag, filePath) { 
        this.flag = flag;
        this.filePath = filePath;
    }
    execute() {
        const filepath = path.resolve(this.filePath);
        if(!fs.existsSync(filepath)) {
            throw new Error(`Could not open ${filepath}: No such file or directory`);
        }
        const fileContent = fs.readFileSync(filepath);
        const fileLength = fileContent.length;
        const header = `blob ${fileLength}\0`;
        const blob = Buffer.concat([Buffer.from(header), fileContent]);
        const hash = crypto.createHash("sha1").update(blob).digest("hex");
        if(this.flag & this.flag==='-w') {
            const folder = hash.slice(0, 2);
            const file = hash.slice(2);
            const completePath = path.join(
                process.cwd(), 
                '.git', 
                'objects',
                folder
            );

            if (!fs.existsSync(completePath)) {
                fs.mkdirSync(completePath, { recursive: true });
            }
            if(!fs.existsSync(completePath)) {
                fs.mkdirSync(completePath)
            }
            const compressedData = zlib.deflateSync(blob);
            fs.writeFileSync(path.join(completePath, file),compressedData);
        }
        process.stdout.write(hash);
    }
}

module.exports = HashObjectCommand;