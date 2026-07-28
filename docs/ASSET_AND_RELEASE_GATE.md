# Asset manifest / release gate

調査日: 2026-07-28 JST

この文書は「無料でビルドできる」と「公開・再配布してよい」を分離します。CI 成果物は権利確認用の研究物です。全項目が GREEN になるまで GitHub Pages、itch.io、ストア、一般配布へ出しません。

## 東方 Project 側の必須条件

公式ガイドライン: https://touhou-project.news/guideline/

- 作品内と配布ページに「東方Projectの二次創作」であることを明記する。
- 公式作品であると誤認させない。
- 原作ゲームから取り出した画像・音声・データを使わない。
- 他の二次創作者の作品を無断再利用しない。
- ブラウザゲームは無料にする。
- ガイドライン変更に備え、公開直前に日付と内容を再確認する。

推奨表示:

> 本作品は上海アリス幻樂団「東方Project」の二次創作作品です。公式作品ではありません。

## 判定記号

- `GREEN`: 条件を保存済みで、その条件内なら利用・再配布可能
- `YELLOW`: 候補。ダウンロード同梱ライセンス、作者表示、対象ファイルの対応確認が必要
- `RED`: 使用禁止または公開ビルドから除去
- `RESEARCH`: 上流の再現確認には使えるが、こちらからの再配布を承認していない

## 現在の台帳

| 対象 | 出所 | 条件 | 状態 | 措置 |
|---|---|---|---|---|
| Danmokou のコード、shader、UXML、BDSL | `Bagoum/danmokou` | MIT。著作権表示と許諾文を保持 | GREEN | `Assets/Danmokou.LICENSE.md` をビルドとソースに同梱 |
| Suzunoya 系必須サブモジュール | upstream submodule | 各サブモジュールの LICENSE に従う | YELLOW | recursive checkout 後に LICENSE 一覧を成果物化 |
| THJam13 の完成済みゲーム構成 | upstream `MiniProjects/Projects/THJam13` | コードと非コード素材で条件が異なる | RESEARCH | まず無改造で動作確認。公開前に画像・音楽・SFX をファイル単位で監査 |
| Danmokou の bullet / UI / util / item / player の Bagoum 制作物 | upstream license manifest | CC BY 4.0 と記載された対象のみ | GREEN | 作者・ライセンス・変更有無を Credits に記載 |
| Kenney 系素材 | upstream `Assets/Danmokou/Kenney` | CC0 と明記 | GREEN | 出所を任意クレジットとして残す |
| DD / dairi の画像 | upstream | 非商用のみ、または個別条件。対象対応も要確認 | YELLOW | 無料非商用でも条件スナップショットを保存。曖昧なら差し替え |
| ライセンス記載のない upstream 画像・音楽 | upstream | 再配布根拠なし | RED | 公開ビルドから除外または作者の明示許諾を取得 |
| 東方原作ゲームから抽出した素材 | 上海アリス幻樂団 | ガイドラインで使用・公開禁止 | RED | 一切取り込まない |
| Touhou Mini Pack | https://reale-ly.itch.io/touhou-mini-pack | 非商用利用・改変可、`Majstek` のクレジット必須、R-18 不可 | YELLOW | 無料非商用版のキャラ差し替え候補。ZIP 内条件も保存してから import |
| Danmaku Sprite Pack | https://void-dancer.itch.io/danmaku-sprite | 東方ガイドライン順守、改変可、クレジット要請 | YELLOW | bullet 差し替え候補。配布ページと同梱文を保存 |
| 東方 Fan Game Jam 固有 asset pack | 各 Jam 配布物 | 当該 Jam 提出作品限定の場合がある | RED | 一般プロジェクトには流用しない |
| PeriTune 等の CC BY 楽曲 | 作者公式ページ | 曲ごとの明示ライセンスに従う | YELLOW | 曲単位 URL、作者、ライセンス版、変更有無を固定 |
| 出所不明／AI 生成の代替素材 | 不明 | 著作権・学習元・利用条件を検証できない | RED | 採用しない |

## 最小差し替え方針

新しい美術設計は行いません。既存 THJam13 の役割と参照先を維持し、同じ役割の許諾済み素材へ機械的に置き換えます。

| 既存の役割 | 差し替え候補 | 変更方法 |
|---|---|---|
| プレイヤー（魔理沙） | Touhou Mini Pack の該当 sprite | 既存 SpriteRenderer / animation clip の sprite 参照のみ差し替え |
| ボス／会話立ち絵 | 同一作者・同一 pack 内の該当キャラ | 既存 prefab / metadata の画像参照のみ差し替え |
| 弾 | Danmaku Sprite Pack または Danmokou の CC BY 対象 | bullet style の texture 参照のみ差し替え |
| 背景 | upstream の CC0 / CC BY 対象 | 既存 Material / Sprite 参照のみ差し替え |
| BGM | 明示 CC ライセンス曲 | 既存 Track asset の AudioClip と credit だけ差し替え |
| SFX | upstream の CC0 / CC BY 対象 | 既存 SFX asset の AudioClip 参照だけ差し替え |
| UI / font | upstream の許諾済み UI と OFL font | レイアウトは変更せず参照を維持 |

## Credits に必要な列

`asset_id`, `file_path`, `title`, `author`, `source_url`, `license`, `license_url`, `commercial`, `modification`, `retrieved_at`, `evidence_path`, `release_status`

スクリーンショットだけでなく、配布ページの HTML/PDF または同梱 LICENSE を `evidence/licenses/<asset_id>/` に保存します。URL だけを根拠にしません。

## 公開前チェック

- [ ] 東方二次創作の明記が title / loading / 配布ページにある
- [ ] 公式作品と誤認する表現がない
- [ ] ブラウザ版が無料
- [ ] 原作抽出素材が 0 件
- [ ] 全ファイルが台帳の `asset_id` に逆引きできる
- [ ] YELLOW / RED / RESEARCH が 0 件
- [ ] Danmokou と全サブモジュールの LICENSE を同梱
- [ ] CC BY、OFL、各作者指定のクレジットを表示
- [ ] 改変した素材には改変した旨を記載
- [ ] 公開当日に東方ガイドラインを再確認し、確認日を記録

## 現時点の公開判定

**BLOCKED** — THJam13 の既存非コード素材をファイル単位で再配布監査していないためです。ゲーム構造の研究、ローカル起動、非公開テストを先に進め、公開版では YELLOW / RED 対象を許諾済み候補へ差し替えます。
