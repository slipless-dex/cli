<div align="center">
  <a href="https://slipless.xyz">
    <img src=".github/logo.svg" width="140" alt="Slipless" />
  </a>
</div>

<h1 align="center">@slipless/cli</h1>

<p align="center"><strong>Devops CLI — validate tokenlists, dump positions, inspect deployments.</strong></p>

<p align="center">
  <a href="https://github.com/slipless-dex/cli/actions"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/slipless-dex/cli/ci.yml?branch=main&style=flat-square&color=5cd8ff&label=ci"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-ff6bdb?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/@slipless/cli"><img alt="npm" src="https://img.shields.io/npm/v/@slipless/cli?style=flat-square&color=b965ff&label=npm"></a>
</p>

<p align="center">
  <a href="https://slipless.xyz">Site</a> &middot;
  <a href="https://app.slipless.xyz">App</a> &middot;
  <a href="https://docs.slipless.xyz">Docs</a> &middot;
  <a href="https://twitter.com/slipless">Twitter</a>
</p>

---

```bash
npm install -g @slipless/cli
slipless --help
```

Subcommands:

```
slipless tokenlist validate <path|url>
slipless tokenlist diff <prev> <next>
slipless deployments show <chain>
slipless positions dump <account> --chain 42161 --rpc <url> --markets 0x…,0x…
```

Built on `@slipless/abi` + `@slipless/deployments` + `@slipless/token-lists` so it never drifts from the on-chain truth.

## License

MIT © Slipless Labs
