'use strict'

const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")
const shell = require("shelljs")

/* Read the Configuration */
const { readFileSync } = require('fs')
const configFile = readFileSync('config.json', {encoding: 'utf-8'})
const config = JSON.parse(configFile)
/* End Of Configuration */

class Command {
    constructor () {
        this.project = null
        this.server = null
        this.command_before = null
        this.command_after = null
        this.commands = null
    }
    init () {
        console.log(
            chalk.green(
                figlet.textSync("Deploy.Man", {
                    horizontalLayout: "default",
                    verticalLayout: "default"
                })
            )
        )
        return this
    }
    async selectProject () {
        const projectMapping = config.projects.reduce((r, x) => {
            const key = `${x.name}(${x.path})`
            if (!r[key]) r[key] = x
            return r
        }, {})
        const choices = Object.keys(projectMapping)
        const message = 'Select Project To be Deploy?'
        const questions = [
            {
                type: 'list',
                name: 'project',
                message,
                choices,
                default: [
                    choices[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        this.project = projectMapping[selected.project]
        return this
    }
    /* private functions (only called from inside class) */
    async selectServerUsername (usernames) {
        const message = 'Select Username of the Server?'
        const questions = [
            {
                type: 'list',
                name: 'username',
                message,
                choices: usernames,
                default: [
                    usernames[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        return selected.username
    }
    async selectServerPath (paths) {
        const message = 'Select Path in the Server?'
        const questions = [
            {
                type: 'list',
                name: 'path',
                message,
                choices: paths,
                default: [
                    paths[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        return selected.path
    }
    /* end of private functions */
    async selectServer () {
        const serverMapping = config.servers.reduce((r, x) => {
            const key = `${x.ip}:${x.port} (${x.name})`
            if (!r[key]) r[key] = x
            return r
        }, {})
        const choices = Object.keys(serverMapping)
        const message = 'Select Destination Server?'
        const questions = [
            {
                type: 'list',
                name: 'server',
                message,
                choices,
                default: [
                    choices[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        const selectedServer = serverMapping[selected.server]
        const selectedUser = await this.selectServerUsername(selectedServer.usernames)
        const selectedPath = await this.selectServerPath(selectedServer.paths)
        this.server = {
            ip: selectedServer.ip,
            port: selectedServer.port || 22,
            user: selectedUser,
            path: selectedPath
        }
        return this
    }
    async selectCommandBeforeSend () {
        const beforeCommands = config.commands.before
        const message = 'Select Command Before Deploying To Server?'
        const questions = [
            {
                type: 'checkbox',
                name: 'beforeCommands',
                message,
                choices: beforeCommands
            }
        ]
        const selected = await inquirer.prompt(questions)
        this.command_before = selected.beforeCommands//.split(',').map(x => x.trim())
        return this
    }
    async selectCommandAfterSend () {
        const afterCommands = config.commands.after
        const message = 'Select Command After Deploying To Server?'
        const questions = [
            {
                type: 'checkbox',
                name: 'afterCommands',
                message,
                choices: afterCommands
            }
        ]
        const selected = await inquirer.prompt(questions)
        this.command_after = selected.afterCommands//.split(',').map(x => x.trim())
        return this
    }
    async build () {
        let commands = []
        if (!this.project) throw new Error('Invalid Project')
        if (!this.server) throw new Error('Invalid Server')
        if (this.command_before) {
            commands.push(`cd ${this.project.path}`)
            for (const cb of this.command_before) {
                commands.push(cb)
            }
        }
        // initial rsync
        let rsyncCommand = []
        rsyncCommand.push('rsync -azvP --progress')
        // building project
        let includes = this.project.included_files || ['.']
        // mapping port
        const serverPort = `-e "ssh -p ${this.server.port}"`
        rsyncCommand.push(serverPort)
        // mapping files/folder to be copy
        if (includes.length > 0) includes = includes.join(' ')
        if (includes) rsyncCommand.push(includes)
        // adding server address and path
        const serverAddrPath = `${this.server.user}@${this.server.ip}:${this.server.path}`
        rsyncCommand.push(serverAddrPath)
        let excludes = this.project.excluded_files || []
        if (excludes.length > 0) excludes = excludes.map(x => `--exclude ${x}`).join(' ')
        if (excludes) rsyncCommand.push(excludes)
        commands.push(rsyncCommand.join(' '))
        // after sync
        if (this.command_after) {
            for (const cf of this.command_after) {
                commands.push(cf)
            }
        }
        this.command = commands
        return this
    }
    async run () {
        if (!this.command) throw new Error('Invalid Command')
        shell.echo('Scenario: ')
        if (config.debug !== false) {
            for (const c of this.command) {
                shell.echo('- ' + c)
            }
        }
        const command = this.command.join(' && ')
        shell.echo('Start Executing...')
        if(shell.exec(command).code !== 0) {
            shell.exit(1)
        }
        shell.echo("Deployment Success!!")
        shell.exit(0)
    }
}

(async () => {
    try {
        const c = new Command().init()
        await c.selectProject()
        await c.selectServer()
        await c.selectCommandBeforeSend()
        await c.selectCommandAfterSend()
        await c.build()
        await c.run()
    } catch (err) {
        console.error(err)
    }
})()