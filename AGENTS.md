# AI Assistant Rules for SIGNAL by YOURSSU

This Korean dating/profile app has specific patterns that differ from standard React practices. Follow these rules to avoid common mistakes.

## 🚨 Critical Project-Specific Patterns

### Authentication & State Management

- **Jotai with localStorage**: Authentication uses `atomWithStorage` with `getOnInit: true` for SSR-safe hydration
- **Token Management**: Access tokens have 30-second expiry buffer in `isAuthenticatedAtom`
- **Custom Fetch**: Use `authedFetch` from `src/lib/fetch.ts` which automatically handles Jotai auth tokens
- **Action Atoms**: Use `setTokensAtom` and `clearTokensAtom` for atomic token operations

### Development Environment

- **MSW Auto-Init**: MSW is automatically started in `main.tsx` for development - don't initialize it elsewhere
- **Mock Data Context**: All mocks use Korean university context (숭실대, 테스트학과) and Korean language responses
- **DevTools**: Custom DevTools component only shows when `MODE !== "production"` - already integrated in Layout

### Feature Flags & Environment

- **Feature Toggles**: App routing is controlled by feature flags in `env.ts` (ENABLE_PROFILE_VIEW, ENABLE_REGISTER, etc.)
- **Environment Variables**: Use `src/env.ts` for all env vars - it handles validation and defaults
- **Mode Detection**: Use `MODE` from env.ts, not `process.env.NODE_ENV`

### Domain-Specific Types

- **MBTI Types**: Use template literal type `Mbti` for type safety - only valid MBTI combinations allowed
- **Animal Profiles**: AnimalType enum with Korean display names in `lib/animal.ts`
- **Korean Context**: All API responses include Korean university/department context

### Analytics & Payments

- **Virtual Currency**: Track "티켓" (tickets) as virtual currency in analytics events
- **Toss Payments**: Use `generateTossPaymentURL` utility for payment flows with device detection
- **Korean Analytics**: All analytics events use Korean language parameters

### API & Error Handling

- **Response Format**: All APIs return `SuccessResponse<T>` or `ErrorResponse` with timestamp
- **SignalError**: Custom error class with status codes and timestamps
- **Mock Handlers**: Comprehensive MSW handlers in `mocks/handlers.ts` with realistic Korean data

### Styling & Layout

- **Mobile-First**: Uses `dvh` units and `max-w-md mx-auto` container pattern
- **TailwindCSS v4**: Custom configuration with CSS variables, not legacy config format
- **Background**: Custom Background component integrated in Layout - don't add your own

## 🛠️ Commands & Configuration

```bash
# Development (with MSW auto-start)
pnpm dev

# Build & Preview
pnpm build
pnpm preview

# Code Quality
pnpm lint    # ESLint with custom unused vars rule
pnpm format  # Prettier with double quotes preference
```

## 🚫 Common Mistakes to Avoid

1. **DON'T** initialize MSW manually - it's auto-started in main.tsx
2. **DON'T** use `fetch()` directly - use `authedFetch` for authenticated requests
3. **DON'T** hardcode Korean text - it's already integrated throughout the app
4. **DON'T** add your own authentication state - use existing Jotai atoms
5. **DON'T** ignore feature flags - they control core app functionality
6. **DON'T** create test files - no testing framework is configured

## 🎯 Quick Start for New Features

1. Check feature flags in `env.ts` and `App.tsx` routing
2. Use `authedFetch` for API calls with existing auth state
3. Follow existing MSW mock patterns in `handlers.ts`
4. Use TypeScript types from `types/` directory
5. Follow mobile-first container pattern in Layout.tsx
6. Add analytics events using existing Korean context pattern

## 📁 Key Files to Reference

- `src/env.ts` - Environment config & feature flags
- `src/atoms/authTokens.ts` - Authentication state management
- `src/lib/fetch.ts` - Custom authenticated fetch utility
- `src/mocks/handlers.ts` - API mock definitions
- `src/App.tsx` - Feature flag-based routing
- `src/types/` - Comprehensive TypeScript definitions
