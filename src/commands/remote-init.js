const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const chalk = require('chalk');
const boxen = require('boxen');

module.exports = async function remoteInit() {
  const git = simpleGit();
  try {
    const { remoteUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'remoteUrl',
        message: 'Enter remote repository URL:',
        validate: input => input.trim() ? true : 'Remote URL cannot be empty',
      },
    ]);
    await git.addRemote('origin', remoteUrl);
    console.log(boxen(chalk.green(`✔ Remote 'origin' added: ${remoteUrl}`), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green',
      margin: 1,
    }));
    await git.branch(['-M', 'main']);
    console.log(boxen(chalk.green(`✔ Branch renamed to 'main'`), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green',
      margin: 1,
    }));
    await git.push(['-u', 'origin', 'main']);
    console.log(boxen(chalk.green(`✔ Pushed 'main' to 'origin' and set upstream`), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green',
      margin: 1,
    }));
  } catch (err) {
    console.error(boxen(chalk.red('Error during remote init: ') + err.message, {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'red',
      margin: 1,
    }));
  }
}; 