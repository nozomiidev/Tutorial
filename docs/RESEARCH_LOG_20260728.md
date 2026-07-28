# Research log — 2026-07-28 JST

## Goal interpretation

The objective is not to demonstrate how much code an agent can write. The objective is to discover a repeatable way for an AI agent to assemble a high-quality Unity game from finished samples, licensed community assets, Editor automation, and observable tests.

The deadline supplied for this iteration was `2026-07-28 11:59 JST`. The connected GitHub account had no existing Unity project and the execution environment had no Unity Editor, Unity Hub, GUI-control surface, or activated Unity license. Therefore this iteration produced a directly runnable research bootstrap and draft integration rather than claiming a build that was never executed.

## Candidates evaluated

| Candidate | Finished game | Native match for Touhou bullet hell | Modern Unity | Low design burden | Decision |
|---|---:|---:|---:|---:|---|
| Bagoum / Danmokou, THJam13 | yes | yes | Unity 6000.0.32f1 | very high | selected |
| Unity 2D Game Kit | yes | no; exploration platformer | old tutorial baseline | medium | rejected for this goal |
| Unity Happy Harvest | yes | no; top-down farming sample | Unity 6 | low | rejected for genre mismatch |
| Unity Dragon Crashers | yes | no; idle RPG | maintained sample | low | rejected for genre mismatch |
| blank Unity project | no | no | arbitrary | none | prohibited |

## Selected completed game

- Repository: https://github.com/Bagoum/danmokou
- Locked commit: `cd21229fbce6deddfad360497ead6263c04ba6cf`
- Release context: v11.2.0 test fixes / version bump
- Unity version: `6000.0.32f1`
- Finished sample: `Assets/Danmokou/MiniProjects/Projects/THJam13`
- Existing playable release: https://bagoum.itch.io/kaimaroku

The finished game already provides a main menu, level, player, bosses, bullet patterns, two-mode mechanic, input, replay/common scenes, audio references, license display hooks, and tests. This reduces the task to selection and legal asset substitution instead of game design.

## Existing community systems selected

### Unity Editor observation

Primary candidate: https://github.com/isuzu-shiranui/UnityMCP

Reasons:

- Unity 2022.3+ and Unity 6000 support
- loopback HTTP control
- multi-Editor discovery
- Editor panel capture for Inspector / Hierarchy / Project / Console on Windows
- explicit idempotency classification
- existing Unity and TypeScript tests

Fallback: https://github.com/akiojin/unity-cli

Reasons:

- typed commands instead of blind pixel clicks
- dry-run support
- scene, asset, UI, Editor, and test APIs
- existing EditMode test command

### Unity CI

- https://github.com/game-ci/unity-test-runner (`v4`)
- https://github.com/game-ci/unity-builder (`v5.0.0`)

The workflow consumes the upstream project directly, runs its existing tests, selects existing scenes through a YAML overlay, and builds WebGL. It does not copy the upstream project into this repository or introduce gameplay code.

### Browser observation

- Playwright Test `1.62.0`
- `@yaegaki/unity-http-server` `0.0.2`

The server is purpose-built for Unity Web builds and handles compressed `.br` / `.gz` assets with the headers required by Unity. Playwright checks the Canvas, sends the completed game's existing controls, captures screenshots, and records fatal browser/WASM errors.

## Rights findings

Official Touhou derivative guideline checked: https://touhou-project.news/guideline/

Important gates:

- clearly label the work as a Touhou Project derivative
- do not imply official status
- do not extract and reuse original-game assets
- do not reuse another derivative creator's work without permission
- browser and smartphone games must be free

Candidate replacement assets found:

- Touhou Mini Pack: https://reale-ly.itch.io/touhou-mini-pack
  - non-commercial use and modification allowed
  - credit `Majstek`
  - no R-18 use
- Danmaku Sprite Pack: https://void-dancer.itch.io/danmaku-sprite
  - free under the Touhou fan-content guidelines
  - modification allowed
  - credit requested

These candidates are not bundled by this branch. Their download-time license evidence must be archived before import.

## Process improvements made during the iteration

1. **Source lock instead of vague dependency** — repository, commit, Unity version, sample, scenes, and controls are fixed.
2. **Gameplay-code budget of zero** — the agent must search existing assets or reduce scope before writing gameplay code.
3. **Build-settings overlay instead of scene reconstruction** — the original completed scenes are selected declaratively.
4. **Evidence after failure** — Unity tests may fail without preventing collection of the WebGL build and browser evidence; the workflow marks the final run failed after artifacts are preserved.
5. **Unity-aware Web server instead of generic static server** — avoids reimplementing Brotli/Gzip response headers.
6. **Structured Editor APIs before GUI pixels** — UnityMCP / unity-cli first, Inspector second, coordinate clicks last.
7. **One mutation per observation cycle** — before/after screenshots, Console count, GUIDs, and Git diff make rollback cheap.
8. **Public-release gate separate from technical success** — a working build is not considered publishable until every embedded asset is GREEN.
9. **No automatic deployment** — the workflow is manual and uploads short-lived research artifacts; it never deploys to Pages or a store.
10. **Honest execution boundary** — no Unity run or screenshot is claimed until a Unity-capable machine and license actually execute the workflow/runbook.

## Validation completed without Unity

- JavaScript syntax check: `e2e/webgl.spec.mjs` passed `node --check` on Node 22.
- JavaScript syntax check: `playwright.config.mjs` passed `node --check` on Node 22.
- Workflow YAML parsed successfully with PyYAML; the job and 17 workflow steps were present.
- Branch diff is limited to bootstrap documentation, declarative scene selection, CI, and E2E observation.
- No gameplay C#, BDSL, scene, prefab, texture, audio, or third-party binary asset was authored or copied.

## Remaining execution gates

1. Configure Unity / GameCI license secrets.
2. Run `Unity WebGL research build` manually.
3. Inspect Unity test XML and WebGL screenshots.
4. Open the project in Unity 6000.0.32f1 and capture Editor panels through UnityMCP.
5. Replace any YELLOW/RED THJam13 non-code assets using the manifest.
6. Re-run tests/E2E and complete the public release checklist.

Until those gates are complete, status is **research bootstrap ready; playable build not yet executed in this environment**.
