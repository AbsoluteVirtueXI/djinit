#!/usr/bin/env node

const chalk = require('chalk')
const shell = require('shelljs')

if (!shell.which('git')) {
  shell.echo(chalk.red('Error: Sorry, this script requires git'))
  shell.exit(1)
}

if (!shell.which('yarn')) {
  shell.echo(chalk.red('Error: Sorry, this script requires yarn'))
  shell.exit(1)
}

if (shell.exec('git init prout').code !== 0) {
  shell.echo(chalk.red('Error: git init failed'))
  shell.exit(1)
}
shell.echo(chalk.green('Success: Git repository initilazed'))

shell.cd('prout')
if (shell.exec('yarn init -y').code != 0) {
  shell.echo(chalk.red('Error: yarn init failed'))
  shell.exit(1)
}
shell.echo(chalk.green('Success: project initilazed'))
shell.cp('-Rf', `${__dirname}/../templates/.*`, '.')
