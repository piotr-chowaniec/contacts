import { Command } from "commander";
import { rimraf } from "rimraf";

// Workspace locations from pnpm-workspace.yaml, plus the repo root.
const workspaceRoots = [".", "apps/*", "shared/*", "e2e"];

// Build artifacts and caches relative to each workspace root. Deliberately no
// deep `**` globs: on Windows they traverse pnpm's node_modules junctions and
// delete dist folders of installed packages.
const artifacts = [
  "dist",
  "build",
  ".turbo",
  ".vercel",
  ".next",
  ".nitro",
  ".output",
  ".tanstack",
  ".react-router",
  "tsconfig.tsbuildinfo",
  "node_modules/.vite",
  "test-results",
  "playwright-report",
];

const basePaths: string[] = workspaceRoots.flatMap((root) =>
  artifacts.map((artifact) => `${root}/${artifact}`)
);
const allPaths: string[] = [...basePaths, ...workspaceRoots.map((root) => `${root}/node_modules`)];

try {
  console.log("Clean workspace...");

  const program = new Command();

  program.option("-a, --all", "Clean all build files including node_modules");

  program.parse(process.argv);
  const options = program.opts<{ all?: boolean }>();

  const pathsToClean = options.all ? allPaths : basePaths;

  await rimraf(pathsToClean, { glob: true });

  console.log("Clean done...");
} catch (error) {
  console.error("Clean failed", error);
  process.exitCode = 1;
}
