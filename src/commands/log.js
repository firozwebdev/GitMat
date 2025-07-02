const simpleGit = require("simple-git");
const inquirer = require("inquirer");
const chalk = require("chalk");
const boxen = require("boxen");
const Table = require("cli-table3");

module.exports = async function logViewer(opts = {}) {
  const git = simpleGit();
  let log;
  const chalkBox = (msg, color = "cyan", title = "", borderColor = "cyan") =>
    boxen(msg, {
      padding: 1,
      borderStyle: "round",
      borderColor,
      margin: 1,
      title,
      titleAlignment: "center",
    });

  // Handle new modes
  if (opts.mode) {
    let cmd = ["log"];
    if (opts.mode === "oneline") cmd.push("--oneline");
    else if (opts.mode === "graph") cmd.push("--oneline", "--graph", "--all");
    else if (opts.mode === "file" && opts.filename) cmd.push(opts.filename);
    else if (opts.mode === "since" && opts.time)
      cmd.push(`--since="${opts.time}"`);
    else if (opts.mode === "author" && opts.author)
      cmd.push(`--author="${opts.author}"`);
    else if (opts.mode === "name-only") cmd.push("--name-only");
    else if (opts.mode === "diff") cmd.push("-p");
    else if (opts.mode === "limit" && opts.n) cmd.push(`-n`, String(opts.n));
    else if (opts.mode === "format" && opts.format)
      cmd.push(`--pretty=format:${opts.format}`);
    else cmd = null;
    if (cmd) {
      try {
        const { stdout } = await git.raw(cmd);
        console.log(
          chalkBox(
            chalk.white(stdout.length ? stdout : "No log output."),
            "cyan",
            "Git Log",
            "cyan"
          )
        );
      } catch (err) {
        console.error(
          chalkBox(
            chalk.red("Error running git log: ") + err.message,
            "red",
            "Error",
            "red"
          )
        );
      }
      return;
    }
  }

  try {
    log = await git.log({ n: 50 }); // Fetch up to 50 commits
  } catch (err) {
    console.error(
      chalkBox(
        chalk.red("Error reading git log: ") + err.message,
        "red",
        "Error",
        "red"
      )
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
      chalkBox(
        table.toString(),
        "cyan",
        `Git Log [${start + 1}-${end} of ${commits.length}]`,
        "cyan"
      )
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
    choices.push({ name: "Exit (select and press Enter)", value: "exit" });

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message:
          "Select an action: (Use arrow keys to select, Enter to confirm, Ctrl+C to quit.)",
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
        chalkBox(msg, "magenta", `Commit Details #${action + 1}`, "magenta")
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
