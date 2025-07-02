const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = async function branch() {
  const git = simpleGit();
  const branchSummary = await git.branchLocal();
  const branches = branchSummary.all;
  const current = branchSummary.current;

  const choices = [
    ...branches.map((b) => ({
      name: b === current ? `${b} (current)` : b,
      value: b,
      short: b,
      disabled: b === current ? "Current branch" : false,
    })),
    new inquirer.Separator(),
    { name: "Create new branch...", value: "__create__" },
  ];

  const { selected } = await inquirer.prompt([
    {
      type: "list",
      name: "selected",
      message: "Select a branch to switch to:",
      choices,
      pageSize: 10,
    },
  ]);

  if (selected === "__create__") {
    const { newBranch } = await inquirer.prompt([
      {
        type: "input",
        name: "newBranch",
        message: "Enter new branch name:",
        validate: (input) =>
          input.trim() ? true : "Branch name cannot be empty",
      },
    ]);
    try {
      await git.checkoutLocalBranch(newBranch);
      console.log(chalk.green(`✔ Switched to new branch '${newBranch}'`));
    } catch (err) {
      console.error(chalk.red("Error creating branch:"), err.message);
    }
  } else {
    try {
      await git.checkout(selected);
      console.log(chalk.green(`✔ Switched to branch '${selected}'`));
    } catch (err) {
      console.error(chalk.red("Error switching branch:"), err.message);
    }
  }
};
