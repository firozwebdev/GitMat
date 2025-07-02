#!/usr/bin/env node

const { program } = require("commander");
const packageJson = require("../package.json");
const figlet = require('figlet');

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

program
  .command('st')
  .description('Enhanced git status (banner, box, color)')
  .action(status);
program
  .command('status')
  .description('Enhanced git status (banner, box, color)')
  .action(status);

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
    const banner = figlet.textSync('GitMate', { horizontalLayout: 'default', width: 60 });
    const cyan = (msg) => `\x1b[36m${msg}\x1b[0m`;
    const yellow = (msg) => `\x1b[33m${msg}\x1b[0m`;
    const green = (msg) => `\x1b[32m${msg}\x1b[0m`;
    const magenta = (msg) => `\x1b[35m${msg}\x1b[0m`;
    const white = (msg) => `\x1b[37m${msg}\x1b[0m`;
    console.log(`\n${cyan(banner)}`);
    console.log(magenta('Your smart Git companion\n'));
    console.log(yellow('USAGE:') + '    ' + white('gmt <command> [options]\n'));
    console.log(green('Core Commands:'));
    console.log('  ' + cyan('init') + '                Initialize a git repository');
    console.log('  ' + cyan('remote-init') + '         Add remote, set main branch, and push to origin main');
    console.log('  ' + cyan('st') + ',' + cyan(' status') + '         Enhanced git status (banner, box, color)');
    console.log('  ' + cyan('save [msg]') + '           Stage all changes and commit (default: "savepoint")');
    console.log('  ' + cyan('undo') + '                Undo last commit (with confirmation)');
    console.log('');
    console.log(green('Branch Management:'));
    console.log('  ' + cyan('br') + ',' + cyan(' branch') + '         Interactive branch switcher (table, create, switch)');
    console.log('  ' + cyan('del [branch]') + ',' + cyan(' db [branch]') + '  Delete a branch by name (with confirmation)');
    console.log('  ' + cyan('delete-branch') + '         Interactively delete a branch');
    console.log('');
    console.log(green('Stash & Smart:'));
    console.log('  ' + cyan('stash') + '               Interactive stash manager (create, list, apply, drop, view)');
    console.log('  ' + cyan('smart') + '               Smart contextual actions based on repo state');
    console.log('');
    console.log(green('Remote:'));
    console.log('  ' + cyan('ps [remote] [branch]') + '  Push current branch to remote, or specify remote and branch');
    console.log('');
    console.log(green('Other:'));
    console.log('  ' + cyan('help') + '                Show this help message');
    console.log('');
    console.log(yellow('EXAMPLES:'));
    console.log('  ' + white('gmt st'));
    console.log('  ' + white('gmt save "Initial commit"'));
    console.log('  ' + white('gmt br'));
    console.log('  ' + white('gmt del feature-branch'));
    console.log('  ' + white('gmt stash'));
    console.log('  ' + white('gmt smart'));
    console.log('  ' + white('gmt ps origin main'));
    console.log('  ' + white('gmt remote-init'));
    console.log('');
    console.log(magenta('For more details, see the README.md.'));
  });

// TODO: Add more commands here

program.parse(process.argv);
