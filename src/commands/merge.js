const inquirer = require("inquirer");
const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");
const history = require("./history");

module.exports = async function mergeCommand(targetBranch) {
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
            `Merge conflict detected! (মার্জ কনফ্লিক্ট হয়েছে!)\nConflicted files: ${mergeStatus.conflicted.join(
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
};
