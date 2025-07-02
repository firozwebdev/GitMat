#!/usr/bin/env node

const { program } = require("commander");
const packageJson = require("../package.json");

// Command imports (to be implemented)
const status = require("../src/commands/status");
const save = require("../src/commands/save");
const undo = require("../src/commands/undo");
const branch = require("../src/commands/branch");
const init = require("../src/commands/init");
const deleteBranch = require("../src/commands/delete-branch");
const stash = require("../src/commands/stash");
const smart = require("../src/commands/smart");
const push = require("../src/commands/push");
const remoteInit = require("../src/commands/remote-init");

program
  .name("gitmate")
  .description("Your smart Git companion")
  .version(packageJson.version);

program.command("status").description("Enhanced git status").action(status);

program
  .command("save [message]")
  .description(
    'Stage all changes and commit with the message (default: "savepoint")'
  )
  .action((message) => save(message));

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
  .command("delete-branch")
  .description("Interactively delete a local branch (excluding current)")
  .action(deleteBranch);

program
  .command("db [branch]")
  .description(
    "Delete a local branch by name (with confirmation), or interactively if not specified"
  )
  .action((branch) => deleteBranch(branch));

program
  .command("del [branch]")
  .description(
    "Delete a local branch by name (with confirmation), or interactively if not specified"
  )
  .action((branch) => deleteBranch(branch));

program
  .command("br")
  .description("Interactive branch switcher (shortcut for branch)")
  .action(branch);

program
  .command("stash")
  .description("Interactive stash manager (create, list, apply, drop)")
  .action(stash);

program
  .command("smart")
  .description("Smart contextual actions based on repo state")
  .action(smart);

program
  .command("ps [remote] [branch]")
  .description(
    "Push current branch to remote, or specify remote and branch (e.g., gmt ps origin main)"
  )
  .action((remote, branch) => push(remote, branch));

program
  .command("remote-init")
  .description(
    "Add remote, set main branch, and push to origin main (interactive)"
  )
  .action(remoteInit);

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
      '  save     Stage all changes and commit with the message (default: "savepoint")'
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
    console.log(
      "  delete-branch   Interactively delete a local branch (excluding current)"
    );
    console.log(
      "  db [branch]      Delete a local branch by name (with confirmation), or interactively if not specified"
    );
    console.log(
      "  del [branch]      Delete a local branch by name (with confirmation), or interactively if not specified"
    );
    console.log(
      "  br              Interactive branch switcher (shortcut for branch)"
    );
    console.log("  branch          Interactive branch switcher");
    console.log(
      "  stash           Interactive stash manager (create, list, apply, drop)"
    );
    console.log(
      "  smart           Smart contextual actions based on repo state"
    );
    console.log(
      "  ps [remote] [branch]  Push current branch to remote, or specify remote and branch"
    );
    console.log(
      "  remote-init      Add remote, set main branch, and push to origin main"
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
