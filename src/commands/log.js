const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");
const boxen = require("boxen");
const Table = require("cli-table3");

module.exports = async function logViewer() {
  const git = simpleGit();
  let log;
  try {
    log = await git.log({ n: 50 }); // Fetch up to 50 commits
  } catch (err) {
    console.error(
      boxen(chalk.red("Error reading git log: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
    return;
  }

  const commits = log.all;
  const pageSize = 10;
  let page = 0;
  let exit = false;

  while (!exit) {
    const start = page * pageSize;
    const end = Math.min(start + pageSize, commits.length);
    const table = new Table({
      head: [
        chalk.cyan("Index"),
        chalk.cyan("Hash"),
        chalk.cyan("Author"),
        chalk.cyan("Date"),
        chalk.cyan("Message"),
      ],
      style: { head: [], border: [] },
      chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
    });
    for (let i = start; i < end; i++) {
      const c = commits[i];
      table.push([
        chalk.yellow(i + 1),
        chalk.white(c.hash.substr(0, 7)),
        chalk.green(c.author_name),
        chalk.gray(new Date(c.date).toLocaleString()),
        chalk.white(c.message),
      ]);
    }
    console.log(
      boxen(table.toString(), {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
        margin: 1,
        title: `Git Log [${start + 1}-${end} of ${commits.length}]`,
        titleAlignment: "center",
      })
    );

    const choices = [];
    if (page > 0) choices.push({ name: "Previous page", value: "prev" });
    if (end < commits.length)
      choices.push({ name: "Next page", value: "next" });
    for (let i = start; i < end; i++) {
      choices.push({
        name: `View details for #${i + 1} (${commits[i].hash.substr(0, 7)})`,
        value: i,
      });
    }
    choices.push({ name: "Exit", value: "exit" });

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Select an action:",
        choices,
        pageSize: 15,
      },
    ]);

    if (action === "next") {
      page++;
    } else if (action === "prev") {
      page--;
    } else if (action === "exit") {
      exit = true;
    } else if (typeof action === "number") {
      const c = commits[action];
      let msg = "";
      msg += chalk.yellow("Commit: ") + chalk.white(c.hash) + "\n";
      msg +=
        chalk.yellow("Author: ") +
        chalk.green(c.author_name) +
        " <" +
        chalk.green(c.author_email) +
        ">\n";
      msg +=
        chalk.yellow("Date: ") +
        chalk.gray(new Date(c.date).toLocaleString()) +
        "\n";
      msg += chalk.yellow("Message: ") + chalk.white(c.message) + "\n";
      msg += chalk.yellow("Refs: ") + chalk.cyan(c.refs || "-") + "\n";
      // Show diff for this commit
      try {
        const { stdout } = await git.raw(["show", "--stat", "--color", c.hash]);
        msg += "\n" + chalk.white(stdout);
      } catch (err) {
        msg += "\n" + chalk.red("Error loading diff: ") + err.message;
      }
      console.log(
        boxen(msg, {
          padding: 1,
          borderStyle: "round",
          borderColor: "magenta",
          margin: 1,
          title: `Commit Details #${action + 1}`,
          titleAlignment: "center",
        })
      );
      // Wait for user to continue
      await inquirer.prompt([
        {
          type: "input",
          name: "cont",
          message: "Press Enter to return to log...",
        },
      ]);
    }
  }
};
