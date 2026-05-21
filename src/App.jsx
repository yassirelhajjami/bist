import { useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Levels from './components/Levels'
import Teaching from './components/Teaching'
import Admissions from './components/Admissions'
import Gallery from './components/Gallery'
import News from './components/News'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Levels />
        <Teaching />
        <Admissions />
        <Gallery />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
    </LanguageProvider>
  )
}

export default App
