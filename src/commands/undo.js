const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function undo() {
  const git = simpleGit();
  const status = await git.status();

  if (status.commit.length === 0) {
    console.log(chalk.yellow("No commits to undo."));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to undo the last commit? (soft reset)",
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.blue("Undo cancelled."));
    return;
  }

  try {
    await git.reset(["--soft", "HEAD~1"]);
    console.log(chalk.green("✔ Last commit has been undone (soft reset)."));
  } catch (err) {
    console.error(chalk.red("Error during undo:"), err.message);
  }
};
