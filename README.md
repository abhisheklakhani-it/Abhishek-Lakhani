# Abhishek Lakhani — Portfolio

Personal portfolio site built with React, TypeScript, Vite, Tailwind CSS, and
shadcn/ui. The contact form is backed by a Supabase Edge Function that sends
email via Resend.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Three.js](https://threejs.org) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) for the hero visual
- [React Router](https://reactrouter.com) for routing
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Supabase](https://supabase.com) for the contact form edge function

## Getting started

```bash
npm install
npm run dev
```

Copy the Supabase project URL and publishable (anon) key into `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Available scripts

| Script            | Description                        |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the Vite dev server           |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Contact form / Supabase function

The contact form invokes the `send-contact-email` Supabase Edge Function
(`supabase/functions/send-contact-email`). To deploy it:

```bash
npx supabase functions deploy send-contact-email
npx supabase secrets set RESEND_API_KEY=your-resend-api-key
```

## Project structure

- `src/components` — page sections and shared UI (shadcn/ui primitives live in `src/components/ui`)
- `src/pages` — route-level pages
- `src/integrations/supabase` — Supabase client and generated types
- `supabase/functions` — Edge Functions
