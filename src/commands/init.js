import boxen from "boxen";
import chalk from "chalk";
import simpleGit from "simple-git";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
export default async function init() {
  const git = simpleGit();
  try {
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      console.log(
        boxen(chalk.yellow("This directory is already a git repository."), {
          padding: 1,
          borderStyle: "round",
          borderColor: "yellow",
          margin: 1,
        })
      );
      return;
    }
    await git.init();
    console.log(
      boxen(
        chalk.green("✔ Initialized a new git repository in this directory!"),
        {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        }
      )
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error initializing git repository: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
}
