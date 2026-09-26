import { useQuery } from '@tanstack/react-query'

export const GITHUB_USERNAME = 'abhisheklakhani-it'

// Repos that exist on GitHub but aren't projects worth showing.
const EXCLUDED_REPOS = new Set([
  GITHUB_USERNAME, // profile README repo
  'Portfolio',
  'Abhishek-Lakhani', // this site
  `${GITHUB_USERNAME}.github.io`,
])

export interface GitHubRepo {
  id: number
  name: string
  /** Display title; set by the build script, otherwise derived from `name`. */
  title?: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  pushed_at: string
}

// Written at build time by scripts/fetch-projects.mjs: code-only repos with
// descriptions filled in from GitHub, the README, or the repo's contents.
const fetchGeneratedProjects = async (): Promise<GitHubRepo[] | null> => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}github-projects.json`)
    if (!res.ok) return null
    const data: unknown = await res.json()
    return Array.isArray(data) ? (data as GitHubRepo[]) : null
  } catch {
    return null
  }
}

// Fallback when the generated file isn't there (e.g. local dev without running
// `npm run projects`): ask GitHub directly and skip empty repos.
const fetchLiveRepos = async (): Promise<GitHubRepo[]> => {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
    { headers: { Accept: 'application/vnd.github+json' } }
  )
  if (!res.ok) {
    throw new Error(
      res.status === 403
        ? 'GitHub rate limit reached — try again in a bit.'
        : `GitHub responded with ${res.status}`
    )
  }

  const repos: (GitHubRepo & { fork: boolean; archived: boolean; size: number })[] =
    await res.json()
  return repos
    .filter((repo) => !repo.fork && !repo.archived && repo.size > 0)
    .map((repo) => ({
      ...repo,
      description:
        repo.description
          ?.replace(/\s*,?\s*\b(?:built|made|created|generated|developed)\s+(?:using|with|by)\s+[^.,;!?]*/gi, '')
          .trim() || null,
    }))
}

const fetchRepos = async (): Promise<GitHubRepo[]> => {
  const repos = (await fetchGeneratedProjects()) ?? (await fetchLiveRepos())
  return repos
    .filter((repo) => !EXCLUDED_REPOS.has(repo.name))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
}

export const useGitHubRepos = () =>
  useQuery({
    queryKey: ['github-repos', GITHUB_USERNAME],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
