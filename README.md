# Thursday 19 November 2026 — The World in One Page

[![news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/quintana111/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/quintana111/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119)

One image summing up Thursday 19 November 2026 in world news: a flat-SVG newspaper front page with 48 stories — three leads (the first-ever Trump–Xi–Putin three-way summit in Shenzhen, the third Kerch Bridge strike in a week, Anthropic's record $81.3bn IPO debut), twelve fact-graphic panels (Gulf war, the ICJ Myanmar genocide ruling, Gaza floods, Ethiopia–Eritrea, Bangladesh garment wages, Nvidia, Fed minutes, the Iran "gas, bio" claim, EU–Indonesia trade, COP31, Venezuela's $12bn revenue, the NBA), a world map with 14 numbered pins, a UTC timeline, a day-in-numbers strip, and a 33-item "Also" list. Every headline and figure comes from the day's reporting (Reuters, AP, BBC, FT, Al Jazeera, Nasdaq, ICJ, COP31, US State Dept, the Fed); the image is rendered deterministically with sharp and contains no AI-generated art.

## Run

```sh
# Re-render the front page (needs sharp; deterministic — two runs are byte-identical)
node ../news-image-20261119-work/compose-20261119.cjs

# Copy the entry image to /output/entry.png with sha256 verification
node main.ts
```

## Files

- `entry.png` — the entry image (1024×1024, PNG)
- `main.ts` — Node 22, stdlib only; copies `entry.png` to `/output/entry.png` and verifies byte-length + sha256 on read-back
