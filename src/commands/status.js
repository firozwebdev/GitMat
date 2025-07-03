import boxen from "boxen";
import chalk from "chalk";
import figlet from "figlet";
import simpleGit from "simple-git";
import { isGitRepo } from "./utils.js";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
// Use dynamic import for command modules to avoid hoisting/circular issues
async function getSaveCmd() {
  return (await import("./save.js")).default;
}
async function getPushCmd() {
  return (await import("./push.js")).default;
}
async function getLogCmd() {
  return (await import("./log.js")).default;
}
async function getUndoCmd() {
  return (await import("./undo.js")).default;
}

export default async function status() {
  if (!isGitRepo()) {
    console.error("\x1b[31mError: Not a git repository. Please run this command inside a git project.\x1b[0m");
    process.exit(1);
  }
  const prettyMs = (await import("pretty-ms")).default;
  const git = simpleGit();
  const status = await git.status();
  let log;
  try {
    log = await git.log({ n: 1 });
  } catch (e) {
    log = { latest: null, total: 0 };
  }
  const stashes = await git.stashList();
  const remotes = await git.getRemotes(true);

  // Banner
  const banner = chalk.cyan(
    figlet.textSync("GitMate", { horizontalLayout: "default", width: 60 })
  );

  let output = "";
  // Branch and remote tracking
  output += chalk.blue("On branch: ") + chalk.white(status.current);
  if (status.tracking) {
    output += chalk.gray(` (tracking ${status.tracking})`);
  }
  output += "\n";
  output +=
    chalk.yellow(`Ahead: ${status.ahead}, Behind: ${status.behind}`) + "\n";

  // Last commit info
  if (log.latest) {
    const c = log.latest;
    const timeAgo = c.date
      ? ` (${prettyMs(Date.now() - new Date(c.date), { compact: true })} ago)`
      : "";
    output +=
      chalk.magenta("Last commit: ") +
      chalk.white(c.hash.substr(0, 7)) +
      chalk.gray(" by ") +
      chalk.green(c.author_name) +
      chalk.gray(" - ") +
      chalk.white(c.message) +
      chalk.gray(timeAgo) +
      "\n";
  }

  // Staged files
  if (status.staged.length > 0) {
    output += chalk.green("Staged files: ") + status.staged.join(", ") + "\n";
  } else {
    output += chalk.green("Staged files: ") + "None\n";
  }
  // Changed files
  if (status.modified.length > 0) {
    output += chalk.red("Changed files: ") + status.modified.join(", ") + "\n";
  } else {
    output += chalk.red("Changed files: ") + "None\n";
  }
  // Untracked files
  if (status.not_added.length > 0) {
    output +=
      chalk.yellow("Untracked files: ") + status.not_added.join(", ") + "\n";
  } else {
    output += chalk.yellow("Untracked files: ") + "None\n";
  }
  // Stash count
  output += chalk.cyan("Stashes: ") + stashes.all.length + "\n";

  // Clean/dirty indicator
  if (
    status.staged.length === 0 &&
    status.modified.length === 0 &&
    status.not_added.length === 0
  ) {
    output += chalk.green("✔ Working directory clean\n");
  } else {
    output += chalk.red("✗ You have changes\n");
  }

  // Context-aware next actions
  let next = [];
  if (
    status.staged.length > 0 ||
    status.modified.length > 0 ||
    status.not_added.length > 0
  ) {
    next.push({ name: "Save (stage & commit all changes)", value: "save" });
  }
  if (status.ahead > 0) {
    next.push({ name: "Push (upload commits to remote)", value: "push" });
  }
  next.push({ name: "Log (view commit history)", value: "log" });
  if (log.total && log.total > 0) {
    next.push({ name: "Undo (soft reset last commit)", value: "undo" });
  }

  // Add a nice box around the output
  const boxed = boxen(output, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
    title: "GitMate Status",
    titleAlignment: "center",
  });

  console.log(banner + "\n" + boxed);

  // Interactive next actions
  if (next.length > 0) {
    const inquirer = await getInquirer();
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message:
          "What would you like to do next?\n(Use arrow keys to select, Enter to confirm, Ctrl+C to quit.)",
        choices: [
          ...next,
          { name: "Exit (select and press Enter)", value: "exit" },
        ],
        loop: false,
        pageSize: 10,
      },
    ]);
    if (action === "save") {
      const { message } = await (
        await getInquirer()
      ).prompt([
        {
          type: "input",
          name: "message",
          message: "Enter a commit message:",
          default: "savepoint",
        },
      ]);
      await (
        await getSaveCmd()
      )(message);
    } else if (action === "push") {
      await (
        await getPushCmd()
      )();
    } else if (action === "log") {
      await (
        await getLogCmd()
      )();
    } else if (action === "undo") {
      await (
        await getUndoCmd()
      )();
    } else {
      // Exit
      return;
    }
  }
}
