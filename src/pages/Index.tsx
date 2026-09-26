import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Education from '@/components/Education'
import BeyondCode from '@/components/BeyondCode'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'

const Index = () => {
  return (
    <PageTransition className="min-h-screen bg-transparent text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
    </PageTransition>
  )
}

export default Index
