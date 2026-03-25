# Bosta Drive — context for AI coding agents

This document summarizes what the project is, how it is structured, and the conventions to follow when changing it.

## What this project is

**Bosta Drive** is a **client-side mock file browser** for Bosta: a Next.js app that looks like a small “cloud drive” UI. It is **not** connected to a real backend. All file and folder data lives in **`localStorage`** under the key `bosta_drive_fs`.

Goals of the UI:

- Bosta brand red (`#E30613` / `primary` / `bosta-red-*` in CSS variables).
- Light/dark theme toggled on `<html class="dark">`, persisted via the theme logic in the header (see `ThemeToggle`).
- **Folders** and **text files** only; text files open in a modal editor.
- **React Context + `useReducer`** for filesystem state (no Redux).
- **URL routing** mirrors the open folder so **browser back/forward** navigates folders: `/` = root, `/{folderId}` = that directory’s id (UUID or bootstrap root id).

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`, `@theme inline`) |
| Forms | `react-hook-form` (create/rename modals, text editor) |
| IDs | `uuid` (`v4`) for new nodes |
| Persistence | `localStorage` JSON, versioned state shape (`version: 1`) |

## Repository layout (high level)

```text
app/
  layout.tsx          Root layout, fonts, Header, body shell
  page.tsx            Home route `/` → DrivePage
  [folderId]/page.tsx Dynamic route `/{folderId}` → same DrivePage
  globals.css         Theme tokens, `@custom-variant dark`

components/
  filesystem/         Entire “drive” feature (see below)
  layout/             Header, ThemeToggle
  icons/              SVG icon components (Heroicons-style)
  ui/                 Shared Modal, focus/dismiss styles

docs/
  AGENTS.md           This file
```

## Filesystem feature (`components/filesystem/`)

### Entry and composition

| File | Role |
|------|------|
| `DrivePage.tsx` | Renders `<main>` + `FileSystemApp` (shared by `/` and `/[folderId]`) |
| `FileSystemApp.tsx` | `FileSystemProvider`, `FolderRouteSync`, main column + inspector |
| `FolderRouteSync.tsx` | Syncs URL (`usePathname`) ↔ `currentDirId` after `hydrated`; fixes bad URLs after deletes |
| `folderPathUtils.ts` | `folderIdFromPathname`, `pathnameForFolderId` |
| `useNavigateToFolder.ts` | `router.push` to `/` or `/{id}` — use for user-driven folder navigation (history) |
| `utils.ts` | Path building, name collision checks, date/preview helpers, subtree helpers for delete |

### State (`components/filesystem/context/`)

| File | Role |
|------|------|
| `fileSystemTypes.ts` | `FileSystemState`, `FSNode`, actions (`HYDRATE_STATE`, `NAVIGATE_TO_DIR`, `RENAME_NODE`, `DELETE_NODE`, …) |
| `fileSystemReducer.ts` | Pure reducer; subtree delete, rename with sibling checks |
| `initialState.ts` | `createInitialFileSystemState()`, deterministic **`BOOTSTRAP_ROOT_ID`** (`fs-root-bootstrap`) for SSR/first paint |
| `migrateFileSystemState.ts` | Backfills `createdAt` on older saved payloads |
| `FileSystemProvider.tsx` | `useReducer`, hydrate from `localStorage` on mount, persist on change (skip first persist when hydrating), exposes **`hydrated`** |

**Hydration rule:** Initial client render must match the server — **no `localStorage` in the reducer initializer**. Bootstrap state is deterministic; then an effect dispatches `HYDRATE_STATE` from storage.

### UI (`components/filesystem/ui/`)

| Area | Contents |
|------|----------|
| `FileSystemShell.tsx` | Breadcrumb, grid, empty state, FAB, create modals, text editor |
| `FileSystemBreadcrumb.tsx` | Path buttons → `useNavigateToFolder` |
| `FileSystemEmptyState.tsx` | Empty folder CTAs |
| `CreateFsItemModal.tsx` | Add folder/file in **current** directory (`react-hook-form`) |
| `CreateItemFab.tsx` | Floating + speed-dial (hover on desktop, tap on small screens) |
| `TextFileEditorModal.tsx` | Shared `@/components/ui/Modal` + `react-hook-form` for content |
| `fileSystemStyles.ts` | Shared Tailwind class strings (buttons, inputs, cards, inspector FAB, etc.) |
| `item-card/` | `FileSystemItemCard`, `FileSystemDirCard`, `FileSystemFileCard`, `FileSystemItemIcon` |
| `inspector/` | Right panel: details, preview, Open/Rename/Delete; `RenameFsItemModal`, `DeleteFsItemConfirmModal`; `index.ts` re-exports default panel |

### Shared UI (`components/ui/`)

- **`Modal.tsx`**: `Modal`, `Modal.Header`, `Modal.Body`, `Modal.Footer`; backdrop + Escape; top-right dismiss.
- **`styles.ts`**: `focusRing`, `dismissIconButton`.

## Routing behavior (important)

- **`/`** → `currentDirId` must be **`state.rootId`** (after sync).
- **`/{folderId}`** → `currentDirId` = decoded segment; must be an existing **directory** node.
- **Invalid or deleted folder in URL** → `FolderRouteSync` **`replace`s** to a valid path (current dir if valid, else root).
- **User opens a folder** (breadcrumb, double-click dir card, inspector “Open folder”) → **`useNavigateToFolder()`** (`router.push`) so **history entries** are created.

Do not call `dispatch({ type: "NAVIGATE_TO_DIR", ... })` directly for user navigation if you want the URL to update — use **`useNavigateToFolder`** unless you have a specific reason (internal sync is handled by `FolderRouteSync`).

## Data model (short)

- **`FileSystemState`**: `rootId`, `currentDirId`, `selectedNodeId`, `editor`, `nodesById`, `childrenByDirId`, `version`.
- **Nodes**: `dir` | `file` (`text`); each has `id`, `name`, `parentId`, **`createdAt`**, **`modifiedAt`**.
- **Root** cannot be renamed or deleted.
- **Delete** removes a subtree and adjusts `currentDirId` / selection / editor as needed.

## UX conventions already in the code

- Single-click item → **select**; double-click folder → **navigate**; double-click file → **open editor**.
- Clicking the **main shell background** clears selection (`SELECT_NODE` null).
- Inspector and FAB stop propagation where needed so they don’t clear selection unintentionally.

## Styling conventions

- Prefer **shared classes** from `fileSystemStyles.ts` and **`@/components/ui/styles`** for focus rings and dismiss buttons.
- Theme colors come from **CSS variables** in `globals.css` and Tailwind **`@theme inline`** (`primary`, `surface`, `border`, `muted-foreground`, etc.).
- Dark mode: **`dark`** class on `<html>` (see layout + `ThemeToggle`).

## Commands

```bash
npm run dev    # development
npm run build  # production build
npm run lint   # ESLint
```

## What to avoid when extending

- Don’t read **`localStorage`** during render or reducer init for filesystem state (hydration mismatch).
- Don’t add **`modal*`-prefixed** class names on shared components (project convention uses neutral names on `Modal`).
- Keep **new routes** in mind: `app/[folderId]/page.tsx` catches **any single path segment**; adding top-level routes like `/settings` requires ordering/route groups if they would otherwise be interpreted as folder ids.

## Quick file finder

| Task | Likely location |
|------|------------------|
| New reducer action | `context/fileSystemTypes.ts` + `fileSystemReducer.ts` |
| URL / folder sync | `FolderRouteSync.tsx`, `folderPathUtils.ts`, `useNavigateToFolder.ts` |
| New modal | `components/ui/Modal.tsx` + `fileSystemStyles.ts` |
| Grid cards | `ui/item-card/` |
| Inspector / side panel | `ui/inspector/` |
| Persist / hydrate | `FileSystemProvider.tsx`, `migrateFileSystemState.ts` |

This document is **maintainer-facing** for agents and humans; update it when architecture or conventions change materially.
