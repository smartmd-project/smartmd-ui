# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vue 3 single-page application built with Vite and TypeScript.

- `src/main.ts` bootstraps Vue, Pinia, and Vue Router.
- `src/App.vue` is the root component.
- `src/views/` contains route-level pages; use `*View.vue` names.
- `src/components/` contains reusable UI components, with icons under `src/components/icons/`.
- `src/router/` defines routes, and `src/stores/` contains Pinia stores.
- `src/assets/` holds imported styles and images; `public/` holds files served unchanged.
- `desgin-ui.pen` is the repository's design source file.

Use the `@/` alias for imports from `src` when it keeps paths clearer.

## Build, Test, and Development Commands

Use Yarn and a supported Node version (`^22.18.0` or `>=24.12.0`).

- `yarn` installs dependencies.
- `yarn dev` starts the Vite development server with hot reload.
- `yarn build` runs TypeScript checking and creates the production bundle in `dist/`.
- `yarn preview` serves the production bundle locally.
- `yarn type-check` validates TypeScript and Vue SFC types.
- `yarn lint` runs Oxlint and ESLint, applying safe fixes.
- `yarn format` formats files under `src/` with Prettier.

## Coding Style & Naming Conventions

Use TypeScript in Vue components (`<script setup lang="ts">`) and the Composition API. Formatting is defined by `.editorconfig` and Prettier: two-space indentation, LF endings, single quotes, no semicolons, and a 100-character line width.

Name Vue components and views in PascalCase (`HelloWorld.vue`, `AboutView.vue`). Name Pinia composables `useXStore`, route names in lowercase, and variables/functions in camelCase. Run `yarn lint` and `yarn format` before submitting changes.

## Testing Guidelines

No automated test framework or test script is currently configured. For each change, run `yarn type-check`, `yarn lint`, and `yarn build`, then verify affected routes in `yarn dev`. If adding tests, prefer Vitest with Vue Test Utils, colocate files as `*.spec.ts`, and add the corresponding Yarn script.

## Commit & Pull Request Guidelines

Git history currently contains only `init project`, so no established commit convention exists. Use short, imperative subjects such as `Add patient search view`; keep each commit focused.

Pull requests should explain the change and verification steps, link relevant issues, and include screenshots or recordings for visual changes. Call out new dependencies, configuration changes, and known follow-up work.
