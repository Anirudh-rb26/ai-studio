# Evaluation Checklist

| Feature/Test                 | Implemented (Y/N) | File Path                              |
| ---------------------------- | ----------------- | -------------------------------------- |
| JWT Auth signup/login        | [x]               | backend/src/routes/auth.ts             |
| Image upload preview         | [x]               | frontend/src/components/Upload.tsx     |
| Abort in-flight request      | [x]               | frontend/src/hooks/useGenerate.ts      |
| Exponential retry logic      | [x]               | frontend/src/hooks/useRetry.ts         |
| 20% simulated overload error | [x]               | backend/src/routes/generations.ts      |
| GET last 5 generations       | [x]               | backend/src/controllers/generations.ts |
| Unit tests backend           | [x]               | backend/tests/auth.test.ts             |
| Unit tests frontend          | []                | frontend/tests/Generate.test.tsx       |
| E2E flow tests               | []                | e2e.spec.ts                            |
| ESLint and Prettier config   | [x]               | .eslintrc.js                           |
| GitHub Actions CI workflow   | [x]               | .github/workflows/ci.yml               |
