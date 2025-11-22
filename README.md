# Hercules: Next.js Low-Code Agent Platform

A modern, hybrid rendering architecture for generative UI, designed to be Agent-friendly and performant.

## Architecture Highlights

This project implements a **Hybrid Rendering Strategy** that leverages React Server Components (RSC) to minimize Client Bundle size.

### 1. Engine vs Widgets
We strictly separate the "Engine" (Core Logic) from "Widgets" (Business Components).
- **`lib/engine`**: Contains the recursive rendering logic, type definitions, and registry helpers. It is agnostic to specific business logic.
- **`widgets/`**: Contains the actual UI components (Text, Image, Tab, etc.) as top-level citizens.

### 2. Dual Registry System
We split the component registry into two parts to enforce separation of concerns:

- **`widgets/server-registry.tsx`**: Contains stateless RSCs (Text, Image). These are rendered as static HTML on the server.
- **`widgets/client-registry.tsx`**: Contains interactive Client Components (Tab, Shelf). These are hydrated on the client.

### 3. Recursive Rendering Engine
- **`ServerRecursiveRenderer`**: The root entry point (RSC).
- **`ClientRecursiveRenderer`**: Used inside interactive containers (Tab) to render nested children dynamically.

### 4. State Management (Context)
- **Business Contexts**: Located in `context/` (e.g. `LocaleContext`).
- **Providers**: Grouped in `providers/index.tsx` to avoid cluttering `page.tsx`.
- **RSC Consumption**: Server Components cannot directly consume Context. Use the **Client Wrapper Pattern** (like `LocaleBadge` inside `Text`) to inject context-dependent UI into static Server Components.

### 5. Code-to-Agent Pipeline
We treat **Code as the Single Source of Truth**.
- Run `pnpm run gen:docs` to scan Zod Schemas.
- It generates `agent-manual.md`, a perfect documentation file to feed into LLM Agents (Dify/GPT).

## Usage

### Development
```bash
pnpm dev
```

### Generate Agent Docs
```bash
pnpm run gen:docs
```

## Directory Structure
```
app/                    # Next.js App Router
lib/
  engine/               # Core Low-Code Engine
    renderer/
      ServerRecursiveRenderer.tsx
      ClientRecursiveRenderer.tsx
      ServerFloorItem.tsx
    types.ts
    utils.tsx
widgets/                # Business Components (Top Level)
  Image/
  Text/
  Tab/
  Shelf/
  server-registry.tsx
  client-registry.tsx
  full-registry.ts
context/                # Global Contexts (Locale, Theme)
providers/              # Application Providers
scripts/
  generate-agent-docs.ts  # Knowledge Base Generator
```
