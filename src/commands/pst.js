import boxen from "boxen";
import chalk from "chalk";
import simpleGit from "simple-git";

export default async function pst() {
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
}
