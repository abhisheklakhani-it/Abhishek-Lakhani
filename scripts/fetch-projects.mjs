// Collects public GitHub repositories and writes public/github-projects.json.
//
// Repositories without any code are skipped. Each repo gets a short
// description: its GitHub description if set, otherwise the opening of its
// README, otherwise a summary written from the files it contains.
//
// Usage: GITHUB_TOKEN=... node scripts/fetch-projects.mjs
// (the token is optional locally, but raises GitHub's rate limit)

import { writeFile } from 'node:fs/promises'

const USERNAME = 'abhisheklakhani-it'
const OUTPUT = new URL('../public/github-projects.json', import.meta.url)

// Repos that aren't projects: the profile README repo and portfolio sites.
const EXCLUDED_REPOS = new Set([USERNAME, 'Portfolio', 'Abhishek-Lakhani', `${USERNAME}.github.io`])

// Descriptions to use instead of the generated/GitHub ones for specific repos.
const DESCRIPTION_OVERRIDES = {
  spendly:
    'An expense tracking web app made with Flask, with user registration and login for logging and categorizing spending.',
}

const MAX_DESCRIPTION = 220

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': USERNAME }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const api = async (path, { raw = false } = {}) => {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: raw ? { ...headers, Accept: 'application/vnd.github.raw' } : headers,
  })
  if (res.status === 404 || res.status === 409) return null // missing file / empty repo
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}: ${await res.text()}`)
  return raw ? res.text() : res.json()
}

// ---------------------------------------------------------------------------
// Text helpers

// Drops "built/made/created ... using/with/by X" credit clauses.
const stripCredits = (text) =>
  text.replace(/\s*,?\s*\b(?:built|made|created|generated|developed)\s+(?:using|with|by)\s+[^.,;!?]*/gi, '')

const clean = (text) =>
  stripCredits(text)
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim()

// Keeps whole sentences up to the length limit.
const truncate = (text) => {
  if (text.length <= MAX_DESCRIPTION) return text
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? []
  let out = ''
  for (const sentence of sentences) {
    if ((out + sentence).length > MAX_DESCRIPTION) break
    out += sentence
  }
  if (out.trim().length >= 60) return out.trim()
  return `${text.slice(0, MAX_DESCRIPTION).replace(/\s+\S*$/, '')}…`
}

const ensurePeriod = (text) => (/[.!?…]$/.test(text) ? text : `${text}.`)

const listJoin = (items) =>
  items.length <= 1
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

const humanize = (name) =>
  name
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim()

// ---------------------------------------------------------------------------
// Titles

// Words used to split run-together repo names like "appgithubaction".
const WORDS = ['github', 'action', 'project', 'tracker', 'budget', 'weather', 'classifier', 'analysis', 'machine', 'learning', 'chatbot', 'app', 'api', 'web', 'bot', 'data', 'todo', 'list', 'game', 'ml', 'ai', 'nlp', 'llm', 'rag']
const WORD_CASE = { github: 'GitHub', ml: 'ML', ai: 'AI', nlp: 'NLP', llm: 'LLM', rag: 'RAG', api: 'API' }

const splitWords = (word) => {
  // Longest-match segmentation; gives up (returns null) on unknown fragments.
  if (!word) return []
  for (const candidate of [...WORDS].sort((a, b) => b.length - a.length)) {
    if (word.startsWith(candidate)) {
      const rest = splitWords(word.slice(candidate.length))
      if (rest) return [candidate, ...rest]
    }
  }
  return null
}

const titleCase = (word) => WORD_CASE[word.toLowerCase()] ?? word[0].toUpperCase() + word.slice(1)

const titleFromName = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .flatMap((part) => (/^[a-z]+$/.test(part) ? (splitWords(part) ?? [part]) : [part]))
    .map(titleCase)
    .join(' ')

// A short README heading ("Machine Learning Project By Abhishek Lakhani") makes a good title.
const titleFromReadme = (markdown) => {
  const heading = markdown.match(/^\s*#{1,2}\s+(.+)$/m)?.[1] ?? markdown.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]
  if (!heading) return null
  const title = heading.replace(/[*_`]/g, '').replace(/\s+by\s+.*$/i, '').trim()
  const words = title.split(/\s+/).length
  return words >= 2 && words <= 5 && !/^(this|welcome|the)\b/i.test(title) ? title : null
}

// ---------------------------------------------------------------------------
// README summary

const readmeSummary = (markdown, repoName) => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '\n\n') // code blocks
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '\n\n')
    .replace(/<\/?(?:h[1-6]|p|div)[^>]*>/gi, '\n\n')
    .replace(/<[^>]+>/g, '') // other HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images / badges
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[*_`~]+/g, '')

  const title = humanize(repoName).replace(/\s+/g, '')
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').filter((line) => !/^\s*(#|[-*+]\s|\d+\.\s|\||>)/.test(line)).join(' '))
    .map((p) => p.replace(/\s+/g, ' ').trim())
    // Skip greetings like "Welcome to the WeatherApp!" but keep what follows.
    .map((p) => p.replace(/^welcome to [^.!?]*[.!?]\s*/i, ''))
    .filter((p) => p.length >= 50 && p.toLowerCase().replace(/[^a-z]/g, '') !== title)

  if (!paragraphs.length) return null
  const summary = paragraphs[0]
    .replace(/^this is (an?|the) /i, (_, article) => `${article[0].toUpperCase()}${article.slice(1)} `)
    .replace(/^this (.+?) is (designed|meant|built|used) to /i, 'A $1 $2 to ')
  return truncate(clean(summary))
}

// ---------------------------------------------------------------------------
// Summary written from the repository's contents

const LIBRARY_NAMES = {
  'scikit-learn': 'scikit-learn',
  sklearn: 'scikit-learn',
  tensorflow: 'TensorFlow',
  keras: 'Keras',
  torch: 'PyTorch',
  pytorch: 'PyTorch',
  transformers: 'Hugging Face Transformers',
  langchain: 'LangChain',
  xgboost: 'XGBoost',
  catboost: 'CatBoost',
  lightgbm: 'LightGBM',
  pandas: 'pandas',
  numpy: 'NumPy',
  opencv: 'OpenCV',
  'opencv-python': 'OpenCV',
  streamlit: 'Streamlit',
  flask: 'Flask',
  django: 'Django',
  fastapi: 'FastAPI',
  react: 'React',
  vue: 'Vue',
  express: 'Express',
  next: 'Next.js',
}
const ML_LIBS = new Set(['scikit-learn', 'TensorFlow', 'Keras', 'PyTorch', 'XGBoost', 'CatBoost', 'LightGBM', 'Hugging Face Transformers'])
const WEB_FRAMEWORKS = new Set(['Flask', 'Django', 'FastAPI', 'Streamlit', 'Express', 'Next.js', 'React', 'Vue'])

const PIPELINE_STAGES = [
  [/data_?ingestion/, 'data ingestion'],
  [/data_?transformation|preprocess/, 'data transformation'],
  [/model_?train|train_pipeline/, 'model training'],
  [/predict/, 'prediction'],
]

const parseRequirements = (text) =>
  text
    .split('\n')
    .map((line) => line.split(/[<>=!~;[\s#]/)[0].trim().toLowerCase())
    .filter(Boolean)

const contentsSummary = async (repo, languages) => {
  const tree = (await api(`/repos/${repo.full_name}/git/trees/HEAD?recursive=1`))?.tree ?? []
  const paths = tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path)
  const lower = paths.map((p) => p.toLowerCase())
  const has = (re) => lower.some((p) => re.test(p))

  const libraries = []
  const addLibrary = (pkg) => {
    const name = LIBRARY_NAMES[pkg]
    if (name && !libraries.includes(name)) libraries.push(name)
  }
  if (paths.includes('requirements.txt')) {
    parseRequirements((await api(`/repos/${repo.full_name}/contents/requirements.txt`, { raw: true })) ?? '').forEach(addLibrary)
  }
  if (paths.includes('package.json')) {
    try {
      const pkg = JSON.parse((await api(`/repos/${repo.full_name}/contents/package.json`, { raw: true })) ?? '{}')
      Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).forEach(addLibrary)
    } catch {
      // ignore malformed package.json
    }
  }

  let pageTitle = null
  if (paths.includes('index.html')) {
    const html = (await api(`/repos/${repo.full_name}/contents/index.html`, { raw: true })) ?? ''
    pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? null
  }

  const langs = Object.keys(languages)
  const framework = libraries.find((lib) => WEB_FRAMEWORKS.has(lib))
  const mlLibs = libraries.filter((lib) => ML_LIBS.has(lib))
  const isWebFrontend = langs.includes('HTML') && langs.includes('JavaScript')

  // What it is.
  let subject
  if (mlLibs.length || has(/\.ipynb$/)) {
    const stages = PIPELINE_STAGES.filter(([re]) => has(re)).map(([, label]) => label)
    // Notebook names often say what's being analyzed, e.g. "1. EDA Student Performance".
    const topic = paths
      .filter((p) => p.endsWith('.ipynb'))
      .map((p) => humanize(p.split('/').pop()))
      .map((name) =>
        name
          .replace(/[^a-z\s]/g, ' ')
          .replace(/\b(eda|model|training|notebook|analysis|and|the)\b/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
      .find(Boolean)
    subject = `${stages.length >= 2 ? 'An end-to-end machine learning project' : 'A machine learning project'}${topic ? ` on ${topic}` : ''}`
    if (stages.length >= 2) subject += ` with ${listJoin(stages)} pipelines`
  } else if (framework && framework !== 'React' && framework !== 'Vue') {
    subject = `A ${framework} web application`
  } else if (isWebFrontend && pageTitle) {
    const title = pageTitle.replace(/\s+by\s+.*$/i, '')
    subject = /game/i.test(title)
      ? `A browser-based ${title.replace(/\s*game\s*/i, ' ').trim()} game`
      : `A web app: ${title}`
  } else {
    subject = `A ${langs[0] ?? 'software'} project`
  }

  // What's notable about it.
  const extras = []
  const modules = paths
    .filter((p) => /^src\/[^/]+\.py$/.test(p) && !/__init__|utils|logger|exception/.test(p))
    .map((p) => humanize(p.split('/').pop()))
  if (modules.length && !mlLibs.length) extras.push(listJoin(modules.slice(0, 2)))
  if (has(/(^|\/)tests?\//) || libraries.includes('pytest') || has(/test_.*\.py$/)) extras.push('automated tests')
  if (has(/^\.github\/workflows\//)) extras.push('a GitHub Actions CI pipeline')

  let sentence = subject
  if (extras.length) sentence += ` with ${listJoin(extras)}`

  // pandas/NumPy are implied for ML projects, so only name them elsewhere.
  const implied = mlLibs.length ? ['pandas', 'NumPy'] : []
  const shownLibs = libraries.filter((lib) => lib !== framework && !implied.includes(lib))
  if (shownLibs.length) sentence += `, using ${listJoin(shownLibs.slice(0, 3))}`
  else if (isWebFrontend && !framework) {
    sentence += `, made with ${listJoin(['HTML', 'CSS', 'JavaScript', 'TypeScript'].filter((l) => langs.includes(l)))}`
  }

  return ensurePeriod(sentence.replace(/ with ([^,]+) with /, ' with $1, plus '))
}

// ---------------------------------------------------------------------------

const describe = async (repo, languages, readme) => {
  if (DESCRIPTION_OVERRIDES[repo.name]) return { text: DESCRIPTION_OVERRIDES[repo.name], source: 'override' }

  const fromGitHub = repo.description ? clean(repo.description) : ''
  if (fromGitHub.length >= 20) return { text: ensurePeriod(fromGitHub), source: 'github' }

  const fromReadme = readme ? readmeSummary(readme, repo.name) : null
  if (fromReadme) return { text: ensurePeriod(fromReadme), source: 'readme' }

  return { text: await contentsSummary(repo, languages), source: 'contents' }
}

const main = async () => {
  const repos = (await api(`/users/${USERNAME}/repos?per_page=100&sort=pushed`)) ?? []
  const projects = []

  for (const repo of repos) {
    if (repo.fork || repo.archived || EXCLUDED_REPOS.has(repo.name)) continue

    // No languages detected means no code (empty repo or README only).
    const languages = repo.size > 0 ? ((await api(`/repos/${repo.full_name}/languages`)) ?? {}) : {}
    if (Object.keys(languages).length === 0) {
      console.log(`skip  ${repo.name} (no code)`)
      continue
    }

    const readme = await api(`/repos/${repo.full_name}/readme`, { raw: true })
    const title = (readme && titleFromReadme(readme)) || titleFromName(repo.name)
    const { text, source } = await describe(repo, languages, readme)
    console.log(`keep  ${title} (${repo.name}) [${source}] ${text}`)

    projects.push({
      id: repo.id,
      name: repo.name,
      title,
      description: text,
      html_url: repo.html_url,
      homepage: repo.homepage || null,
      language: repo.language,
      topics: repo.topics ?? [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      pushed_at: repo.pushed_at,
    })
  }

  await writeFile(OUTPUT, `${JSON.stringify(projects, null, 2)}\n`)
  console.log(`\nWrote ${projects.length} projects to public/github-projects.json`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
