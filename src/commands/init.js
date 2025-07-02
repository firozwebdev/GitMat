const simpleGit = require("simple-git");
const chalk = require("chalk");

module.exports = async function init() {
  const git = simpleGit();
  try {
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      console.log(chalk.yellow("This directory is already a git repository."));
      return;
    }
    await git.init();
    console.log(
      chalk.green("✔ Initialized a new git repository in this directory!")
    );
  } catch (err) {
    console.error(chalk.red("Error initializing git repository:"), err.message);
  }
};
