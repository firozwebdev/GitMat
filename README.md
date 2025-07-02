# GitMate

> **Tip:** For faster usage, set up a `gmt` alias for `gitmate` in your terminal! See below for how to make it permanent.

Your smart Git companion – making Git easier, faster, and more human-friendly.

---

## 🚀 Quick Alias: Use `gmt` Instead of `gitmate`

### **Temporary (per session):**

```powershell
Set-Alias gmt gitmate
```

### **Permanent (all PowerShell sessions):**

1. Open PowerShell and run:
   ```powershell
   if (!(Test-Path -Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }
   notepad $PROFILE
   ```
2. Add this line to the file:
   ```powershell
   Set-Alias gmt gitmate
   ```
3. Save and close. Restart PowerShell. Now you can use `gmt` in any session!

---

## 🧩 Overview

**GitMate** is a CLI tool that wraps common Git workflows with:

- Human-friendly commands
- Interactive CLI (TUI coming soon)
- Smart presets
- Customizable behavior (via `.gitmaterc`)

---

## 🚀 Features (POC)

- Enhanced status summary: `gitmate status` / `gmt status`
- Quick savepoint commit: `gitmate save` / `gmt save`
- Undo last commit (with confirmation): `gitmate undo` / `gmt undo`
- Interactive branch switcher: `gitmate branch` / `gmt branch`
- (Alias: You can use `gmt` instead of `gitmate` for all commands)

---

## 🖥️ Cross-Platform Alias Script (gmt)

To use `gmt` as a shortcut for `gitmate` on any OS, this project provides two scripts:

- `bin/gmt` (for Linux/macOS/Unix)
- `bin/gmt.cmd` (for Windows)

### **How to use:**

#### **On Linux/macOS/Unix:**

1. Copy `bin/gmt` to a directory in your PATH (e.g., `/usr/local/bin`):
   ```sh
   cp bin/gmt /usr/local/bin/gmt
   chmod +x /usr/local/bin/gmt
   ```
2. Now you can use `gmt` in any terminal.

#### **On Windows:**

1. Copy `bin/gmt.cmd` to a directory that is already in your PATH (e.g., `C:\Windows`).

   ```cmd
   copy bin\gmt.cmd C:\Windows\gmt.cmd
   ```

   Now you can use `gmt` in any Command Prompt or PowerShell.

2. **If you want to use a custom directory (e.g., your own tools folder or your project bin):**
   - For example, to use your project bin folder: `D:\current workings\gitMate\bin`
   - Add that folder to your system PATH:
     1. Open System Properties → Advanced → Environment Variables.
     2. Under "System variables", find `Path`, select it, and click "Edit".
     3. Click "New" and add the full path: `D:\current workings\gitMate\bin`
     4. Click OK to save. Restart your terminal.
   - Now you can use `gmt` in any Command Prompt or PowerShell, from any directory.

---

## 🛠️ Commands & Usage

| Command                    | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| `gmt init`                 | Initialize a git repository                                        |
| `gmt remote-init`          | Add remote, set main branch, and push to origin main (interactive) |
| `gmt st` or `gmt status`   | Enhanced git status (banner, box, color)                           |
| `gmt save [message]`       | Stage all changes and commit (default: "savepoint")                |
| `gmt undo`                 | Undo last commit (with confirmation)                               |
| `gmt br` or `gmt branch`   | Interactive branch switcher (table, create, switch)                |
| `gmt del [branch]`         | Delete a branch by name (with confirmation)                        |
| `gmt db [branch]`          | Delete a branch by name (with confirmation)                        |
| `gmt delete-branch`        | Interactively delete a branch                                      |
| `gmt stash`                | Interactive stash manager (create, list, apply, drop, view)        |
| `gmt smart`                | Smart contextual actions based on repo state                       |
| `gmt ps [remote] [branch]` | Push current branch to remote, or specify remote and branch        |
| `gmt rc-edit`              | Create or edit .gitmaterc shortcuts interactively                  |
| `gmt <shortcut>`           | Run a custom shortcut from .gitmaterc                              |
| `gmt l` or `gmt log`       | Pretty, colorized, paginated git log with commit details           |
| `gmt help`                 | Show all commands and usage                                        |

---

## 📦 File Structure

```
.gitignore
README.md
bin/
  gitmate.js         # CLI entry point
  gmt                # Unix shortcut script
  gmt.cmd            # Windows shortcut script
src/
  commands/
    status.js        # Enhanced status command
    save.js          # Savepoint commit command
    undo.js          # Undo last commit command
    branch.js        # Interactive branch switcher
    delete-branch.js # Branch deletion command
    stash.js         # Stash management command
    smart.js         # Smart contextual actions
    push.js          # Push command
    remote-init.js   # Remote setup and push command
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
   See above for alias instructions.

---

## 🛠️ Usage

- `gitmate status`, `gmt status`, or `gmt st`  
  Shows enhanced git status (branch, ahead/behind, staged/changed files).

- `gitmate save` or `gmt save`  
  Stages all changes and commits with the message "savepoint".

- `gitmate undo` or `gmt undo`  
  Prompts for confirmation, then undoes the last commit (soft reset).

- `gitmate branch`, `gmt branch`, or `gmt br`  
  Interactive branch switcher. Select a branch to switch, or create a new one.

- `gitmate log`, `gmt log`, or `gmt l`  
  Pretty, colorized, paginated git log with commit details.

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

- Add more commands or shortcuts as needed
- Support for `.gitmaterc` config
- TUI dashboard (with Ink)
- Packaging and publishing

---

## 🙏 Credits & Inspiration

- [simple-git](https://www.npmjs.com/package/simple-git)
- [commander](https://www.npmjs.com/package/commander)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [chalk](https://www.npmjs.com/package/chalk)
- [boxen](https://www.npmjs.com/package/boxen)
- [cli-table3](https://www.npmjs.com/package/cli-table3)
- [figlet](https://www.npmjs.com/package/figlet)
- [Lazygit](https://github.com/jesseduffield/lazygit)

---
