# GitMate

> **Tip:** For faster usage, set up a `gm` alias for `gitmate` in your terminal! See below for how to make it permanent.

Your smart Git companion – making Git easier, faster, and more human-friendly.

---

## 🚀 Quick Alias: Use `gm` Instead of `gitmate`

### **Temporary (per session):**

```powershell
Set-Alias gm gitmate
```

### **Permanent (all PowerShell sessions):**

1. Open PowerShell and run:
   ```powershell
   if (!(Test-Path -Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }
   notepad $PROFILE
   ```
2. Add this line to the file:
   ```powershell
   Set-Alias gm gitmate
   ```
3. Save and close. Restart PowerShell. Now you can use `gm` in any session!

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

---

## 🖥️ Cross-Platform Alias Script (gm)

To use `gm` as a shortcut for `gitmate` on any OS, this project provides two scripts:

- `bin/gm` (for Linux/macOS/Unix)
- `bin/gm.cmd` (for Windows)

### **How to use:**

#### **On Linux/macOS/Unix:**

1. Copy `bin/gm` to a directory in your PATH (e.g., `/usr/local/bin`):
   ```sh
   cp bin/gm /usr/local/bin/gm
   chmod +x /usr/local/bin/gm
   ```
2. Now you can use `gm` in any terminal.

#### **On Windows:**

1. Copy `bin/gm.cmd` to a directory in your PATH (e.g., `C:\Windows` or another folder in your PATH):
   ```cmd
   copy bin\gm.cmd C:\Windows\gm.cmd
   ```
2. Now you can use `gm` in any Command Prompt or PowerShell.

---
