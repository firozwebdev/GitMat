const inquirer = require("inquirer");
const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");

module.exports = async function fetchCommand(remoteArg) {
  const git = simpleGit();
  let remotes = [];
  try {
    remotes = (await git.getRemotes(true)).map((r) => r.name);
  } catch {}
  let remote = remoteArg;
  if (!remote) {
    if (remotes.length === 0) {
      console.log(
        boxen(chalk.red("No remotes found."), {
          padding: 1,
          borderStyle: "round",
          borderColor: "red",
          margin: 1,
        })
      );
      return;
    }
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message: "Select remote to fetch:",
        choices: ["All remotes", ...remotes],
      },
    ]);
    remote = selected === "All remotes" ? null : selected;
  }
  try {
    let fetchResult;
    if (!remote) {
      fetchResult = await git.fetch();
    } else {
      fetchResult = await git.fetch(remote);
    }
    console.log(
      boxen(chalk.green("✔ Fetch complete."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
    // Show summary of changes
    const status = await git.status();
    let summary = `Current branch: ${status.current}\n`;
    if (status.behind > 0) summary += `Behind by ${status.behind} commits\n`;
    if (status.ahead > 0) summary += `Ahead by ${status.ahead} commits\n`;
    if (status.behind > 0) summary += `You may want to pull, merge, or rebase.`;
    console.log(
      boxen(chalk.cyan(summary), {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
        margin: 1,
      })
    );
  } catch (err) {
    console.log(
      boxen(chalk.red(`Error: ${err.message}`), {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
