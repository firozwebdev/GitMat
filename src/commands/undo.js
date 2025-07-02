const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");
const boxen = require("boxen");

module.exports = async function undo() {
  const git = simpleGit();
  try {
    const log = await git.log();
    if (!log.total || log.total === 0) {
      console.log(
        boxen(chalk.yellow("No commits to undo."), {
          padding: 1,
          borderStyle: "round",
          borderColor: "yellow",
          margin: 1,
        })
      );
      return;
    }

    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: boxen(
          chalk.yellow(
            "Are you sure you want to undo the last commit? (soft reset)"
          ),
          {
            padding: 1,
            borderStyle: "round",
            borderColor: "yellow",
            margin: 1,
          }
        ),
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(
        boxen(chalk.blue("Undo cancelled."), {
          padding: 1,
          borderStyle: "round",
          borderColor: "blue",
          margin: 1,
        })
      );
      return;
    }

    await git.reset(["--soft", "HEAD~1"]);
    console.log(
      boxen(chalk.green("✔ Last commit has been undone (soft reset)."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error during undo: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
