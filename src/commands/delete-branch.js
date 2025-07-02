const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");
const boxen = require("boxen");
const Table = require("cli-table3");

module.exports = async function deleteBranch(branchArg) {
  const git = simpleGit();
  try {
    const branchSummary = await git.branchLocal();
    const current = branchSummary.current;
    const branches = branchSummary.all.filter((b) => b !== current);

    // Show branch list as a table if interactive
    if (!branchArg) {
      const table = new Table({
        head: [chalk.cyan("Branch")],
        style: { head: [], border: [] },
        chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
      });
      branches.forEach((b) => {
        table.push([b]);
      });
      if (branches.length > 0) {
        console.log(
          boxen(table.toString(), {
            padding: 1,
            borderStyle: "round",
            borderColor: "cyan",
            margin: 1,
            title: "Deletable Branches",
            titleAlignment: "center",
          })
        );
      }
    }

    // If a branch name is provided as argument
    if (branchArg && typeof branchArg === "string") {
      const branch = branchArg.trim();
      if (!branches.includes(branch)) {
        console.log(
          boxen(
            chalk.red(
              `Branch '${branch}' does not exist or is the current branch.`
            ),
            {
              padding: 1,
              borderStyle: "round",
              borderColor: "red",
              margin: 1,
            }
          )
        );
        return;
      }
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: boxen(
            chalk.yellow(`Are you sure you want to delete branch '${branch}'?`),
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
          boxen(chalk.blue("Delete branch cancelled."), {
            padding: 1,
            borderStyle: "round",
            borderColor: "blue",
            margin: 1,
          })
        );
        return;
      }
      await git.deleteLocalBranch(branch);
      console.log(
        boxen(chalk.green(`✔ Branch '${branch}' deleted.`), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
      return;
    }

    // Interactive mode if no branch argument
    if (branches.length === 0) {
      console.log(
        boxen(
          chalk.yellow("No branches to delete (cannot delete current branch)."),
          {
            padding: 1,
            borderStyle: "round",
            borderColor: "yellow",
            margin: 1,
          }
        )
      );
      return;
    }
    const { branch } = await inquirer.prompt([
      {
        type: "list",
        name: "branch",
        message: "Select a branch to delete:",
        choices: branches,
      },
    ]);
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: boxen(
          chalk.yellow(`Are you sure you want to delete branch '${branch}'?`),
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
        boxen(chalk.blue("Delete branch cancelled."), {
          padding: 1,
          borderStyle: "round",
          borderColor: "blue",
          margin: 1,
        })
      );
      return;
    }
    await git.deleteLocalBranch(branch);
    console.log(
      boxen(chalk.green(`✔ Branch '${branch}' deleted.`), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error deleting branch: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
