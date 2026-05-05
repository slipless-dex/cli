import { deployments, type ChainKey } from "@slipless/deployments";

export function runDeployments(args: string[]): number {
  const [verb, ...rest] = args;
  if (verb !== "show") {
    console.error(`Usage: slipless deployments show <chain>`);
    return 64;
  }
  const [chain] = rest;
  if (!chain) {
    console.error("Available chains: " + Object.keys(deployments).join(", "));
    return 64;
  }
  const d = deployments[chain as ChainKey];
  if (!d) {
    console.error(`Slipless not deployed on ${chain}`);
    return 1;
  }
  console.log(JSON.stringify(d, null, 2));
  return 0;
}
