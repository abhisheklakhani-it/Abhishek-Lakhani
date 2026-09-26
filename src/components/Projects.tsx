import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { GITHUB_USERNAME, useGitHubRepos, type GitHubRepo } from '@/hooks/use-github-repos'

const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
const AUTO_SCROLL_MS = 3500

interface Project {
  title: string
  description: string
  tags: string[]
  /** Name of the matching GitHub repo, if the project lives in one. */
  repo?: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    title: 'SmartVisual.ai',
    description:
      'AI analytics assistant that turns natural-language questions into SQL, analyzes data, and auto-builds dashboards with interactive charts and insights.',
    tags: ['LLM', 'SQL', 'Data Viz', 'MLOps'],
    featured: true,
  },
  {
    title: 'LLM-Powered Resume ATS Analyzer',
    description:
      'Compares resumes with job descriptions using Google Gemini Pro Vision, scores similarity, detects missing ATS keywords, and suggests improvements.',
    tags: ['LLM', 'Gemini', 'Streamlit', 'ATS'],
  },
  {
    title: 'AI Chatbot (NLP)',
    description:
      'Deep Learning & NLP chatbot achieving ~80% accuracy for intent classification and natural language understanding.',
    tags: ['NLP', 'Deep Learning', 'Text Classification'],
  },
  {
    title: 'Bird Species Classification',
    description:
      'Image classifier for bird species using CNN architecture with strong evaluation accuracy.',
    tags: ['Computer Vision', 'CNN', 'TensorFlow'],
    repo: 'bird_species_classifier',
  },
  {
    title: 'Sentiment Analysis',
    description:
      'Sentiment model that classifies text into positive/negative/neutral categories with high accuracy.',
    tags: ['NLP', 'Sentiment', 'ML'],
  },
]

const TAG_COLORS: Record<string, string> = {
  LLM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  SQL: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Data Viz': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  MLOps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Gemini: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Streamlit: 'bg-red-500/20 text-red-300 border-red-500/30',
  ATS: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  NLP: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Deep Learning': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'Text Classification': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Computer Vision': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  CNN: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  TensorFlow: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Sentiment: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  ML: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
}

const DEFAULT_TAG = 'bg-secondary/50 text-muted-foreground border-border/50'

const LANGUAGE_COLORS: Record<string, string> = {
  Python: 'bg-sky-400',
  'Jupyter Notebook': 'bg-orange-400',
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  HTML: 'bg-rose-400',
  CSS: 'bg-violet-400',
  'C++': 'bg-pink-400',
}

interface DisplayProject {
  key: string
  title: string
  description: string
  tags: string[]
  url: string
  homepage?: string | null
  language?: string | null
  stars?: number
  featured?: boolean
}

// "bird_species_classifier" -> "Bird Species Classifier"
const prettifyName = (name: string) =>
  name
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase())

// Loose word-stem set, so "Bird Species Classification" matches "bird_species_classifier".
const nameStems = (name: string) =>
  new Set(
    name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .map((word) => word.slice(0, 5))
  )

const isSameProject = (project: Project, repo: GitHubRepo) => {
  if (project.repo) return project.repo.toLowerCase() === repo.name.toLowerCase()
  const a = nameStems(project.title)
  const b = nameStems(repo.name)
  const [small, large] = a.size <= b.size ? [a, b] : [b, a]
  if (small.size === 0) return false
  if (small.size < 2 && a.size !== b.size) return false
  return [...small].every((stem) => large.has(stem))
}

// Hand-written projects first, then every other repo; each project appears once.
const mergeProjects = (repos: GitHubRepo[] = []): DisplayProject[] => {
  const usedRepoIds = new Set<number>()

  const curated = PROJECTS.map((project): DisplayProject => {
    const repo = repos.find((r) => !usedRepoIds.has(r.id) && isSameProject(project, r))
    if (repo) usedRepoIds.add(repo.id)
    return {
      key: `project-${project.title}`,
      title: project.title,
      description: project.description,
      tags: project.tags,
      url: repo?.html_url ?? PROFILE_URL,
      homepage: repo?.homepage,
      language: repo?.language,
      stars: repo?.stargazers_count,
      featured: project.featured,
    }
  })

  const fromGitHub = repos
    .filter((repo) => !usedRepoIds.has(repo.id))
    .map(
      (repo): DisplayProject => ({
        key: `repo-${repo.id}`,
        title: prettifyName(repo.name),
        description: repo.description || 'Source code and details are on GitHub.',
        tags: repo.topics?.slice(0, 4) ?? [],
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
      })
    )

  return [...curated, ...fromGitHub]
}

const ProjectCard = ({ project }: { project: DisplayProject }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group relative glass-card p-6 h-full flex flex-col hover:border-primary/40 transition-colors duration-300"
  >
    {project.featured && (
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-accent" />
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
          Flagship Project
        </span>
      </div>
    )}

    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
      {project.title}
    </h3>
    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{project.description}</p>

    {project.tags.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${TAG_COLORS[tag] ?? DEFAULT_TAG}`}
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {(project.language || (project.stars ?? 0) > 0) && (
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        {project.language && (
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${LANGUAGE_COLORS[project.language] ?? 'bg-muted-foreground'}`}
            />
            {project.language}
          </span>
        )}
        {(project.stars ?? 0) > 0 && (
          <span className="flex items-center gap-1">
            <Star size={12} />
            {project.stars}
          </span>
        )}
      </div>
    )}

    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <GithubIcon size={16} />
          View on GitHub
        </a>
      </Button>
      {project.homepage && (
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <a href={project.homepage} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            Live Demo
          </a>
        </Button>
      )}
    </div>

    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl" />
  </motion.div>
)

const CardSkeleton = () => (
  <div className="glass-card p-6 h-full animate-pulse">
    <div className="h-5 w-2/3 rounded bg-secondary mb-4" />
    <div className="h-3 w-full rounded bg-secondary mb-2" />
    <div className="h-3 w-5/6 rounded bg-secondary mb-6" />
    <div className="h-3 w-1/3 rounded bg-secondary" />
  </div>
)

const CARD_WIDTH = 'w-[85%] sm:w-[340px] shrink-0 snap-start'

const Projects = () => {
  const { data: repos, isLoading } = useGitHubRepos()
  const projects = useMemo(() => mergeProjects(repos), [repos])

  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  const step = () => {
    const el = trackRef.current
    const card = el?.firstElementChild as HTMLElement | null
    return card ? card.offsetWidth + 24 : 340
  }

  const scrollByCards = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * step(), behavior: 'smooth' })
  }

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [projects, updateArrows])

  // Glide through the projects left to right, then return to the first one.
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      const el = trackRef.current
      if (!el) return
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step(), behavior: 'smooth' })
    }, AUTO_SCROLL_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section id="projects" className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-transparent" />

      <div className="relative section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title gradient-text mb-4">Featured Projects</h2>
          <p className="section-subtitle mx-auto">Practical AI solutions I've built</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mb-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">
              {projects.length} projects
            </p>
            <div className="flex gap-2">
              <Button
                variant="glass"
                size="icon"
                aria-label="Previous projects"
                disabled={!canPrev}
                onClick={() => scrollByCards(-1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="glass"
                size="icon"
                aria-label="Next projects"
                disabled={!canNext}
                onClick={() => scrollByCards(1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div
            ref={trackRef}
            onScroll={updateArrows}
            className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-3 -my-3"
          >
            {projects.map((project) => (
              <div key={project.key} className={CARD_WIDTH}>
                <ProjectCard project={project} />
              </div>
            ))}
            {isLoading &&
              Array.from({ length: 2 }, (_, i) => (
                <div key={`skeleton-${i}`} className={CARD_WIDTH}>
                  <CardSkeleton />
                </div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="hero-outline" size="lg" asChild className="group">
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={20} className="mr-2" />
              More on GitHub
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
