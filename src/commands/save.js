const simpleGit = require("simple-git");
const chalk = require("chalk");

module.exports = async function save() {
  const git = simpleGit();

  try {
    await git.add(".");
    const commitSummary = await git.commit("savepoint");
    if (commitSummary.commit) {
      console.log(chalk.green("✔ All changes saved as a savepoint commit!"));
    } else {
      console.log(chalk.yellow("No changes to commit."));
    }
  } catch (err) {
    console.error(chalk.red("Error during save:"), err.message);
  }
};
