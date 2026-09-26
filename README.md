# Abhishek Lakhani — Portfolio

Personal portfolio of **Abhishek Lakhani**, AI/ML Engineer working on LLMs, RAG
systems, deep learning and MLOps.

**Live site:** https://abhisheklakhani-it.github.io

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?logo=github)

## Features

- **Animated hero**: a Three.js neural-network background that responds to the
  mouse, plus a profile photo and quick links.
- **Live GitHub projects**: the "Latest on GitHub" section loads my public
  repositories from the GitHub API on every visit, so new projects show up
  automatically. Each card links to the repo, and to a live demo when the repo
  has a website set.
- **Curated featured projects**, skills, an experience timeline, education and
  a "Beyond Code" section.
- **Contact form**: sends email through a Supabase Edge Function (via Resend)
  when one is configured. Otherwise it opens the visitor's email app with the
  message filled in.
- **Responsive**: built for desktop and mobile, with smooth Framer Motion
  animations.
- **Automatic deploys**: every push to `main` builds and publishes to GitHub
  Pages.

## Tech stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Three.js](https://threejs.org) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) for the hero background
- [TanStack Query](https://tanstack.com/query) for fetching GitHub repositories
- [React Router](https://reactrouter.com) for routing
- [Supabase](https://supabase.com) Edge Functions for the contact form (optional)

## Getting started

Requires Node.js 20 or newer.

```bash
git clone https://github.com/abhisheklakhani-it/abhisheklakhani-it.github.io.git
cd abhisheklakhani-it.github.io
npm install
npm run dev
```

Then open http://localhost:5173.

### Environment variables (optional)

The site runs without any configuration. To have the contact form send email
through Supabase, copy `.env.example` to `.env` and fill in your project's
values:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Available scripts

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start the Vite dev server           |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Deployment

The site is hosted on **GitHub Pages** for free and deployed by the workflow in
`.github/workflows/deploy.yml`:

1. A push to `main` triggers the workflow.
2. It installs dependencies, builds the site and publishes `dist/` to Pages.

It sets the base path automatically, so it also works if you fork it into a repo
with a different name (served from `/<repo>/`).

To enable the Supabase contact form in production, add `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` as repository secrets
(**Settings → Secrets and variables → Actions**).

## Customizing the GitHub projects section

The GitHub username and the list of hidden repositories are in
`src/hooks/use-github-repos.ts`. Forks and archived repositories are hidden
automatically. Each card uses the repository's GitHub description, topics and
website, so set those on GitHub to control how a project appears.

## Contact form / Supabase function

The contact form calls the `send-contact-email` Supabase Edge Function
(`supabase/functions/send-contact-email`). To deploy it:

```bash
npx supabase functions deploy send-contact-email
npx supabase secrets set RESEND_API_KEY=your-resend-api-key
```

## Project structure

```
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/                        # Static files (resume PDF, favicon)
├── src/
│   ├── assets/                    # Profile photo
│   ├── components/                # Page sections (Hero, About, Projects, …)
│   │   └── ui/                    # shadcn/ui primitives
│   ├── hooks/                     # use-github-repos and other hooks
│   ├── integrations/supabase/     # Supabase client and types
│   └── pages/                     # Route-level pages
└── supabase/functions/            # Edge Functions
```

## Contact

- Email: lakhaniabhi.it@gmail.com
- LinkedIn: [abhishek-lakhani](https://www.linkedin.com/in/abhishek-lakhani-4896271a6/)
- GitHub: [@abhisheklakhani-it](https://github.com/abhisheklakhani-it)
