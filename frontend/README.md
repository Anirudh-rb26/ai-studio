This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# AI Studio Web Application

## Project Setup

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up Prisma:

- Run Prisma generate to prepare Prisma client
  ```
  npx prisma generate
  ```
- Run any database migrations if applicable:
  ```
  npx prisma migrate deploy
  ```

4. Set up environment variables:

- Create a `.env` file in the `backend` folder with the following content:
  ```
  DATABASE_URL="file:./dev.db"
  API_URL=http://localhost:3001
  FRONTEND_URL=http://localhost:3000
  ```

5. Run the backend server in development mode:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm i
```

3. Set up environment variables:

- Create a `.env` file in the `frontend` folder with the following content:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

4. Run the frontend dev server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

- Backend tests run with Jest and collect coverage.
- Frontend tests use React Testing Library and/or Cypress.

## Environment Variables Summary

- Backend expects:
- `DATABASE_URL` (e.g., "file:./dev.db")
- `API_URL` (e.g., "http://localhost:3001")
- `FRONTEND_URL` (e.g., "http://localhost:3000")
- Frontend expects:
- `NEXT_PUBLIC_API_URL` (e.g., "http://localhost:3001")

## Additional Notes

- Make sure your backend and frontend are running concurrently for full functionality.
- Refer to the API specification file at `backend/openapi.yaml`.
