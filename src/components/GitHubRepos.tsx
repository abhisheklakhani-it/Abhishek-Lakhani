import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, GitFork, Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { GITHUB_USERNAME, useGitHubRepos, type GitHubRepo } from '@/hooks/use-github-repos'

const INITIAL_COUNT = 6

const LANGUAGE_COLORS: Record<string, string> = {
  Python: 'bg-sky-400',
  'Jupyter Notebook': 'bg-orange-400',
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  HTML: 'bg-rose-400',
  CSS: 'bg-violet-400',
  'C++': 'bg-pink-400',
}

// "bird_species_classifier" -> "Bird Species Classifier"
const prettifyName = (name: string) =>
  name
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const formatUpdated = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const RepoCard = ({ repo, index }: { repo: GitHubRepo; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: (index % INITIAL_COUNT) * 0.08 }}
    viewport={{ once: true }}
    whileHover={{ y: -6 }}
    className="group relative glass-card p-6 flex flex-col hover:border-primary/40 transition-all duration-300"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">
        {prettifyName(repo.name)}
      </h4>
      <GithubIcon size={18} className="shrink-0 mt-1 text-muted-foreground" />
    </div>

    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
      {repo.description || 'No description yet — check out the code on GitHub.'}
    </p>

    {repo.topics && repo.topics.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {repo.topics.slice(0, 4).map((topic) => (
          <span
            key={topic}
            className="px-2.5 py-1 text-xs font-medium rounded-full border bg-primary/10 text-primary border-primary/30"
          >
            {topic}
          </span>
        ))}
      </div>
    )}

    <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-muted-foreground">
      {repo.language && (
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${LANGUAGE_COLORS[repo.language] ?? 'bg-muted-foreground'}`}
          />
          {repo.language}
        </span>
      )}
      {repo.stargazers_count > 0 && (
        <span className="flex items-center gap-1">
          <Star size={12} />
          {repo.stargazers_count}
        </span>
      )}
      {repo.forks_count > 0 && (
        <span className="flex items-center gap-1">
          <GitFork size={12} />
          {repo.forks_count}
        </span>
      )}
      <span>Updated {formatUpdated(repo.pushed_at)}</span>
    </div>

    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          <GithubIcon size={16} />
          View on GitHub
        </a>
      </Button>
      {repo.homepage && (
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            Live Demo
          </a>
        </Button>
      )}
    </div>

    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />
  </motion.div>
)

const RepoSkeleton = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="h-5 w-2/3 rounded bg-secondary mb-4" />
    <div className="h-3 w-full rounded bg-secondary mb-2" />
    <div className="h-3 w-5/6 rounded bg-secondary mb-6" />
    <div className="h-3 w-1/3 rounded bg-secondary" />
  </div>
)

const GitHubRepos = () => {
  const { data: repos, isLoading, isError, error } = useGitHubRepos()
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? repos : repos?.slice(0, INITIAL_COUNT)

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-end justify-between gap-4 mb-8"
      >
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">
            Latest on <span className="gradient-text">GitHub</span>
          </h3>
          <p className="text-muted-foreground">
            Pulled live from{' '}
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @{GITHUB_USERNAME}
            </a>
          </p>
        </div>
        {repos && repos.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {repos.length} public {repos.length === 1 ? 'repository' : 'repositories'}
          </span>
        )}
      </motion.div>

      {isLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, i) => (
            <RepoSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="glass-card p-6 text-center text-muted-foreground">
          Couldn't load repositories right now
          {error instanceof Error ? ` (${error.message})` : ''}.{' '}
          <a
            href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            See them on GitHub
          </a>
          .
        </div>
      )}

      {visible && visible.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      )}

      {repos && repos.length > INITIAL_COUNT && (
        <div className="mt-8 text-center">
          <Button variant="glass" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show fewer' : `Show all ${repos.length} repositories`}
          </Button>
        </div>
      )}
    </div>
  )
}

export default GitHubRepos
