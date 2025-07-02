const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");

module.exports = async function pst() {
  const git = simpleGit();
  try {
    await git.push(["--tags"]);
    console.log(
      boxen(chalk.green("✔ All tags pushed!"), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error pushing tags: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
