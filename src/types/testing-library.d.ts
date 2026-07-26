// Registers jest-dom's matcher types (toBeInTheDocument, toHaveAttribute,
// toHaveFocus, …) onto Vitest's `Assertion` interface. Must live under src/
// so it shares a TypeScript program with the *.test.tsx files that use
// those matchers — vitest.setup.ts (project root) registers the same
// package at runtime, but type augmentation and runtime registration are
// separate concerns and both are required.
import '@testing-library/jest-dom/vitest'
