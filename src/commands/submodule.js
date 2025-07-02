import simpleGit from "simple-git";
let inquirer;
async function getInquirer() {
  if (!inquirer) inquirer = (await import("inquirer")).default;
  return inquirer;
}
export default async function submoduleCommand() {
  inquirer = await getInquirer();
// ... replace all inquirer usage with the local variable ...
} 