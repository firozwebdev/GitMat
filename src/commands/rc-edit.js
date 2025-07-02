import { spawnSync } from "child_process";

export default async function rcEdit() {
  // Run the Ink TUI directly using npm run rc-edit
  const result = spawnSync("npm", ["run", "rc-edit"], {
    stdio: "inherit",
    shell: true,
  });

  // Exit with the same code as the child process
  process.exit(result.status || 0);
}
