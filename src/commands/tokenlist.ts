import { readFileSync } from "node:fs";
import {
  diffTokenLists,
  fetchTokenList,
  validateTokenList,
  TokenListValidationError,
} from "@slipless/token-lists";

export async function runTokenlist(args: string[]): Promise<number> {
  const [verb, ...rest] = args;
  switch (verb) {
    case "validate":
      return validate(rest);
    case "diff":
      return diff(rest);
    default:
      console.error(`Usage: slipless tokenlist <validate|diff>`);
      return 64;
  }
}

async function validate(args: string[]): Promise<number> {
  const [target] = args;
  if (!target) {
    console.error("usage: slipless tokenlist validate <path|url>");
    return 64;
  }
  try {
    const list = await loadList(target);
    validateTokenList(list);
    console.log(`OK — ${list.tokens.length} tokens`);
    return 0;
  } catch (err) {
    if (err instanceof TokenListValidationError) {
      console.error(`Invalid: ${err.path}: ${err.message}`);
    } else {
      console.error(err instanceof Error ? err.message : String(err));
    }
    return 1;
  }
}

async function diff(args: string[]): Promise<number> {
  const [prevPath, nextPath] = args;
  if (!prevPath || !nextPath) {
    console.error("usage: slipless tokenlist diff <prev> <next>");
    return 64;
  }
  const [prev, next] = await Promise.all([loadList(prevPath), loadList(nextPath)]);
  const d = diffTokenLists(prev, next);
  console.log(`+${d.added.length} added`);
  for (const t of d.added) console.log(`  + ${t.symbol} (${t.chainId})`);
  console.log(`−${d.removed.length} removed`);
  for (const t of d.removed) console.log(`  − ${t.symbol} (${t.chainId})`);
  console.log(`~${d.changed.length} changed`);
  for (const c of d.changed) console.log(`  ~ ${c.from.symbol} → ${c.to.symbol}`);
  return 0;
}

async function loadList(target: string) {
  if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("ipfs://")) {
    return await fetchTokenList(target);
  }
  return JSON.parse(readFileSync(target, "utf8"));
}
