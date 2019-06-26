#!/usr/bin/env node
const exec = require('child_process').exec;
const chokidar = require('chokidar');
const process = require("process");
const fs = require("fs");

const cwd = process.cwd();
const pagesDirPath = cwd + "/src/pages";
const pagesDirExists = fs.existsSync(pagesDirPath);
let devServer = execute("./node_modules/.bin/webpack-dev-server --open");

if (pagesDirExists) {
    const watcher = chokidar.watch(pagesDirPath);
    watcher.on("add", onPagesEntryChange);
    watcher.on("unlink", onPagesEntryChange);
}

function onPagesEntryChange() {
    devServer.kill();
    devServer = execute("./node_modules/.bin/webpack-dev-server");
}

function execute(command) {
    const proc = exec(command);
    proc.stdout.on('data', function (data) {
        console.log(data);
    });

    proc.stderr.on('data', function (data) {
        console.error(data.toString());
    });
    return proc
}