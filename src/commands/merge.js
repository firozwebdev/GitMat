import simpleGit from "simple-git";
import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";
import history from "./history.js";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
export default async function mergeCommand(targetBranch) {
  inquirer = await getInquirer();
  const git = simpleGit();
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
        message: "Select branch to merge (মার্জ করতে ব্রাঞ্চ নির্বাচন করুন)",
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
      message: `Proceed with merge? (মার্জ করতে চান?)`,
      default: true,
    },
  ]);
  if (!confirm) return;

  const spinner = ora({ text: `Merging '${branch}' into '${currentBranch}'...`, color: "cyan" }).start();
  try {
    await git.merge([branch]);
    history.addAction({
      type: "merge",
      branch,
      preMergeHead: preMergeHead.trim(),
    });
    spinner.succeed(`✔ Merged '${branch}' into '${currentBranch}'`);
  } catch (err) {
    // Handle conflicts
    const mergeStatus = await git.status();
    spinner.stop();
    if (mergeStatus.conflicted.length > 0) {
      console.log(
        boxen(
          chalk.red(
            `Merge conflict detected! (মার্জ কনফ্লিক্ট হয়েছে!)\nConflicted files: ${mergeStatus.conflicted.join(", ")}`
          ),
          { padding: 1, borderStyle: "round", borderColor: "red", margin: 1 }
        )
      );
      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Resolve conflict: (সমস্যা সমাধান করুন)",
          choices: [
            { name: "Abort merge (মার্জ বাতিল)", value: "abort" },
            {
              name: "Continue after resolving (সমাধানের পর চালিয়ে যান)",
              value: "continue",
            },
          ],
        },
      ]);
      if (action === "abort") {
        await git.merge(["--abort"]);
        console.log(
          boxen(chalk.yellow("Merge aborted (মার্জ বাতিল হয়েছে)"), {
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
