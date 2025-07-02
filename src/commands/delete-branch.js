const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function deleteBranch(branchArg) {
  const git = simpleGit();
  try {
    const branchSummary = await git.branchLocal();
    const current = branchSummary.current;
    const branches = branchSummary.all.filter((b) => b !== current);

    // If a branch name is provided as argument
    if (branchArg && typeof branchArg === "string") {
      const branch = branchArg.trim();
      if (!branches.includes(branch)) {
        console.log(
          chalk.red(
            `Branch '${branch}' does not exist or is the current branch.`
          )
        );
        return;
      }
      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Are you sure you want to delete branch '${branch}'?`,
          default: false,
        },
      ]);
      if (!confirm) {
        console.log(chalk.blue("Delete branch cancelled."));
        return;
      }
      await git.deleteLocalBranch(branch);
      console.log(chalk.green(`✔ Branch '${branch}' deleted.`));
      return;
    }

    // Interactive mode if no branch argument
    if (branches.length === 0) {
      console.log(
        chalk.yellow("No branches to delete (cannot delete current branch).")
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
        message: `Are you sure you want to delete branch '${branch}'?`,
        default: false,
      },
    ]);
    if (!confirm) {
      console.log(chalk.blue("Delete branch cancelled."));
      return;
    }
    await git.deleteLocalBranch(branch);
    console.log(chalk.green(`✔ Branch '${branch}' deleted.`));
  } catch (err) {
    console.error(chalk.red("Error deleting branch:"), err.message);
  }
};
