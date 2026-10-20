# วันวิสาขบูชา / Visakha Bucha / ウィサーカ・ブーチャー / 仏誕節

## 日付の決め方

- 通常: タイ太陰暦の満月 `ขึ้น 15 ค่ำ เดือน 6`
- 閏月（อธิกมาส / アティカマート）の年: 太陰暦に `เดือน 8` が 2 回あるため、`ขึ้น 15 ค่ำ เดือน 7` にずれる（ひと月後ろ）
  - 実例（報道が示す）: 2023 年は 6/3（เดือน 7）、2026 年は 5/31（เดือน 7）
  - 規則の説明は報道（Thai PBS、タイラット）が出典。仏教庁・王立学士院による規則の記述は見つけられていない（「未確認・食い違い」参照）
- 閏月の年かどうかを調べて日付を決める処理は、`src/core/` が太陰暦から計算する。ここに書いた年の日付は告示から写したもので、計算結果ではない

## 2024〜2027 年の日付

| 年   | 日付             | 出典                                                                                                                                                                                                                                |
| ---- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2024 | 2024-05-22（水） | タイ中央銀行告示 FPG. 8/2566 https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2024-EN.pdf                                                     |
| 2025 | 2025-05-11（日） | タイ中央銀行告示 FPG. 5/2567 https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2025-EN.pdf（振替休日 5/12 の注記「Sunday 11th May 2025」から） |
| 2026 | 2026-05-31（日） | タイ中央銀行告示 31/2568 https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf（振替休日 6/1 の注記「Sunday 31st May 2026」から）。เดือน 7（閏月の年）は報道が一致                                      |
| 2027 | 2027-05-20（木） | タイ中央銀行告示 37/2569 https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690175.pdf                                                                                                                         |

注: 2024 の告示は日付を表の別欄に分けて載せている。2027 の告示も同様で、行の対応は表の並び順（5/4 戴冠記念日、5/20、6/3 王妃誕生日）から読んだ。2025・2026 は振替休日の注記から日付を読んだ。いずれも告示の PDF テキストを取り出して確認した。

## 由来

仏教徒（上座部、タイ）は、ブッダの誕生・成道（悟り）・般涅槃の 3 つを、いずれもこの満月の日（ただし年は別）とする。3 つの出来事の三蔵上の根拠は次のとおり。確かめられたのは出来事そのものまでで、「どれもウィサーカ月の満月」という日付は三蔵の本文では確かめられていない。

- **誕生**
  - 長部 16 経（大般涅槃経）5 章 8 節: 阿難に、巡礼すべき 4 か所の 1 つとして「ここで如来は生まれた」の場所を挙げる（ルンビニーの名は、確認した英訳には出ない）。https://suttacentral.net/dn16/en/sujato
  - 中部 123 経（Acchariyaabbhutasutta）: 菩薩の入胎から誕生までの奇瑞を阿難が語る。月日の記述は無い。https://suttacentral.net/mn123/en/sujato
- **成道**
  - 律蔵 大品（Mahāvagga）第 1 章 1 節: 「成道の直後、ブッダはウルヴェーラーのネーランジャラー河畔、菩提樹の下にいた」（ブラフマリ訳）。https://suttacentral.net/pli-tv-kd1/en/brahmali
  - 長部 16 経 5 章 8 節: 巡礼 4 か所の 1 つに「ここで如来は無上正等覚を悟った」。
- **般涅槃**
  - 長部 16 経 5 章 1 節・2 節: 阿難に、2 本のサーラ樹の間に床を敷かせる。サーラ樹は季節外れに満開だった。5 章 8 節に「ここで如来は無余涅槃界に般涅槃した」。
  - 月日の記述は無い。

3 つを同じ満月の日とする点（と月名ウィサーカ）は、今回確かめた三蔵の本文には見つからなかった。注釈書（อรรถกถา）に由来するとされるが、注釈書の該当箇所は確認していない（「未確認・食い違い」参照）。

国連は 1999 年の総会で、ウィサーカ（Vesak）を国際デーとして認めた（Thai PBS）。

## 行うこと

三蔵に根拠のある由来とは別に、今のタイで行われること。

- 休日（タイ中央銀行の告示で休日。日曜と重なる年は振替休日）
- 寺院参り、布施、夜の เวียนเทียน（ウェンティエン、灯明を持って仏堂や仏塔の周りを右回りに回る）が一般的な習わし（※ 行事の内容そのものを述べた公的な出典は今回開いていない。一般的な知識で、未確認）

## カレンダーでの説明文

ブッダの誕生・成道・般涅槃を偲ぶ日。タイでは寺院で布施をし、夜にウェンティエン（灯明を持って仏堂を右回り）を行う。

## 未確認・食い違い

- **閏月のずれの規則の公的な出典**: 見つからなかった。「閏月（เดือน 8 が 2 回）の年は เดือน 7 の満月にずれる」という説明は、Thai PBS（https://www.thaipbs.or.th/news/content/339774 、https://www.thaipbs.or.th/news/content/328261 ）とタイラット（https://www.thairath.co.th/lifestyle/calendar/2934325 ）の報道で一致するが、どれも仏教庁・王立学士院を典拠として挙げていない。同種の規則（アッタミー・ブーチャー）は報道が仏教庁を典拠として引く（https://www.thaipbs.or.th/news/content/328519 ）が、ウィサーカ・ブーチャー自体の規則は引いていない
- **2026 年が閏月の年であること**: Thai PBS（https://www.thaipbs.or.th/news/content/506415 ）とタイラットが「เดือน 8 が 2 回の年なので เดือน 7」と述べる。海洋沿岸資源局（https://www.dmcr.go.th/detailAll/85369/nws/0/ ）は「ขึ้น 15 ค่ำ เดือน 7」とするが閏月には触れない。一方、タンセータキット・トゥルーIDなど一部の報道は 2026 年を「เดือน 6」と書く（本文は開いて確かめていない。検索結果の要約による）
- **2024・2025・2027 年が เดือน 6 か เดือน 7 か**: 確かめていない（日付は告示から、月は未確認）。自分で太陰暦を計算して埋めていない
- **「3 つとも同じ満月の日」の根拠**: 確かめた三蔵の本文（長部 16 経、中部 123 経、律蔵大品第 1 章）に、ウィサーカ月・満月の記述は見つからなかった。注釈書（อรรถกถา）の記述は確認していない。ブッダダーサ比丘が上座部は 3 つとも同日とみなし、大乗は同日としないと述べたとする報道（検索結果の要約）があるが、本文は開いていない
- **ルンビニー**: 確認した長部 16 経の英訳には地名が無い。ルンビニーの名が出る三蔵の箇所は今回確認していない
- **行うこと**: ウェンティエンなどの習わしの出典は開いていない
- **2027 年の告示**: 日付は PDF のテキストの行の並びから読んだ。表の行と日付が離れて抽出されている

## 出典

- タイ中央銀行告示 FPG. 8/2566（2024 年の休日）https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2024-EN.pdf
- タイ中央銀行告示 FPG. 5/2567（2025 年の休日）https://www.bot.or.th/content/dam/bot/content-fragments/holiday-calendar/en/bot-notification-holiday/BOT-Notification-Holiday-Calendar-2025-EN.pdf
- タイ中央銀行告示 31/2568（2026 年の休日）https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2568/EngPDF/25680162.pdf
- タイ中央銀行告示 37/2569（2027 年の休日）https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2569/EngPDF/25690175.pdf
- SuttaCentral 長部 16 経 https://suttacentral.net/dn16/en/sujato
- SuttaCentral 中部 123 経 https://suttacentral.net/mn123/en/sujato
- SuttaCentral 律蔵 大品 第 1 章 https://suttacentral.net/pli-tv-kd1/en/brahmali
- Thai PBS（2023・閏月の説明）https://www.thaipbs.or.th/news/content/328261
- Thai PBS（規則の説明）https://www.thaipbs.or.th/news/content/339774
- Thai PBS（2026）https://www.thaipbs.or.th/news/content/506415
- Thai PBS（アッタミー・ブーチャーの規則。仏教庁を典拠として引く）https://www.thaipbs.or.th/news/content/328519
- タイラット（2026 年は閏月の年）https://www.thairath.co.th/lifestyle/calendar/2934325
- 海洋沿岸資源局（2026-05-31 は ขึ้น 15 ค่ำ เดือน 7）https://www.dmcr.go.th/detailAll/85369/nws/0/
