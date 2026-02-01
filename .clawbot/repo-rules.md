# ClawBot Repo Rules (v1)

## Project Type
- Frontend: Next.js (App Router)
- Backend: External (not in this repo)

## Required Files
- package.json
- .env.local
- next.config.ts
- tsconfig.json

## Forbidden Files
- *.java
- *.class
- temp test files outside /tests

## Environment Rules
- App must not crash if env values are missing
- Use safe fallbacks in dev mode

## Error Policy
- Runtime crashes = critical
- Missing env = warn + guide
- Deprecated deps = warn

## Fix Policy
- Never delete user code
- Always explain fixes before applying
