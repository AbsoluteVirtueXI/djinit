#!/usr/bin/env node

import fs from 'fs'
import shell from 'shelljs'

import { errorMessage, successMessage } from 'djinit/message'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

// We can't use __filename and __dirname directive anymore in esm modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get command line arguments
if (process.argv.length != 3) {
    shell.echo(
        errorMessage(
            "please use: 'npx djinit your-project-name' for creating your project."
        )
    )
    shell.exit(1)
}

const project_name = process.argv[2]

// Detect if packages or binaries are installed
if (!shell.which('git')) {
    shell.echo(errorMessage('git is required.'))
    shell.exit(1)
}

if (!shell.which('yarn')) {
    shell.echo(errorMessage('yarn is required.'))
    shell.exit(1)
}

// Initialize git project
if (shell.exec(`git init ${project_name}`).code !== 0) {
    shell.echo(errorMessage('git init failed'))
    shell.exit(1)
}
shell.echo(successMessage('git repository initilazed'))

// Initialize yarn project
shell.cd(project_name)
if (shell.exec('yarn init -y').code != 0) {
    shell.echo(errorMessage('yarn init failed'))
    shell.exit(1)
}
shell.echo(successMessage('yarn project initilazed'))

// Create project structure
if (shell.mkdir('./src').code != 0) {
    shell.echo(errorMessage('./src directory creation failed'))
    shell.exit(1)
}
if (shell.mkdir('./lib').code != 0) {
    shell.echo(errorMessage('./lib directory creation failed'))
    shell.exit(1)
}
shell.echo(successMessage('project structure created'))

// Activate ECMAScript modules in package.json
// TODO: create it conditionally based on input option parameter: -esm -cjs
let file = fs.readFileSync('package.json')
let conf = JSON.parse(file)
conf['type'] = 'module'
conf['exports'] = {}
delete conf['main']
let data = JSON.stringify(conf)
fs.writeFileSync('package.json', data)
shell.echo(successMessage('ECMAScript module is enabled'))

// Install a local version of eslint as dev dependency
if (shell.exec('yarn add eslint --dev').code != 0) {
    shell.echo(errorMessage('yarn add eslint --dev failed'))
    shell.exit(1)
}
shell.echo(successMessage('eslint package installed'))

// Install a local version of prettier as dev dependency
if (shell.exec('yarn add prettier --dev').code != 0) {
    shell.echo(errorMessage('yarn add prettier --dev failed'))
    shell.exit(1)
}
shell.echo(successMessage('prettier package installed'))

// Copy template file
if (shell.cp('-Rf', `${__dirname}/../templates/.*`, '.').code != 0) {
    shell.echo(errorMessage('Copy of configuration files failed'))
    shell.exit(1)
}
if (
    shell.cp('-Rf', `${__dirname}/../templates/gitignore`, './.gitignore')
        .code != 0
) {
    shell.echo(errorMessage('rename of gitignore to .gitignore failed'))
    shell.exit(1)
}
shell.echo(successMessage('Configuration files copied'))

// add 'first commit
if (shell.exec(`git add .`).code !== 0) {
    shell.echo(errorMessage('git add . failed'))
    shell.exit(1)
}
if (shell.exec(`git commit -m "first commit"`).code !== 0) {
    shell.echo(errorMessage('git commit -m "first commit" failed'))
    shell.exit(1)
}

shell.echo(successMessage(`Project ${project_name} is created`))
