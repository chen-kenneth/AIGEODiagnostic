import { LanguageProvider } from './context/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Shift from './components/Shift'
import WhatWeDo from './components/WhatWeDo'
import Results from './components/Results'
import HowAIWorks from './components/HowAIWorks'
import Process from './components/Process'
import Diagnostic from './components/Diagnostic'
import NicheFocus from './components/NicheFocus'
import WhyUs from './components/WhyUs'
import CTAForm from './components/CTAForm'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <Shift />
        <WhatWeDo />
        <Results />
        <HowAIWorks />
        <Process />
        <Diagnostic />
        <NicheFocus />
        <WhyUs />
        <CTAForm />
        <FAQ />
      </main>
      <Footer />
    </LanguageProvider>
  )
}
