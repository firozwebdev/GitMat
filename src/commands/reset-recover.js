import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import simpleGit from "simple-git";

export default async function resetRecover() {
  const git = simpleGit();
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: boxen(
        chalk.yellow(
          "Are you sure you want to recover to ORIG_HEAD? This will discard all changes."
        ),
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
      boxen(chalk.blue("Reset recovery cancelled."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "blue",
        margin: 1,
      })
    );
    return;
  }
  try {
    await git.reset(["--hard", "ORIG_HEAD"]);
    console.log(
      boxen(chalk.green("✔ Recovered to ORIG_HEAD!"), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    console.error(
      boxen(chalk.red("Error during reset recovery: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
  }
}
