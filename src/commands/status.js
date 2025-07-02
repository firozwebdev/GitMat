const simpleGit = require("simple-git");
const chalk = require("chalk");

module.exports = async function status() {
  const git = simpleGit();
  const status = await git.status();

  console.log(chalk.green(`On branch: ${status.current}`));
  if (status.ahead || status.behind) {
    console.log(
      chalk.yellow(`Ahead: ${status.ahead}, Behind: ${status.behind}`)
    );
  }
  console.log(chalk.blue("Staged files:"), status.staged.join(", ") || "None");
  console.log(
    chalk.blue("Changed files:"),
    status.modified.join(", ") || "None"
  );
  // Add more info as needed
};
