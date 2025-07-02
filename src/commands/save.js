const simpleGit = require("simple-git");
const chalk = require("chalk");

module.exports = async function save(message) {
  const git = simpleGit();
  const commitMessage =
    typeof message === "string" && message.trim() ? message : "savepoint";

  try {
    await git.add(".");
    const commitSummary = await git.commit(commitMessage);
    if (commitSummary.commit) {
      console.log(
        chalk.green(`✔ All changes saved as a commit: "${commitMessage}"`)
      );
    } else {
      console.log(chalk.yellow("No changes to commit."));
    }
  } catch (err) {
    console.error(chalk.red("Error during save:"), err.message);
  }
};
