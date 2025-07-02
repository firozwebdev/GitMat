#!/usr/bin/env node

const { program } = require("commander");
const packageJson = require("../package.json");

// Command imports (to be implemented)
const status = require("../src/commands/status");
const save = require("../src/commands/save");
const undo = require("../src/commands/undo");
const branch = require("../src/commands/branch");
const init = require("../src/commands/init");

program
  .name("gitmate")
  .description("Your smart Git companion")
  .version(packageJson.version);

program.command("status").description("Enhanced git status").action(status);

program.command("save").description("Quick savepoint commit").action(save);

program
  .command("undo")
  .description("Undo last commit (soft reset)")
  .action(undo);

program
  .command("branch")
  .description("Interactive branch switcher")
  .action(branch);

program
  .command("init")
  .description("Initialize a new git repository in the current directory")
  .action(init);

program
  .command("help")
  .description("Show detailed help and usage for all commands")
  .action(() => {
    console.log(`\nGitMate (gm) - Your smart Git companion\n`);
    console.log("Usage: gm <command> [options]\n");
    console.log("Commands:");
    console.log(
      "  status   Show enhanced git status (branch, ahead/behind, staged/changed files)"
    );
    console.log(
      '  save     Stage all changes and commit with the message "savepoint"'
    );
    console.log(
      "  undo     Undo the last commit (soft reset) with confirmation"
    );
    console.log(
      "  branch   Interactive branch switcher (select or create branch)"
    );
    console.log(
      "  init     Initialize a new git repository in the current directory"
    );
    console.log("  help     Show this help message");
    console.log("\nExamples:");
    console.log("  gm status");
    console.log("  gm save");
    console.log("  gm undo");
    console.log("  gm branch");
    console.log("\nFor more details, see the README.md.");
  });

// TODO: Add more commands here

program.parse(process.argv);
