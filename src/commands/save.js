const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");

module.exports = async function save(message) {
  const git = simpleGit();
  const commitMessage =
    typeof message === "string" && message.trim() ? message : "savepoint";

  try {
    await git.add(".");
    const commitSummary = await git.commit(commitMessage);
    let msg;
    if (commitSummary.commit) {
      msg = boxen(
        chalk.green(`✔ All changes saved as a commit: "${commitMessage}"`),
        {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        }
      );
    } else {
      msg = boxen(chalk.yellow("No changes to commit."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "yellow",
        margin: 1,
      });
    }
    console.log(msg);
  } catch (err) {
    const errMsg = boxen(chalk.red("Error during save: ") + err.message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "red",
      margin: 1,
    });
    console.error(errMsg);
  }
};
