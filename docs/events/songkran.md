# สงกรานต์ / Songkran / ソンクラーン / タイ正月

民間行事（`category: folk`、ADR-0007）。パーリ三蔵に根拠は無い。原始仏教の基準（ADR-0005 が定め、ADR-0007 が引き継いだ基準）には合わず、例外として扱う。

## 日付の決め方

- 太陽暦の 4/13〜15 の 3 日間に固定する（太陰暦の行事ではない）。閏月（อธิกมาส / アティカマート）の年も動かない
- 行事の期間（4/13〜15）と、休日（振替休日・特別休日を含む）は別に扱う
  - 土日と重なる年は、振替休日が付く年がある（下の表）
  - 内閣が 4/12 などを特別休日に足す年がある（2024 年の 4/12）
- 伝統の呼び方（Thai PBS）: 4/13 วันมหาสงกรานต์、4/14 วันเนา、4/15 วันเถลิงศก

「4/13〜15 に固定する」ことを定めた公式機関の文書（内閣の決定、王立学士院、文化省など）は、今回開けた範囲では見つからなかった（「未確認・食い違い」参照）。各年の休日が 4/13〜15（2025 年は 4/14・15）であることは、タイ中央銀行の休日告示で確かめた（下の表）。

## 2024〜2027 年の日付

行事の開始日は毎年 4/13 で、期間は 4/13〜15。右の欄は、その年の休日をタイ中央銀行の休日告示（英訳 PDF）で確かめた結果（2026-10-21、親セッションが PDF 本文を読んで確認）。

| 年   | 開始日（期間）                | 公式機関の出典で確かめたこと                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2024 | 2024-04-13（土）〜04-15（月） | 告示 FPG. 8/2566 https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2024-EN.pdf 。4/15（月）が「Songkran Festival」。4/16（火）は「Substitution for Songkran Festival (Saturday 13th April 2024 and Sunday 14th April 2024)」で、4/13 がソンクラーンだと明記されている。4/12（金）は内閣決定の特別休日（タイ中央銀行 プレスリリース 5/2024 https://www.bot.or.th/en/news-and-media/news/news-20240221.html ） |
| 2025 | 2025-04-13（日）〜04-15（火） | 告示 FPG. 5/2567 https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2025-EN.pdf 。4/14（月）と 4/15（火）だけが「Songkran Festival」。日曜の 4/13 は載っておらず、振替休日も無い。開始日 4/13 は告示からは確かめられない                                                                                                                                                                                      |
| 2026 | 2026-04-13（月）〜04-15（水） | 告示 31/2568 https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf 。4/13・14・15 が「Songkran Festival」。振替休日は無い                                                                                                                                                                                                                                                                                                                                            |
| 2027 | 2027-04-13（火）〜04-15（木） | 告示 37/2569 https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690175.pdf 。4/13・14・15 が「Songkran Festival」。振替休日は無い                                                                                                                                                                                                                                                                                                                                            |

- `tests/fixtures/` に入れられる開始日は、告示に 4/13 が明記された 2024・2026・2027 年。2025 年は告示に 4/13 が載っていないので入れない
- 在外公館の休日表も 2026 年の 4/13 を「Songkran Day」とする。在マドリード https://madrid.thaiembassy.org/en/page/embassy-holidays 、在オーストリア https://thaiembassy.at/en/official-holidays.html

## 由来

- **三蔵に根拠は無い**。パーリ三蔵（経・律）のどこにも、ソンクラーンに当たる行事は出てこない。ブッダの生涯の出来事とも結びつかない。だから ADR-0007 で、仏教行事とは別の「民間行事」の例外として扱っている
- 語源はサンスクリット語で「移ること」。太陽が黄道十二宮の次の宮へ移ることを指す。毎月起きるが、魚座（มีน）から白羊宮（เมษ）へ移る日を มหาสงกรานต์ と呼び、バラモンの暦ではこの日が新年（Thai PBS https://www.thaipbs.or.th/now/infographic/268 ）
- ユネスコの無形文化遺産代表一覧（2023 年記載）の決定文では、「太陽が毎年白羊宮に入ること」に結びつく伝統的な新年の行事と説明される。バラモン教への言及は無い https://ich.unesco.org/en/decisions/18.COM/8.B.10
- 寺での積徳（ทำบุญ）や仏像に水をかける習わし（สรงน้ำพระ）は、仏教の習慣が結びついたもの。三蔵の根拠ではない

## 行うこと

三蔵に根拠のある由来とは別に、今のタイで行われること（ユネスコの決定文と Thai PBS による）。

- 寺で積徳し、僧に食事を布施する（ตักบาตร）
- สรงน้ำพระ（仏像に水をかけて清める）
- 砂の仏塔（เจดีย์ทราย）を寺に作る（ユネスコの決定文。北部では 4/14 に砂を寺に運ぶ、Thai PBS）
- รดน้ำดำหัว（年長者の手に水をかけて祝福を受ける）
- 水かけ遊び、家や町の掃除、家族で集まる
- 地方で呼び方と過ごし方が違う（北部 สังขานต์ล่อง、南部 วันว่าง など、Thai PBS）

## カレンダーでの説明文

タイの伝統的な新年。4/13〜15 は休日。寺で積徳し仏像に水をかけ、年長者の手に水をかけて祝福を受ける。

## 未確認・食い違い

- **4/13〜15 に固定することを定めた文書**: 公式機関の文書は見つからなかった。内閣・王立学士院・文化省がどう定めたかは未確認。王立学士院辞典の「สงกรานต์」の項は開けていない
- **天文学的なソンクラーンとの違い（食い違い）**: 太陽が白羊宮に入る มหาสงกรานต์ の日時は、王室のバラモン（โหรพราหมณ์）が毎年告示し、年によって動く。Thai PBS は 2024 年を 4/13 22:24 とし（https://www.thaipbs.or.th/news/content/338336 ）、2026 年を 4/14 10:34:35 とする（https://www.thaipbs.or.th/now/infographic/268 ）。2026 年は天文学上の มหาสงกรานต์ が 4/14 で、固定規則の 4/13 と 1 日ずれる。報道の記述で、告示そのものは開いていない。本ファイルは休日の 4/13〜15 を行事の期間とする（ADR-0007 の前提）。天文学上の日付と一致しない年がある
- **2025 年の振替休日**: 4/13 が日曜なので 4/16（水）が振替休日、という内閣官房の文書があるという検索結果の要約を得た（https://www.soc.go.th/wp-content/uploads//2024/11/2567-OPM-0505-%E0%B8%A7-497-1.pdf ）。この文書は 403 で開けず、本文は確かめていない。タイ中央銀行告示 FPG. 5/2567 は金融機関の休日を 4/14・15 の 2 日だけとし、4/16 は載せない。在シンガポール大使館の休日表も 4/14・15 の 2 日だけ。政府機関と金融機関で休日が違う可能性がある
- **2024 年の振替休日（4/16）**: タイ中央銀行告示 FPG. 8/2566 で確かめた（上の表）
- **在外公館の休日の食い違い**: 在オタワ大使館は 2026 年を 4/13・14 の 2 日閉館とし、別の公館は 4/13 だけ、または 3 日とする（検索結果の要約）。公館ごとの判断で、国の休日（4/13〜15）とは別
- **内閣の決定**: 4/12/2024 の特別休日は、タイ中央銀行が内閣の 2024-02-13 の決定として述べる。内閣官房の文書そのものは開けていない（thaigov.go.th・soc.go.th は 403）
- **バラモン教由来の確証**: Thai PBS が「バラモンの暦で新年」と述べるが、一次の文書は未確認

## 出典

- タイ中央銀行告示 FPG. 8/2566（2024）https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2024-EN.pdf
- タイ中央銀行告示 FPG. 5/2567（2025）https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2025-EN.pdf
- タイ中央銀行告示 31/2568（2026）https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf
- タイ中央銀行告示 37/2569（2027）https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690175.pdf
- タイ中央銀行 プレスリリース 5/2024（4/12 の特別休日）https://www.bot.or.th/en/news-and-media/news/news-20240221.html
- 在マドリード・タイ大使館 休日表（2026）https://madrid.thaiembassy.org/en/page/embassy-holidays
- 在オーストリア・タイ大使館 休日表（2026）https://thaiembassy.at/en/official-holidays.html
- 在オタワ・タイ大使館 2026 年 4 月の休日 https://ottawa.thaiembassy.org/en/content/public-holiday-in-april-2026
- 在シンガポール・タイ大使館 休日表（2025）https://singapore.thaiembassy.org/en/content/royal-thai-embassy-s-official-holidays-in-2024?cate=6221f93a317f07704a3b0e53
- ユネスコ 無形文化遺産 決定 18.COM 8.B.10 https://ich.unesco.org/en/decisions/18.COM/8.B.10
- Thai PBS（4/13〜15 の呼び方と習わし）https://www.thaipbs.or.th/news/content/338336
- Thai PBS（語源・2026 年の มหาสงกรานต์）https://www.thaipbs.or.th/now/infographic/268
- 開けなかったもの: 内閣官房（soc.go.th・thaigov.go.th は 403）
