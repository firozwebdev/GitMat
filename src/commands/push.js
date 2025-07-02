import boxen from "boxen";
import chalk from "chalk";
import simpleGit from "simple-git";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
export default async function push(remote, branch) {
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
}
