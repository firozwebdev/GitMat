const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");

module.exports = async function status() {
  const git = simpleGit();
  const status = await git.status();

  // Banner
  const banner = chalk.cyan(
    figlet.textSync("GitMate", { horizontalLayout: "default", width: 60 })
  );

  let output = "";
  // 'On branch:' in blue, branch name in white
  output += chalk.blue("On branch: ") + chalk.white(status.current) + "\n";
  if (status.ahead || status.behind) {
    output +=
      chalk.yellow(`Ahead: ${status.ahead}, Behind: ${status.behind}`) + "\n";
  }
  // Staged files in green
  if (status.staged.length > 0) {
    output += chalk.green("Staged files: ") + status.staged.join(", ") + "\n";
  } else {
    output += chalk.green("Staged files: ") + "None\n";
  }
  // Changed files in red
  if (status.modified.length > 0) {
    output += chalk.red("Changed files: ") + status.modified.join(", ") + "\n";
  } else {
    output += chalk.red("Changed files: ") + "None\n";
  }

  // Add a nice box around the output
  const boxed = boxen(output, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
    title: "GitMate Status",
    titleAlignment: "center",
  });

  console.log(banner + "\n" + boxed);
};
