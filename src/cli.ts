#!/usr/bin/env node
/**
 * Slipless devops CLI. Subcommand-router with no third-party dependency
 * — keeps the binary small and the install fast.
 *
 *   slipless tokenlist validate <path|url>
 *   slipless tokenlist diff <prev> <next>
 *   slipless deployments show <chain>
 *   slipless positions dump <account> --rpc <url> --chain <id>
 */

import { existsSync, readFileSync } from "node:fs";

import { runTokenlist } from "./commands/tokenlist.js";
import { runDeployments } from "./commands/deployments.js";
import { runPositions } from "./commands/positions.js";

async function main(argv: string[]): Promise<number> {
  const [, , subject, ...rest] = argv;
  switch (subject) {
    case "tokenlist": return runTokenlist(rest);
    case "deployments": return runDeployments(rest);
    case "positions": return runPositions(rest);
    case "version":
    case "--version":
    case "-v":
      printVersion();
      return 0;
    case undefined:
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return 0;
    default:
      console.error(`Unknown subcommand: ${subject}`);
      printHelp();
      return 64;
  }
}

function printHelp(): void {
  console.log(`Usage: slipless <subcommand> [args]

Subcommands:
  tokenlist validate <path|url>     Validate a tokenlist against the Slipless schema.
  tokenlist diff <prev> <next>      Diff two tokenlists.
  deployments show <chain>          Print canonical addresses for a chain.
  positions dump <account>          Print all open positions for an account.

  help, --help, -h                  Show this help.
  version, --version, -v            Print version.
`);
}

function printVersion(): void {
  // Read our own package.json — works in dev (.ts) and prod (.js) builds.
  const pkgPath = new URL("../package.json", import.meta.url);
  const file = pkgPath.protocol === "file:" ? pkgPath.pathname.replace(/^\/([A-Z]:)/, "$1") : "";
  if (file && existsSync(file)) {
    const pkg = JSON.parse(readFileSync(file, "utf8")) as { version: string };
    console.log(`slipless ${pkg.version}`);
  } else {
    console.log("slipless");
  }
}

main(process.argv).then((code) => process.exit(code), (err) => {
  console.error(err);
  process.exit(1);
});
