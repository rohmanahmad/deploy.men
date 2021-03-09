'use strict'

const inquirer = require("inquirer")
const chalk = require("chalk")
const figlet = require("figlet")
const shell = require("shelljs")

const nodeTargets = {
    "Node 14 LTS": "node14",
    "Node 12 LTS": "node12",
    "Node 10 LTS": "node10",
    "Node 8 LTS": "node8"
}
const osTargets = {
    'linux': 'linux',
    'osx': 'osx',
    'windows': 'win'
}
const archTargets = {
    '64 bit': 'x64',
    '32 bit': 'x32'
}

class Command {
    constructor () {
        this.command = {}
    }
    init () {
        console.log(
            chalk.green(
                figlet.textSync("Build . Sh", {
                    horizontalLayout: "default",
                    verticalLayout: "default"
                })
            )
        )
        return this
    }
    async selectOS () {
        const os = Object.keys(osTargets)
        const message = 'Select Operating System Target?'
        const questions = [
            {
                type: 'checkbox',
                name: 'os',
                message,
                choices: os,
                default: [
                    os[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        const selectedOS = selected.os.map(x => osTargets[x])
        this.command.os = selectedOS
        return this
    }
    async selectArc () {
        const architechtures = Object.keys(archTargets)
        const message = 'Select Architechture Target?'
        const questions = [
            {
                type: 'checkbox',
                name: 'arc',
                message,
                choices: architechtures,
                default: [
                    architechtures[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        const selectedArc = selected.arc.map(x => archTargets[x])
        this.command.arc = selectedArc
        return this
    }
    async selectNode () {
        const node = Object.keys(nodeTargets)
        const message = 'Select Node Version?'
        const questions = [
            {
                type: 'checkbox',
                name: 'node',
                message,
                choices: node,
                default: [
                    node[0]
                ]
            }
        ]
        const selected = await inquirer.prompt(questions)
        const selectedNode = selected.node.map(x => nodeTargets[x])
        this.command.node = selectedNode
        return this
    }

    build () {
        if (!this.command) throw new Error('Invalid Command')
        let scenarios = [
            {
                title: 'Change Version Of NVM to Minimum Requirement',
                command: 'nvm install 10'
            },
            {
                title: 'Installing pkg dependency',
                command: 'npm i -g pkg'
            }
        ]
        shell.echo('Preparing Target Builders...')
        for (const node of this.command.node) {
            for (const os of this.command.os) {
                for (const arc of this.command.arc) {
                    const target = `${node}-${os}-${arc}`
                    shell.echo('-' + target)
                    scenarios.push({
                        title: `Installing ${target}`,
                        command: `pkg --target ${target} --public -o /tmp/deploy.man-${os}${arc} .`
                    })
                }
            }
        }
        this.scenarios = scenarios
        return this
    }

    run () {
        // for (const sc of this.scenarios) {
        //     shell.echo(sc.title)
        //     if (shell.exec(sc.command).code !== 0) shell.exit(1)
        // }
            shell.exec('source ~/.bashrc && source ~/.bash_profile')
            shell.exec('nvm use 10')
        // if (shell.exec('sh ./tes.sh').code !== 0) shell.exit(1)
    }
}

(async () => {
    const c = new Command().init()
    await c.selectNode()
    await c.selectOS()
    await c.selectArc()
    c.build()
    c.run()
})()