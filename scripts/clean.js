import { Command } from "commander";
import { rimraf } from "rimraf";

const basePaths = [
  "**/apps/**/dist",
  "**/apps/**/build",
  "**/shared/**/dist",
  "**/.turbo",
  "**/.vercel",
  "**/.next",
  "**/.vinxi",
  "**/tsconfig.tsbuildinfo",
  "**/node_modules/.vite",
];
const allPaths = [...basePaths, "**/node_modules"];

(async () => {
  try {
    console.log("Clean workspace...");

    const program = new Command();

    program.option("-a, --all", "Clean all build files including node_modules", null);

    program.parse(process.argv);
    const options = program.opts();

    const pathsToClean = options.all ? allPaths : basePaths;

    await rimraf(pathsToClean, { glob: true });

    console.log("Clean done...");
  } catch (error) {
    console.error("Clean failed", error);
  }
})();
