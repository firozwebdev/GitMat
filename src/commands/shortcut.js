const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const boxen = require("boxen");
const chalk = require("chalk");

module.exports = async function shortcut(cmd, args) {
  const rcPath = path.resolve(process.cwd(), ".gitmaterc");
  if (!fs.existsSync(rcPath)) {
    console.error(
      boxen(chalk.red(".gitmaterc not found in this directory."), {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
    process.exit(1);
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(rcPath, "utf8"));
  } catch (err) {
    console.error(
      boxen(chalk.red("Error parsing .gitmaterc: ") + err.message, {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
    process.exit(1);
  }
  const shortcuts = config.shortcuts || {};
  if (!shortcuts[cmd]) {
    console.error(
      boxen(chalk.red(`Shortcut '${cmd}' not found in .gitmaterc.`), {
        padding: 1,
        borderStyle: "round",
        borderColor: "red",
        margin: 1,
      })
    );
    process.exit(1);
  }
  const command = shortcuts[cmd] + (args.length ? " " + args.join(" ") : "");
  console.log(
    boxen(chalk.cyan(`Running: ${command}`), {
      padding: 1,
      borderStyle: "round",
      borderColor: "cyan",
      margin: 1,
    })
  );
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(
        boxen(chalk.red("Error: ") + error.message, {
          padding: 1,
          borderStyle: "round",
          borderColor: "red",
          margin: 1,
        })
      );
      return;
    }
    if (stderr) {
      console.error(
        boxen(chalk.yellow("Stderr: ") + stderr, {
          padding: 1,
          borderStyle: "round",
          borderColor: "yellow",
          margin: 1,
        })
      );
    }
    if (stdout) {
      console.log(
        boxen(chalk.green(stdout), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
    }
  });
};
