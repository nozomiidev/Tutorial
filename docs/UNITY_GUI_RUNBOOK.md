# Unity GUI / mycomputeruse runbook

対象: `Bagoum/danmokou@cd21229fbce6deddfad360497ead6263c04ba6cf`

目的は、人間または AI エージェントが Unity Editor を闇雲にクリックせず、既存の完成品を観測可能な小さい操作で差し替えることです。

## 0. 原則

- **構造化 API > Inspector の既存フィールド > GUI 座標クリック > 新規コード** の順で選ぶ。
- 1 回に 1 変更だけ行う。
- 変更前後に Hierarchy / Inspector / Project / Console のスクリーンショットを残す。
- GUI で作った結果は scene / prefab / ScriptableObject / ProjectSettings の差分で検証する。
- Console error が 1 件でも増えたらその変更を戻す。
- 存在しない機能を実装するのではなく、完成済み prefab / asset / scene を探し直す。
- ゲームプレイ用 C# / BDSL を書かない。

## 1. ソース取得

```bash
git clone --filter=blob:none --recurse-submodules https://github.com/Bagoum/danmokou.git game
cd game
git checkout cd21229fbce6deddfad360497ead6263c04ba6cf
git submodule update --init --recursive
git lfs pull
cp ../overlay/ProjectSettings/EditorBuildSettings.asset ProjectSettings/EditorBuildSettings.asset
```

検証:

```bash
test "$(git rev-parse HEAD)" = "cd21229fbce6deddfad360497ead6263c04ba6cf"
grep 'm_EditorVersion: 6000.0.32f1' ProjectSettings/ProjectVersion.txt
```

## 2. Unity Editor 起動

1. Unity Hub で `6000.0.32f1` と WebGL Build Support を導入。
2. `game/` を開く。
3. import と compile が完全に終わるまで、シーンを編集しない。
4. Console を Clear し、再コンパイル後の error 数を記録。
5. `Assets/Danmokou/MiniProjects/Projects/THJam13/THJ13 Main Menu.unity` を開く。
6. Play して既存状態のスクリーンショットを採る。

初回基準スクリーンショット:

- `artifacts/<JST>/editor/00-main-menu-game.png`
- `artifacts/<JST>/editor/01-main-menu-hierarchy.png`
- `artifacts/<JST>/editor/02-main-menu-inspector.png`
- `artifacts/<JST>/editor/03-console-clean.png`

## 3. UnityMCP を観測層として追加

候補: https://github.com/isuzu-shiranui/UnityMCP

Package Manager:

1. `Window > Package Manager`
2. `+ > Add package from git URL...`
3. `https://github.com/isuzu-shiranui/UnityMCP.git?path=jp.shiranui-isuzu.unity-mcp`
4. `Edit > Preferences > Unity MCP` で loopback のみを確認。

疎通:

```bash
curl --fail http://127.0.0.1:27182/health
```

Windows での Editor panel capture 例:

```bash
curl -X POST http://127.0.0.1:27182/capture_screenshot \
  -H 'Content-Type: application/json' \
  -d '{"view":"inspector","maxSize":1600}'
```

安全設定:

- listener は `127.0.0.1` のままにする。
- 任意 C# 実行 endpoint は通常無効にする。
- mutation は Safe / Unsafe の分類を確認する。
- 失敗時に Unsafe 操作を自動再送しない。
- 複数 Editor 起動時は project target を明示する。

UnityMCP を導入できない場合は `akiojin/unity-cli` の typed tool と dry-run を使い、GUI 座標操作は最後の手段にします。

## 4. 変更単位の固定フロー

各 asset 差し替えは必ず次の順序で行います。

1. **Locate**: Project 検索で既存 asset / prefab / metadata を特定。
2. **Snapshot before**: Inspector と Game view を保存。
3. **Record**: GUID、file path、現在の参照先、Console error 数を JSON に記録。
4. **Mutate once**: Inspector の参照フィールドを 1 個だけ変更。
5. **Save**: Unity の Save Project を実行。
6. **Compile/refresh**: import 完了を待つ。
7. **Console check**: 新規 error がないことを確認。
8. **Play smoke**: 既存メニューまたはレベルを 30 秒動かす。
9. **Snapshot after**: 同じ view / 解像度で保存。
10. **Diff**: Git diff と before/after 画像を確認。
11. **Accept or rollback**: 期待した参照だけ変化した場合に限り採用。

## 5. 差し替え順序

機能を壊しにくい順に固定します。

1. title / disclaimer / credit 文言
2. main menu の静止画
3. player の静止 sprite
4. player animation clip 内の sprite
5. boss metadata の portrait / sprite
6. bullet texture
7. background texture / material
8. SFX clip
9. BGM track

入力、弾幕、敵配置、当たり判定、タイマー、難易度値は触りません。

## 6. mycomputeruse 用の観測契約

各操作は次の JSON 相当の記録を持ちます。

```json
{
  "run_id": "20260728T113000+0900",
  "step": "replace-player-sprite",
  "project": "Danmokou",
  "unity": "6000.0.32f1",
  "scene": "THJ13 Main Menu",
  "object_path": "Hierarchy/path/or/asset/path",
  "field": "serialized field name",
  "before_guid": "...",
  "after_guid": "...",
  "console_errors_before": 0,
  "console_errors_after": 0,
  "screenshots": ["before.png", "after.png"],
  "git_diff": "diff.patch",
  "result": "accepted|rolled_back"
}
```

保存規約:

```text
artifacts/<run_id>/
  manifest.json
  editor/
    hierarchy-before.png
    inspector-before.png
    game-before.png
    hierarchy-after.png
    inspector-after.png
    game-after.png
    console-after.png
  diffs/
    unity-assets.patch
  tests/
  webgl/
  e2e/
```

## 7. Editor 内テスト

Danmokou 既存テストを先に使います。

- EditMode: `Assets/Plugins/Danmokou/Testing/Tests`
- PlayMode: `Assets/Plugins/Self/Testing/PlayTests`
- test scenes: `Assets/Scenes/Testing`

Unity Test Runner で EditMode → PlayMode の順に実行し、XML と Console を保存します。個別 asset 差し替えのたびに全テストを回すのではなく、30 秒 Play smoke を行い、まとまりごとに既存テスト一式を実行します。

## 8. ローカル WebGL

1. Build Profiles / Build Settings で WebGL を選択。
2. `ProjectSettings/EditorBuildSettings.asset` の先頭 enabled scene が `THJ13 Main Menu.unity` であることを確認。
3. Development Build は診断時だけ使用。
4. Build And Run 後、Chrome で Canvas が表示されることを確認。
5. Arrow / Z / Shift / Space を順に入力。
6. loading、起動、入力後、ゲームプレイのスクリーンショットを保存。
7. Browser Console と Unity log に致命的エラーがないことを確認。

## 9. 合格基準

- Main Menu が最初に起動する。
- Menu から THJ13 Level に到達する。
- Arrow: 移動、Z: shot、Shift: focus、Space: mode switch が反応する。
- Canvas の実寸が 640×360 以上。
- Chromium で WebAssembly abort / RuntimeError / out-of-memory がない。
- Console error が基準値より増えない。
- 起動と入力後のスクリーンショットが 2 枚以上残る。
- ライセンス画面または同梱文書へ到達できる。

## 10. 改善ループ

各実験後に、操作回数ではなく次を記録します。

- 手動クリック数
- API / Inspector で完了した割合
- rollback 回数
- import / compile 待ち時間
- test / build / E2E の成功率
- 変更されたファイル数
- 新規コード行数（目標 0）

次の実験では、最も多かった手動クリックを既存 API または preset に置き換えます。新しい自動化コードを書く前に、UnityMCP、unity-cli、Unity Test Framework、GameCI、Playwright の既存機能を再検索します。
