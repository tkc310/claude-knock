# タンブンの説明ページの調査メモ

サイトの `/tambun/`（本文は `src/content/guides/tambun.md`）の根拠と、表記の対応をまとめる。サイトにはタイ文字を出さない（ADR-0012）ので、タイ語の表記はここにだけ書く。

調べた日: 2026-10-21

## 用語の対応

| サイトの表記             | タイ語                      | パーリ語                                 | メモ                                                                                                   |
| ------------------------ | --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| タンブン                 | ทำบุญ                        | puñña（功徳）を作ること                  | 功徳になる行い全般                                                                                     |
| 福業事（布施・戒・修習） | บุญกิริยาวัตถุ 3（ทาน ศีล ภาวนา） | puññakiriyavatthu（dāna, sīla, bhāvanā） | AN 8.36 で確認                                                                                         |
| 十福業事                 | บุญกิริยาวัตถุ 10                | —                                        | タイでよく紹介される。三蔵での出所は確かめていないので、サイトでは「タイでよく紹介される」とだけ書いた |
| 人の善い行いを喜ぶこと   | ปัตตานุโมทนามัย                | pattānumodanā                            | 十福業事の 7 番目（Thai PBS）                                                                          |
| アヌモータナー・サートゥ | อนุโมทนาสาธุ                  | anumodanā + sādhu                        | 依頼文では「アヌモータナサートゥ」。長音を入れ、2 語を中黒で分けた                                     |
| 五戒・八戒               | ศีล 5・ศีล 8                  | pañcasīla・aṭṭhaṅga uposatha             | 八戒は AN 3.70・AN 8.41 で確認                                                                         |
| 仏随念・法随念・僧随念   | พุทธานุสสติ ฯลฯ                | buddhānussati ほか                       | AN 3.70（布薩の日の随念）、AN 6.10（六随念）                                                           |
| 布施の瞑想（捨随念）     | จาคานุสสติ                    | cāgānussati                              | AN 6.10。依頼文の「布施の瞑想」をこれに当てた                                                          |
| 慈悲の瞑想               | เมตตาภาวนา                  | mettā bhāvanā                            | Sn 1.8（慈経）、MN 7（四無量心）                                                                       |
| 随喜（喜）               | มุทิตา                        | muditā                                   | MN 7。「人の幸せを嫉妬せず喜ぶ」の経典の用語                                                           |
| 放生                     | ปล่อยนกปล่อยปลา               | —                                        | 三蔵に定めを確かめられなかったので「習俗」として分けた（ADR-0007 の考え方）                            |

## 確かめた経典（SuttaCentral の API。Sujato 訳）

- AN 8.36 Puññakiriyavatthusutta: 「Giving, ethical conduct, and meditation are all grounds for making merit.」 https://suttacentral.net/api/bilarasuttas/an8.36/sujato?lang=en
- AN 3.70 Uposathasutta: 布薩の日の仏・法・僧・戒・天の随念と、八つの戒（不殺生〜高く広い寝台を使わない）。 https://suttacentral.net/api/bilarasuttas/an3.70/sujato?lang=en
- AN 8.41 Saṅkhittūposathasutta: 「the observance of the sabbath with its eight factors is very fruitful and beneficial」 https://suttacentral.net/api/bilarasuttas/an8.41/sujato?lang=en
- AN 6.10 Mahānāmasutta: 六随念。捨随念は「attano cāgaṁ anussarati」、物惜しみの垢を離れ、気前よく手放す心を思い起こし、その間は貪・瞋・痴にとらわれない。 https://suttacentral.net/api/bilarasuttas/an6.10/sujato?lang=en
- Snp 1.8 Mettasutta: 「Sabbasattā bhavantu sukhitattā」、母がただ一人の子を命がけで守るように。 https://suttacentral.net/api/bilarasuttas/snp1.8/sujato?lang=en
- MN 7 Vatthasutta: mettā・karuṇā・muditā・upekkhā を四方へ広げる。 https://suttacentral.net/api/bilarasuttas/mn7/sujato?lang=en

確かめられず、書かなかったもの:

- DN 33（Saṅgīti）の三福業事: 取得した内容に該当の文が無く、確かめられなかった
- 「見返りを求めない布施」を直接説く経（AN 7.52 など）: 確かめていないので出典を挙げず、一般的な勧めとして書いた
- 十福業事の三蔵での出所

## タイの習俗の出典

- Thai PBS「วันพระใหญ่ ไม่ได้ไปวัดก็ทำบุญได้ ด้วย 'บุญกิริยาวัตถุ 10'」（2024-02-23）: 十福業事、ปัตตานุโมทนามัย を「他人の善行を嫉妬せず喜ぶこと」と説明。 https://www.thaipbs.or.th/news/content/337243
- Thai PBS「วัดดังขานรับเลิกทำบุญ 'ปล่อยนก-ปล่อยปลา'」（2017-06-23）: 放生は厄除けの信仰として広く行われる。動物愛護の団体の働きかけで、バンコクの有名寺院が放生用の生きものの販売をやめ始めた。 https://www.thaipbs.or.th/news/content/263737
