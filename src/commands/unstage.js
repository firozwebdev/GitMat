const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");
const history = require("./history");

module.exports = async function unstage(file) {
  const git = simpleGit();
  if (!file) {
    console.log(
      boxen(chalk.red("Please specify a file to unstage."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
    return;
  }
  // Get staged hash for the file
  let hash = null;
  try {
    const { stdout } = await git.raw(["ls-files", "--stage", file]);
    hash = stdout.split(" ")[1];
  } catch {}
  try {
    await git.reset(["HEAD", file]);
    if (hash) {
      history.addAction({ type: "unstage", file, hash });
    }
    console.log(
      boxen(chalk.green(`✔ Unstaged file: ${file}`), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error unstaging file: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
};
