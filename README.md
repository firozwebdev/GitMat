# GitMate

Your smart Git companion – making Git easier, faster, and more human-friendly.

---

## 🧩 Overview

**GitMate** is a CLI tool that wraps common Git workflows with:

- Human-friendly commands
- Interactive CLI (TUI coming soon)
- Smart presets
- Customizable behavior (via `.gitmaterc`)

---

## 🚀 Features (POC)

- Enhanced status summary: `gitmate status` / `gm status`
- Quick savepoint commit: `gitmate save` / `gm save`
- Undo last commit (with confirmation): `gitmate undo` / `gm undo`
- Interactive branch switcher: `gitmate branch` / `gm branch`
- (Alias: You can use `gm` instead of `gitmate` for all commands)

---

## 📦 File Structure

```
.gitignore
README.md
bin/
  gitmate.js         # CLI entry point
src/
  commands/
    status.js        # Enhanced status command
    save.js          # Savepoint commit command
    undo.js          # Undo last commit command
    branch.js        # Interactive branch switcher
package.json         # Project manifest
```

---

## ⚙️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Link the CLI for local use:**
   ```bash
   npm link
   ```
3. **(Optional) Set up alias for easier use:**
   In PowerShell:
   ```powershell
   Set-Alias gm gitmate
   ```
   Now you can use `gm` instead of `gitmate`.

---

## 🛠️ Usage

- `gitmate status` or `gm status`  
  Shows enhanced git status (branch, ahead/behind, staged/changed files).

- `gitmate save` or `gm save`  
  Stages all changes and commits with the message "savepoint".

- `gitmate undo` or `gm undo`  
  Prompts for confirmation, then undoes the last commit (soft reset).

- `gitmate branch` or `gm branch`  
  Interactive branch switcher. Select a branch to switch, or create a new one.

---

## 🗂️ .gitignore

The following files/folders are ignored:

- `node_modules/`
- `.env`
- `.DS_Store`
- `dist/`
- `*.log`

---

## 🏗️ Next Steps

- Add more commands: `stash`, `smart`, etc.
- Support for `.gitmaterc` config
- TUI dashboard (with Ink)
- Packaging and publishing

---

## 🙏 Credits & Inspiration

- [simple-git](https://www.npmjs.com/package/simple-git)
- [commander](https://www.npmjs.com/package/commander)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [chalk](https://www.npmjs.com/package/chalk)
- [Lazygit](https://github.com/jesseduffield/lazygit)
