# Next Video Studio

A Next.js demo project for browsing a video catalogue and setting a playback
trim range. It is a UI and interaction demo—not a video upload, rendering, or
export service.

## Features

- Browse a bundled catalogue at `/videos`, search titles, and paginate results.
- Select an item to open the editor at `/videos/[slug]`.
- Play or pause a preview and set start/end trim points with pointer or
keyboard controls.
- Store trim positions per video in the browser's `localStorage`.

The catalogue is checked-in fixture data shaped like YouTube search results.
Since a YouTube ID is not a directly playable media file, every selected item
uses the same public MP4 sample for its preview. The app does not upload media,
play YouTube videos, persist data on a server, or export video.

## Requirements

[Mise](https://mise.jdx.dev/) manages the required Node.js and pnpm versions.
Install Mise, then let this repository provision its tools:

```bash
mise install
```

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables,
API keys, database, or backend setup are required.

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server with Turbopack. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Serve the production build. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm lint` | Run Biome checks. |
| `pnpm typecheck` | Check TypeScript without emitting files. |
| `pnpm check` | Run linting, type-checking, tests, and a production build. |

## Project structure

```text
src/
├── app/          # App Router pages and layouts
├── components/   # Video list, trimmer, trim controls, and shared UI
├── hooks/        # Client-side utilities such as useDebounce
└── lib/          # Bundled catalogue data and lookup/pagination helpers
```

The catalogue lives in `src/lib/data.json`. `src/lib/videos.ts` filters and
paginates it, while `src/components/VideoTrimmer.tsx` manages preview playback
and locally saved trim positions.

## Current limitations

- The preview is one remote sample MP4, not the selected catalogue entry.
- Trim values are percentages and only affect preview playback.
- Trim state is stored locally in the browser; it is not shared or saved to a
server.
- There is no ingestion pipeline, authentication, media processing, or video
export.

The remote preview asset requires an internet connection; the catalogue itself
is local.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

