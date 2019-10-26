#!/usr/bin/env node
const cp = require('child_process');
const process = require("process");
const fs = require("fs");
const terminate = require('terminate');

const exec = cp.exec;
const cwd = process.cwd();
const pagesDirPath = cwd + "/src/pages";
const pagesDirExists = fs.existsSync(pagesDirPath);
const isWin = process.platform.indexOf("win") == 0;
const tty = String(
    cp.execSync('tty', {stdio:['inherit', 'pipe', 'pipe']})
);
let devServer = execute(
    "./node_modules/.bin/webpack-dev-server --open",
);
let busy = false;
let lastChangedFile;

if (pagesDirExists) {
    fs.watch(pagesDirPath, onPagesEntryChange)
}

function onPagesEntryChange(type, fileName) {
    if (busy || fileName == lastChangedFile) {
        return
    }
    busy = true;
    if (fileName.indexOf(".js") != -1 || fileName.indexOf(".ts") != -1) {
        lastChangedFile = fileName;
        console.log(fileName + " changed. restarting dev server");
        terminate(devServer.pid, () => {
            busy = false;
            devServer = execute(
                "./node_modules/.bin/webpack-dev-server",
            );
        });
    }
}

function execute(command) {
    console.log(
        command + (isWin ? "" : " > " + tty)
    );
    const proc = exec(
        command + (isWin ? "" : " > " + tty)
    );

    if (isWin) {
        proc.stdout.pipe(process.stdout);
    }
    proc.stderr.pipe(process.stderr);

    return proc
}