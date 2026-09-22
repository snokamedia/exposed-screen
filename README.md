# Web-exposed Screen Profiler
The Web-exposed Screen Profiler visualizes web-exposed screen information to show you what your screen and browser window looks like to a website.

![](https://media.publit.io/file/snokagit/exposed-screen.gif)


[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/W7W1FDHVR)

## Features
One of the features of this tool is its ability to deduce extended displays, estimating the height of the primary display if the window is on the bottom extended display and the width of the primary display if the window is on the right extended display. In addition, it can also predict the operating system being used (currently only Windows 10, 11, and macOS), and will attempt to detect if it is running on a virtual machine (commonly used by bots).

Try resizing your window, moving it to a different screen, zooming in or out, open dev tools, change the size of your taskbar/menu bar, and turn the bookmark bar on and off. Take a screenshot of it with a bot or online screenshot tool and see if it gets detected as a VM.

## Development

Vanilla TypeScript + Vite, Biome, Vitest, Playwright. See `ARCHITECTURE.md`.

```sh
npm ci
npm run dev        # dev server
npm run check      # Biome lint + format
npm run typecheck  # tsc --noEmit
npm run test       # unit tests
npm run build      # typecheck + production build to dist/
npm run size       # gzip bundle budget (40 KB)
npm run test:e2e   # Playwright smoke on the built page
```

## Additional Credits:
[Phosphor Icons](https://phosphoricons.com/) (MIT, inlined SVG — no webfont)
