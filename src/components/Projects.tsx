import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Lock, Star } from 'lucide-react'
import { GithubIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { GITHUB_USERNAME, useGitHubRepos, type GitHubRepo } from '@/hooks/use-github-repos'

const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
// Rotation speed in px/s; negative moves cards from right to left.
const ROTATION_SPEED = -45

interface Project {
  title: string
  description: string
  tags: string[]
  /** Name of the matching GitHub repo, if the project lives in one. */
  repo?: string
  /** Live site or demo. */
  link?: string
  /** Screenshot, chart or GIF from the project, served from public/projects. */
  image?: string
  /** Demo video from the project; `image` is used as its poster. */
  video?: string
  featured?: boolean
}

const PROJECTS: Project[] = [
  {
    title: 'SmartVisual',
    description:
      'Live AI analytics app anyone can use: upload CSV/Excel, ask in English or German, get KPIs, 18 chart types, maps and insights. The LLM only reads the question; every number is computed in code and checked by a 22-question eval in CI.',
    tags: ['LLM', 'Data Viz', 'React', 'Supabase'],
    link: 'https://www.smartvisual.eu',
    image: 'projects/smartvisual-poster.jpg',
    video: 'projects/smartvisual.mp4',
    featured: true,
  },
  {
    title: 'RAG Document QA',
    description:
      'Ask questions about your PDFs (scanned ones too, via OCR) and get cited answers streamed live. Hybrid BM25 + dense retrieval: nDCG@10 0.728 vs 0.567 for TF-IDF; rejects 87% of off-topic questions; 73 tests.',
    tags: ['RAG', 'LLM', 'FastAPI', 'Docker'],
    repo: 'rag-docqa',
    image: 'projects/rag-docqa.gif',
    featured: true,
  },
  {
    title: 'German Text Classifier',
    description:
      'German news topic classification (10kGNAD): fine-tuned DistilBERT reaches 0.897 macro-F1 vs 0.845 for an embeddings + Qdrant kNN baseline (McNemar p < 0.001).',
    tags: ['NLP', 'Transformers', 'Text Classification', 'Qdrant'],
    repo: 'german-text-classifier',
    image: 'projects/german-classifier.png',
    featured: true,
  },
  {
    title: 'ONNX Inference Optimization',
    description:
      'German DistilBERT exported to ONNX, fused and int8-quantized: 1.46x PyTorch throughput, 4x smaller (68 MB), -0.3 pt accuracy, served by FastAPI in a 147 MB Docker image.',
    tags: ['ONNX', 'MLOps', 'FastAPI', 'Docker'],
    repo: 'onnx-inference-optimization',
    image: 'projects/onnx-throughput.png',
  },
  {
    title: 'LLM Structured Extractor',
    description:
      'Turns messy English/German job postings into validated JSON with Pydantic and retries; all-fields-correct on a held-out set rose from 0.40 to 0.67. 43 tests.',
    tags: ['LLM', 'Pydantic', 'NLP', 'FastAPI'],
    repo: 'llm-structured-extractor',
    image: 'projects/llm-extractor.png',
    featured: true,
  },
  {
    title: 'Retrieval Eval Bench',
    description:
      'TF-IDF vs BM25 vs dense (FAISS) vs hybrid retrieval on BEIR SciFact with a train/test split and significance tests; hybrid wins with nDCG@10 0.734 (p = 0.013).',
    tags: ['Search', 'Evaluation', 'RAG', 'ML'],
    repo: 'retrieval-eval-bench',
    image: 'projects/retrieval-bench.png',
  },
  {
    title: 'Semantic Search API',
    description:
      'Production-style search API with hybrid dense + BM25 retrieval inside Qdrant (nDCG@10 0.737), filters, pagination and a benchmarked cross-encoder reranker. Docker Compose, 33 tests.',
    tags: ['Qdrant', 'Search', 'FastAPI', 'Docker'],
    repo: 'semantic-search-api',
    image: 'projects/semantic-search.png',
  },
  {
    title: 'Test Bench Commissioning App',
    description:
      'Role-based web app that digitalises test-bench commissioning: priority notifications, tablet shop-floor mode, audit log. FastAPI, PostgreSQL, Docker, CI, 137 tests, live demo.',
    tags: ['FastAPI', 'PostgreSQL', 'Docker', 'n8n'],
    repo: 'n8n-test-bench-commissioning-tracker',
    link: 'https://test-bench-commissioning.onrender.com',
    image: 'projects/test-bench.gif',
  },
  {
    title: 'Event Staff Scheduling Platform',
    description:
      'Staff scheduling, event logistics and working-hours approval for a mobile cocktail-bar company with ~100 staff. German/English, mobile-first, GDPR-minded, hosted in Germany. 330+ tests (shown with fictional demo data).',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Playwright'],
    image: 'projects/citydrink.gif',
  },
  {
    title: 'LinkedIn Post Generator',
    description:
      'Few-shot LangChain app that writes English/German LinkedIn posts as validated structured output and flags numbers you never gave. Streamlit UI, 34 tests.',
    tags: ['LLM', 'LangChain', 'Streamlit', 'NLP'],
    repo: 'linkedin-post-generator',
    image: 'projects/linkedin-post.gif',
  },
]

const TAG_COLORS: Record<string, string> = {
  LLM: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Data Viz': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  React: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Supabase: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  SQL: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  MLOps: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Streamlit: 'bg-red-500/20 text-red-300 border-red-500/30',
  NLP: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Deep Learning': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'Text Classification': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Computer Vision': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  TensorFlow: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  ML: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  RAG: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  FastAPI: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Docker: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Qdrant: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Search: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ONNX: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Transformers: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Pydantic: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Evaluation: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  PostgreSQL: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  n8n: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  LangChain: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Next.js': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Playwright: 'bg-green-500/20 text-green-300 border-green-500/30',
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
  /** GitHub link; missing when the code is private. */
  url?: string
  homepage?: string | null
  image?: string
  video?: string
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
      url: repo?.html_url ?? (project.repo ? `${PROFILE_URL}/${project.repo}` : undefined),
      homepage: repo?.homepage || project.link,
      image: project.image,
      video: project.video,
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
        title: repo.title || prettifyName(repo.name),
        description: repo.description || `A ${repo.language ?? 'software'} project.`,
        tags: repo.topics?.slice(0, 4) ?? [],
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
      })
    )

  return [...curated, ...fromGitHub]
}

// React doesn't render the `muted` attribute, so browsers block autoplay;
// mute and start the video by hand once it's mounted.
const DemoVideo = ({ src, poster, label }: { src: string; poster?: string; label: string }) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className="w-full h-full object-cover object-top"
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}

const ProjectCard = ({ project }: { project: DisplayProject }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group relative glass-card p-6 h-full flex flex-col hover:border-primary/40 transition-colors duration-300"
  >
    {(project.image || project.video) && (
      <div className="-mx-2 -mt-2 mb-5 aspect-video overflow-hidden rounded-xl border border-border/50 bg-secondary/40">
        {project.video ? (
          <DemoVideo
            src={`${import.meta.env.BASE_URL}${project.video}`}
            poster={project.image && `${import.meta.env.BASE_URL}${project.image}`}
            label={`${project.title} demo video`}
          />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}${project.image}`}
            alt={`${project.title} screenshot`}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        )}
      </div>
    )}

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
      {project.url ? (
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <GithubIcon size={16} />
            View on GitHub
          </a>
        </Button>
      ) : (
        <span className="inline-flex items-center gap-2 px-3 text-sm text-muted-foreground">
          <Lock size={14} />
          Private code
        </span>
      )}
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

const CARD_WIDTH = 'w-[80vw] max-w-[340px] sm:w-[340px] shrink-0'

const Projects = () => {
  const { data: repos, isLoading } = useGitHubRepos()
  const projects = useMemo(() => mergeProjects(repos), [repos])

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const setRef = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const nudge = useRef(0)
  const paused = useRef(false)
  const [looping, setLooping] = useState(false)

  // Rotate only when the cards overflow the screen; otherwise the second copy
  // would put the same project on screen twice.
  useEffect(() => {
    const viewport = viewportRef.current
    const set = setRef.current
    if (!viewport || !set) return
    const measure = () => setLooping(set.offsetWidth > viewport.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(set)
    return () => observer.disconnect()
  }, [projects.length, isLoading])

  useEffect(() => {
    const track = trackRef.current
    if (!looping || !track) {
      offset.current = 0
      nudge.current = 0
      if (track) track.style.transform = ''
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      const width = setRef.current?.offsetWidth ?? 0

      if (!paused.current && !reducedMotion) offset.current += ROTATION_SPEED * dt
      if (nudge.current) {
        const step = nudge.current * Math.min(1, dt * 8)
        offset.current += step
        nudge.current = Math.abs(nudge.current - step) < 0.5 ? 0 : nudge.current - step
      }

      // Two identical sets side by side; wrapping by one set width is seamless.
      if (width > 0) {
        while (offset.current >= 0) offset.current -= width
        while (offset.current < -width) offset.current += width
      }
      track.style.transform = `translate3d(${offset.current}px, 0, 0)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [looping])

  const cardStep = () => {
    const card = setRef.current?.firstElementChild as HTMLElement | null
    return card ? card.offsetWidth + 24 : 364
  }

  const renderSet = (copy: boolean) => (
    <div
      ref={copy ? undefined : setRef}
      className="flex shrink-0 gap-6 pr-6"
      aria-hidden={copy || undefined}
      inert={copy || undefined}
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
  )

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
          className="mb-12"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onFocusCapture={() => (paused.current = true)}
          onBlurCapture={() => (paused.current = false)}
          onTouchStart={() => (paused.current = true)}
          onTouchEnd={() => window.setTimeout(() => (paused.current = false), 2500)}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-sm text-muted-foreground">{projects.length} projects</p>
            {looping && (
              <div className="flex gap-2">
                <Button
                  variant="glass"
                  size="icon"
                  aria-label="Scroll projects right"
                  onClick={() => (nudge.current += cardStep())}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  variant="glass"
                  size="icon"
                  aria-label="Scroll projects left"
                  onClick={() => (nudge.current -= cardStep())}
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>

          <div
            ref={viewportRef}
            className="overflow-hidden py-3 -my-3"
            style={
              looping
                ? {
                    maskImage:
                      'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
                  }
                : undefined
            }
          >
            <div
              ref={trackRef}
              className={`flex w-max will-change-transform ${looping ? '' : 'mx-auto'}`}
            >
              {renderSet(false)}
              {looping && renderSet(true)}
            </div>
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
