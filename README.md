# Golf Birdies — Balls for Birdies

Live scoreboard for the **DP World India Championship**. It displays birdies, eagles, and the number of golf balls DP World has pledged to donate, in a poster-style display built for venue screens.

## What it does

During the tournament, the app:

1. Pulls hole-by-hole scores from the DP World Tour / European Tour API
2. Counts **birdies** (`bi`) and **eagles** (`ea`) across all players
3. Shows **total balls deployed** as `birdies + (eagles × 2)`
4. Refreshes automatically every **60 seconds**

The layout matches the campaign artwork: hinged number tiles, DP World gradient, and partner logos for DP World Tour, The Golf Foundation, and the Indian Golf Union.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router (query parameters)

## Getting started

```bash
npm install
npm run dev
```

The app is served under the `/dpworldtour/` base path (see `vite.config.ts`). Open:

```
http://localhost:5173/dpworldtour/
```

### Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check without emitting files |

## URL parameters

Scores are driven by query parameters. Combine live API data with optional manual offsets.

| Parameter | Required | Description |
| --- | --- | --- |
| `event` | For live data | European Tour event ID |
| `round` | For live data | Round number |
| `ea` | Optional | Extra eagles to add to the count |
| `bi` | Optional | Extra birdies to add to the count |

### Live tournament (API + optional offsets)

```
/dpworldtour/?event=EVENT_ID&round=1
/dpworldtour/?event=EVENT_ID&round=1&ea=2&bi=5
```

When `event` and `round` are present, the app fetches:

```
https://www.europeantour.com/api/sportdata/HoleByHole/Event/{event}/Round/{round}
```

If `ea` / `bi` are also set, those values are **added** to the API totals. Polling runs every minute.

### Manual counts only (no API)

```
/dpworldtour/?ea=12&bi=48
```

Use this for testing or when live data is unavailable. Both `ea` and `bi` should be provided.

### Fallback

If the API request fails and `ea` / `bi` are present, the display uses those values instead of going blank.

## Display logic

| Tile | Source |
| --- | --- |
| **BIRDIES** | Holes with `ScoreClass === "bi"` (+ optional `bi` offset) |
| **EAGLES** | Holes with `ScoreClass === "ea"` (+ optional `ea` offset) |
| **TOTAL DEPLOYED** | `birdies + eagles * 2` |

Counts are shown as three-digit tiles (zero-padded), so `7` appears as `007`.

## Project structure

```
src/
  App.tsx          Scoreboard UI, API polling, and URL param handling
  main.tsx         React entry (BrowserRouter)
  index.css        Global styles
  assets/          Partner logos
```

## Deploy

Build output is configured with `base: '/dpworldtour/'`, so host the site at a `/dpworldtour/` path (or change `vite.config.ts` if you need a different root).
