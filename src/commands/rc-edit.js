const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const boxen = require("boxen");
const chalk = require("chalk");

module.exports = async function rcEdit() {
  const rcPath = path.resolve(process.cwd(), ".gitmaterc");
  let config = { shortcuts: {} };
  if (fs.existsSync(rcPath)) {
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
      return;
    }
  } else {
    // Create a new file with a sample shortcut
    config.shortcuts = {
      out: "git push",
    };
  }

  let editing = true;
  while (editing) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do with .gitmaterc?",
        choices: [
          { name: "Add or update a shortcut", value: "add" },
          { name: "Remove a shortcut", value: "remove" },
          { name: "View current shortcuts", value: "view" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);

    if (action === "exit") break;

    if (action === "add") {
      const { key, value } = await inquirer.prompt([
        {
          type: "input",
          name: "key",
          message: "Shortcut name (e.g., out):",
          validate: (input) =>
            input.trim() ? true : "Shortcut name cannot be empty",
        },
        {
          type: "input",
          name: "value",
          message: "Command to run (e.g., git push):",
          validate: (input) =>
            input.trim() ? true : "Command cannot be empty",
        },
      ]);
      config.shortcuts[key] = value;
      console.log(
        boxen(chalk.green(`✔ Shortcut '${key}' set to: ${value}`), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
    } else if (action === "remove") {
      const keys = Object.keys(config.shortcuts);
      if (keys.length === 0) {
        console.log(
          boxen(chalk.yellow("No shortcuts to remove."), {
            padding: 1,
            borderStyle: "round",
            borderColor: "yellow",
            margin: 1,
          })
        );
        continue;
      }
      const { key } = await inquirer.prompt([
        {
          type: "list",
          name: "key",
          message: "Select a shortcut to remove:",
          choices: keys,
        },
      ]);
      delete config.shortcuts[key];
      console.log(
        boxen(chalk.green(`✔ Shortcut '${key}' removed.`), {
          padding: 1,
          borderStyle: "round",
          borderColor: "green",
          margin: 1,
        })
      );
    } else if (action === "view") {
      const keys = Object.keys(config.shortcuts);
      if (keys.length === 0) {
        console.log(
          boxen(chalk.yellow("No shortcuts defined."), {
            padding: 1,
            borderStyle: "round",
            borderColor: "yellow",
            margin: 1,
          })
        );
      } else {
        let msg = "";
        for (const k of keys) {
          msg += chalk.cyan(k) + ": " + chalk.white(config.shortcuts[k]) + "\n";
        }
        console.log(
          boxen(msg, {
            padding: 1,
            borderStyle: "round",
            borderColor: "cyan",
            margin: 1,
            title: "Current Shortcuts",
            titleAlignment: "center",
          })
        );
      }
    }
    // Save after each change
    fs.writeFileSync(rcPath, JSON.stringify(config, null, 2));
  }
  console.log(
    boxen(chalk.green("✔ Done editing .gitmaterc!"), {
      padding: 1,
      borderStyle: "round",
      borderColor: "green",
      margin: 1,
    })
  );
};
