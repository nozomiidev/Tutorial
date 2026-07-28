# Unity / Touhou zero-design bootstrap

このブランチは、ゲームを一から設計・実装するためのリポジトリではありません。完成済みの Unity 弾幕ゲームを固定し、既存のシーン・ScriptableObject・素材・テストを組み替えるための薄いブートストラップです。

## 採用済みベース

- Upstream: `Bagoum/danmokou`
- Commit: `cd21229fbce6deddfad360497ead6263c04ba6cf`（v11.2.0）
- Unity: `6000.0.32f1`
- 完成済みゲーム: `Assets/Danmokou/MiniProjects/Projects/THJam13`
- 起動シーン: `THJ13 Main Menu.unity`
- プレイシーン: `THJ13 Level.unity`

## このリポジトリが追加するもの

- 既存 THJam13 シーンだけを選ぶ宣言的 Build Settings オーバーレイ
- 上流を固定コミットから取得して既存 EditMode / PlayMode テストと WebGL ビルドを行う手動 CI
- WebGL を Chromium で起動し、入力・Canvas・致命的エラー・スクリーンショットを確認する Playwright smoke test
- 東方二次創作ガイドラインと第三者素材ライセンスの公開判定台帳
- Unity GUI / UnityMCP / mycomputeruse の観測優先フロー

**ゲームプレイ用 C#、弾幕パターン、ステージ設計、UI レイアウトは新規作成しません。** MVP の自作ゲームプレイコード予算は 0 行です。

## 最短実行

1. GitHub Actions 用に Unity ライセンス secrets を登録します。
2. Actions から `Unity WebGL research build` を手動実行します。
3. `unity-tests`、`webgl-research-build`、`webgl-e2e` の成果物を確認します。
4. 公開は `docs/ASSET_AND_RELEASE_GATE.md` がすべて GREEN になるまで行いません。

ローカル作業は `docs/UNITY_GUI_RUNBOOK.md` に固定しています。CI は上流を毎回クリーンに取得するため、このリポジトリへ巨大な Unity プロジェクトや第三者バイナリ素材を複製しません。

## 状態

- [x] 完成済みベースと固定コミットを選定
- [x] THJam13 のメニュー／レベル／共通シーンを Build Settings に固定
- [x] Unity tests → WebGL build → browser E2E の流れを定義
- [x] ライセンス／公開ゲートを定義
- [x] GitHub Actions で固定コミット、Unity版、既存5シーンの path/GUID、JS/JSON/YAML、npm依存、ゼロゲームプレイコード境界を検証
- [ ] Unity ライセンス secrets を設定して Unity CI を実行
- [ ] Unity Editor 実機でスクリーンショット採取
- [ ] キャラクター素材を許諾済み候補へ Inspector 差し替え
- [ ] 全素材を GREEN にして無料 Web 配布を承認
