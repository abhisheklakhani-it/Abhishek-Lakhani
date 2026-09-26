import { useQuery } from '@tanstack/react-query'

export const GITHUB_USERNAME = 'abhisheklakhani-it'

// Repos that exist on GitHub but aren't projects worth showing.
const EXCLUDED_REPOS = new Set([
  GITHUB_USERNAME, // profile README repo
  'Portfolio',
  `${GITHUB_USERNAME}.github.io`,
])

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  fork: boolean
  archived: boolean
  pushed_at: string
}

const fetchRepos = async (): Promise<GitHubRepo[]> => {
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

  const repos: GitHubRepo[] = await res.json()
  return repos
    .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOS.has(repo.name))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
}

export const useGitHubRepos = () =>
  useQuery({
    queryKey: ['github-repos', GITHUB_USERNAME],
    queryFn: fetchRepos,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
