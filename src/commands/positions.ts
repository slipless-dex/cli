import { createPublicClient, http, type Address } from "viem";
import { PERP_ENGINE_ABI } from "@slipless/abi";
import { deploymentForChainId } from "@slipless/deployments";

/**
 * `slipless positions dump <account> --chain <id> --rpc <url>`
 *
 * Reads PerpEngine.markets and PerpEngine.positions for every market the
 * caller specifies via --markets (comma-separated bytes32 ids), or
 * defaults to a hardcoded discovery list if --markets is omitted. We don't
 * have on-chain market enumeration; downstream tooling should feed it.
 */
export async function runPositions(args: string[]): Promise<number> {
  const [verb, account, ...rest] = args;
  if (verb !== "dump" || !account) {
    console.error("usage: slipless positions dump <account> --chain <id> --rpc <url> [--markets id1,id2]");
    return 64;
  }
  const chainId = Number(flag(rest, "--chain") ?? "42161");
  const rpc = flag(rest, "--rpc");
  const marketsArg = flag(rest, "--markets");
  if (!rpc) {
    console.error("--rpc is required");
    return 64;
  }
  const deployment = deploymentForChainId(chainId);
  if (!deployment) {
    console.error(`Slipless not deployed on chain ${chainId}`);
    return 1;
  }
  const markets = (marketsArg ?? "").split(",").filter(Boolean);
  if (markets.length === 0) {
    console.error("Pass --markets <id1,id2,…> (no on-chain enumeration yet).");
    return 64;
  }
  const client = createPublicClient({ transport: http(rpc) });
  const rows = await Promise.all(markets.map(async (id) => {
    const pos = await client.readContract({
      address: deployment.perpEngine,
      abi: PERP_ENGINE_ABI,
      functionName: "positions",
      args: [account as Address, id as `0x${string}`],
    });
    return { marketId: id, ...pos };
  }));
  console.log(JSON.stringify(rows, (_k, v) => typeof v === "bigint" ? v.toString() : v, 2));
  return 0;
}

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
