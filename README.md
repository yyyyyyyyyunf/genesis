# Hercules: Next.js Low-Code Agent Platform

A modern, hybrid rendering architecture for generative UI, designed to be Agent-friendly and performant.

## Architecture Highlights

This project implements a **Hybrid Rendering Strategy** that leverages React Server Components (RSC) to minimize Client Bundle size.

### 1. Dual Registry System
We split the component registry into two parts to enforce separation of concerns:

- **`server-registry.tsx`**: Contains stateless RSCs (Text, Image). These are rendered as static HTML on the server. No JS is sent to the client for these (except for interactivity wrappers).
- **`client-registry.tsx`**: Contains interactive Client Components (Tab, Shelf). These are hydrated on the client.
- **`full-registry.ts`**: Combines both registries for use in Client-side recursion (e.g. inside Tabs).

### 2. Recursive Rendering Engine
- **`ServerRecursiveRenderer`**: The root entry point. It runs on the server, iterates over the JSON DSL, and decides whether to render a Server Component directly or wrap a Client Component in `<Suspense>`.
- **`ClientRecursiveRenderer`**: Used inside interactive containers (like Tabs) to render nested children dynamically in the browser.

### 3. Slot Pattern / Client Wrappers
- **Image Component**: It is implemented as an RSC. It renders a static `<img>` tag. However, if a `clickUrl` is provided, it wraps itself in a lightweight `ClientClickTracker` to handle analytics without converting the entire component to a Client Component.

### 4. Code-to-Agent Pipeline
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
components/
  floors/
    Image/          # RSC Implementation with Client Wrapper
    Tab/            # Client Component
    server-registry.tsx
    client-registry.tsx
    full-registry.ts
    utils.tsx       # Registry Helpers
  renderer/
    ServerRecursiveRenderer.tsx  # Root Entry
    ServerFloorItem.tsx          # Server Render Logic Helper
    ClientRecursiveRenderer.tsx  # Nested Client Entry
scripts/
  generate-agent-docs.ts  # Knowledge Base Generator
```
