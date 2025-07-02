const simpleGit = require('simple-git');
const inquirer = require('inquirer');
const chalk = require('chalk');
const boxen = require('boxen');

module.exports = async function psd(branch) {
  const git = simpleGit();
  if (!branch) {
    console.error(boxen(chalk.red('Please specify a branch to delete from remote.'), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'red',
      margin: 1,
    }));
    return;
  }
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: boxen(chalk.yellow(`Are you sure you want to delete remote branch '${branch}'?`), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'yellow',
        margin: 1,
      }),
      default: false,
    },
  ]);
  if (!confirm) {
    console.log(boxen(chalk.blue('Remote branch deletion cancelled.'), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue',
      margin: 1,
    }));
    return;
  }
  try {
    await git.push(['origin', '--delete', branch]);
    console.log(boxen(chalk.green(`✔ Remote branch '${branch}' deleted!`), {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'green',
      margin: 1,
    }));
  } catch (err) {
    console.error(boxen(chalk.red('Error deleting remote branch: ') + err.message, {
      padding: 1,
      borderStyle: 'round',
      borderColor: 'red',
      margin: 1,
    }));
  }
}; 