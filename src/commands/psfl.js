import boxen from "boxen";
import chalk from "chalk";
import simpleGit from "simple-git";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
export default async function psfl() {
  inquirer = await getInquirer();
  const git = simpleGit();
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: boxen(
        chalk.yellow("Are you sure you want to force push with lease?"),
        {
          padding: 1,
          borderStyle: "round",
          borderColor: "yellow",
          margin: 1,
        }
      ),
      default: false,
    },
  ]);
  if (!confirm) {
    console.log(
      boxen(chalk.blue("Force push with lease cancelled."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "blue",
        margin: 1,
      })
    );
    return;
  }
  try {
    await git.push(["--force-with-lease"]);
    console.log(
      boxen(chalk.green("✔ Force push with lease completed!"), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error during force push with lease: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
}
