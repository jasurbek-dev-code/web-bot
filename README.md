# Web Bot

Telegram web app storefront for catalog browsing, cart checkout, and order history.

## Local run

1. Install dependencies:

```bash
npm install
```

2. Start the development server (Vite):

```bash
npm run dev
```

3. Open `http://localhost:3000/`.

## Environment

- `NEXT_PUBLIC_BASE_URL`: bot backend API base URL
- `NEXT_PUBLIC_SITE_URL`: public site origin for metadata and sitemap generation

## Notes

- Rocket-generated external scripts and remote asset dependencies were removed.
- The app now prefers local assets only; remote images outside approved project origins fall back to `public/placeholder.png`.
- Telegram Web App SDK remains because the mini app depends on Telegram integration.

## Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build the application for production
- `npm run start` - Preview the production build on port 3000
- `npm run serve` - Preview the production build on port 3000
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
