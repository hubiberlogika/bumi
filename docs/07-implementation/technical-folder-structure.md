# Technical Folder Structure

## Root
File yang harus tetap berada di root:
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `eslint.config.mjs`
- `jsconfig.json`
- `postcss.config.mjs`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`

## Source Structure
```text
src/
  app/
  components/
  features/
  services/
  hooks/
  lib/
  utils/
  config/
  styles/
  constants/
```

## Placement Rules
- `app/` hanya untuk routing, layouts, loading, errors, dan page composition
- `components/` hanya untuk reusable UI lintas domain
- `features/` untuk logic dan UI yang spesifik domain bisnis
- `services/` untuk data access, API calls, dan orchestration
- `hooks/` untuk custom hooks
- `lib/` untuk framework helpers dan integration primitives
- `utils/` untuk helper murni dan formatter
- `config/` untuk configuration maps seperti navigation dan permissions
- `styles/` untuk layer styling tambahan
- `constants/` untuk enum dan key statis

## Features Structure
```text
src/features/
  dashboard/
  sales/
  operations/
  finance/
  master-data/
  settings/
  auth/
  shared/
```

## Domain Substructure
Setiap domain sebaiknya punya pola:
```text
components/
hooks/
services/
schemas/
constants/
utils/
```

## App Route Target
```text
src/app/(dashboard)/
  page.js
  sales/
  ops/
  finance/
  master/
  settings/
```
