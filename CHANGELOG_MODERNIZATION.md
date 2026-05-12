# Modernization Notes

## Branch baseline

This package is based on the freshest application branch found in the uploaded repository (`origin/dev`). The other uploaded branches were reviewed, but their differences were primarily deployment, environment, and private registry configuration rather than newer application features.

## Removed private/company coupling

- Removed GitLab CI and private registry deployment dependencies.
- Removed private registry variables, hard-coded company domains, private curl/token-based runtime configuration, and old deployment-only environment files.
- Replaced the old runtime `env-config.js` generation with a generic environment-variable entrypoint.
- Replaced branded images with neutral SVG assets.
- Removed local bundled fonts from the distribution.

## Frontend upgrade

- Migrated to Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, and current package versions available during modernization.
- Replaced deprecated `next/config` runtime config usage with `NEXT_PUBLIC_*` and browser runtime `window._env_` values.
- Migrated to ESLint flat config for Next.js 16.
- Updated Axios interceptor code for Axios v1 headers.
- Updated AG Charts React usage for the current package exports.
- Fixed TypeScript and React 19 compatibility issues.

## Backend replacement

The uploaded archive did not contain C# source files, `.csproj` files, or a `.sln` solution. The .NET/C# coupling was limited to old CI/deployment configuration. A new Python FastAPI backend scaffold was added under `backend/` with:

- `/health` readiness endpoint.
- `/api/config` public runtime config endpoint.
- `/proxy/{service}/{path}` gateway for configured upstream services.
- Dockerfile and environment example.

## Validation performed

- `npm run typecheck` passed.
- `npm run lint` passed with warnings only.
- `npm run build` passed.
- `npm audit --omit=dev` returned zero vulnerabilities after dependency override alignment.
- `python -m py_compile backend/app/*.py` passed.
- Final packaging excludes `node_modules`, `.next`, `.git`, cache files, and bundled font files.
