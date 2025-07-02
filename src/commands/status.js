const simpleGit = require("simple-git");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");

module.exports = async function status() {
  const prettyMs = (await import("pretty-ms")).default;
  const git = simpleGit();
  const status = await git.status();
  const log = await git.log({ n: 1 });
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
    next.push("save");
  }
  if (status.ahead > 0) {
    next.push("push");
  }
  next.push("log");
  if (log.total && log.total > 0) {
    next.push("undo");
  }
  output += chalk.gray("Next: " + next.join(" | ") + "\n");

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
};
