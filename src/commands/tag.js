import chalk from "chalk";
import simpleGit from "simple-git";
import history from "./history.js";

export default async function tagHandler(toDelete = []) {
  const git = simpleGit();
  let results = "";
  for (const tag of toDelete) {
    try {
      // Get tag hash before deleting
      let hash = null;
      try {
        const { stdout } = await git.raw(["rev-list", "-n", "1", tag]);
        hash = stdout.trim();
      } catch {}
      await git.raw(["tag", "-d", tag]);
      if (hash) {
        history.addAction({ type: "tag-delete", tag, hash });
      }
      results += chalk.green(`✔ Deleted tag '${tag}'\n`);
    } catch (err) {
      results += chalk.red(`✗ Failed to delete tag '${tag}': ${err.message}\n`);
    }
  }
  if (results) console.log(results);
}
