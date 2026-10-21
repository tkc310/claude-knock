"""pythaidate で太陰年の年型と全ワンプラ日を出し、JSON で標準出力に書く。

使い方: python dump_pythaidate.py <最初の仏暦年> <最後の仏暦年> <開始日 YYYY-MM-DD> <終了日 YYYY-MM-DD>
仏暦年は src/core と同じく「その年の เดือน 8 がある西暦年 + 543」。小暦（CS）は仏暦 - 1181
"""

import json
import sys
from datetime import date, timedelta

from pythaidate import CsDate

CAL_TYPES = {"A": "common", "B": "adhikavara", "C": "adhikamasa"}


def year_kinds(first: int, last: int) -> list[dict]:
    return [
        {"buddhistYear": be, "kind": CAL_TYPES[CsDate.calculate_year0(be - 1181).cal_type]}
        for be in range(first, last + 1)
    ]


def lunar_of(d: date) -> CsDate:
    return CsDate.fromjulianday(d.toordinal() + 1721425)


def wan_phra(start: date, end: date) -> list[dict]:
    """各月の 8・15・23 日目と月末。月末は翌日が 1 日目になる日"""
    found = []
    d = start
    today = lunar_of(d)
    while d <= end:
        tomorrow = lunar_of(d + timedelta(days=1))
        if today.day in (8, 15, 23) or tomorrow.day == 1:
            # month_raw の 88 は閏月の年の 2 回目の 8 月
            found.append({"date": d.isoformat(), "month": today.month_raw, "day": today.day})
        d += timedelta(days=1)
        today = tomorrow
    return found


def main() -> None:
    first, last = int(sys.argv[1]), int(sys.argv[2])
    start, end = date.fromisoformat(sys.argv[3]), date.fromisoformat(sys.argv[4])
    json.dump({"years": year_kinds(first, last), "wanPhra": wan_phra(start, end)}, sys.stdout)


if __name__ == "__main__":
    main()
