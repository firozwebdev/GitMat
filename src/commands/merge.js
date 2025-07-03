import boxen from "boxen";
import chalk from "chalk";
import simpleGit from "simple-git";
let history;
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
async function getHistory() {
  if (!history) history = (await import("./history.js")).default;
  return history;
}
export default async function mergeCommand(targetBranch) {
  const git = simpleGit();
  const inquirer = await getInquirer();
  const history = await getHistory();
  // Get current branch
  const status = await git.status();
  const currentBranch = status.current;
  // Get list of branches
  const branches = (await git.branch()).all.filter((b) => b !== currentBranch);
  let branch = targetBranch;
  if (!branch) {
    const { selected } = await inquirer.prompt([
      {
        type: "list",
        name: "selected",
        message:
          "Select branch to merge: (Use arrow keys, Enter to select, Ctrl+C to cancel)",
        choices: branches,
      },
    ]);
    branch = selected;
  }
  // Show merge summary
  const { stdout: ahead } = await git.raw([
    "rev-list",
    "--left-right",
    "--count",
    `${currentBranch}...${branch}`,
  ]);
  const [behindCount, aheadCount] = ahead.trim().split("\t");
  console.log(
    boxen(
      chalk.cyan(
        `Merging '${branch}' into '${currentBranch}'\nCommits to merge: ${behindCount}`
      ),
      { padding: 1, borderStyle: "round", borderColor: "cyan", margin: 1 }
    )
  );
  // Save pre-merge HEAD for undo
  const { stdout: preMergeHead } = await git.raw(["rev-parse", "HEAD"]);
  // Confirm merge
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Proceed with merge?`,
      default: true,
    },
  ]);
  if (!confirm) return;
  try {
    await git.merge([branch]);
    history.addAction({
      type: "merge",
      branch,
      preMergeHead: preMergeHead.trim(),
    });
    console.log(
      boxen(chalk.green(`✔ Merged '${branch}' into '${currentBranch}'`), {
        padding: 1,
        borderStyle: "round",
        borderColor: "green",
        margin: 1,
      })
    );
  } catch (err) {
    // Handle conflicts
    const mergeStatus = await git.status();
    if (mergeStatus.conflicted.length > 0) {
      console.log(
        boxen(
          chalk.red(
            `Merge conflict detected!\nConflicted files: ${mergeStatus.conflicted.join(
              ", "
            )}`
          ),
          { padding: 1, borderStyle: "round", borderColor: "red", margin: 1 }
        )
      );
      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message:
            "Resolve conflict: (Use arrow keys, Enter to select, Ctrl+C to cancel)",
          choices: [
            { name: "Abort merge", value: "abort" },
            {
              name: "Continue after resolving",
              value: "continue",
            },
          ],
        },
      ]);
      if (action === "abort") {
        await git.merge(["--abort"]);
        console.log(
          boxen(chalk.yellow("Merge aborted"), {
            padding: 1,
            borderStyle: "round",
            borderColor: "yellow",
            margin: 1,
          })
        );
      } else {
        console.log(
          boxen(
            chalk.yellow(
              "Please resolve conflicts, then run 'gmt merge' again to continue."
            ),
            {
              padding: 1,
              borderStyle: "round",
              borderColor: "yellow",
              margin: 1,
            }
          )
        );
      }
    } else {
      console.error(
        boxen(chalk.red("Merge failed: ") + err.message, {
          padding: 1,
          borderStyle: "round",
          borderColor: "red",
          margin: 1,
        })
      );
    }
  }
}
