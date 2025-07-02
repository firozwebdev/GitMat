const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");

module.exports = async function push(remote, branch) {
  const git = simpleGit();
  try {
    if (remote && branch) {
      await git.push(remote, branch);
      console.log(
        boxen(chalk.green(`✔ Changes pushed to ${remote}/${branch}!`), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
    } else {
      await git.push();
      console.log(
        boxen(chalk.green("✔ Changes pushed to remote!"), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
    }
  } catch (err) {
    console.error(
      boxen(chalk.red("Error pushing: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
