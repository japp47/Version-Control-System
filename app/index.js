const fs = require('fs');

const path = require('path');

const  GitClient = require('./git/client');
const {
    CatFileCommand,
    HashObjectCommand,
} = require("./git/commands")

const gitClient = new GitClient();

const command = process.argv[2];
switch(command) {
    case "init":
        createGitRepo();
        break;
    case "cat-file":
        handleCatFile();
        break; 
    case "hash-object":
        handleHashObject();
        break;
    default:
        throw new Error(`Unknown command ${command}`);
}

function createGitRepo() {
    fs.mkdirSync(path.join(process.cwd(), ".git"), {recursive: true});
    fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
        recursive: true
    });
    fs.mkdirSync(path.join(process.cwd(), ".git", "re   fs"), {recursive: true});
    fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");

    console.log("Initialized Git Repository");
}

function handleCatFile() {
    const flag = process.argv[3];
    const commitSHA = process.argv[4];  
    const command = new CatFileCommand(flag, commitSHA);
    gitClient.run(command);
}

function handleHashObject() {
    let flag = process.argv[3];
    let filePath = process.argv[4];
    if(!filePath) {
        filePath = flag;
        flag = null;
    }
    const command = new HashObjectCommand(flag, filePath);
    gitClient.run(command)
}

