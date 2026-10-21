import { Router, Route, Switch } from 'wouter'
import { LanguageProvider } from './context/LanguageContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import WhyMatters from './components/WhyMatters'
import Shift from './components/Shift'
import ReportSample from './components/ReportSample'
import WhatWeDo from './components/WhatWeDo'
import HowAIWorks from './components/HowAIWorks'
import Process from './components/Process'
import Results from './components/Results'
import Diagnostic from './components/Diagnostic'
import NicheFocus from './components/NicheFocus'
import About from './components/About'
import ArticlesPreview from './components/ArticlesPreview'
import ArticlesIndex from './components/ArticlesIndex'
import ArticlePage from './components/ArticlePage'
import WhyUs from './components/WhyUs'
import CTAForm from './components/CTAForm'
import FAQ from './components/FAQ'
import Privacy from './components/Privacy'
import Footer from './components/Footer'

function HomePage() {
  return (
    <>
      <Hero />
      <WhyMatters />
      <Shift />
      <ReportSample />
      <WhatWeDo />
      <HowAIWorks />
      <Process />
      <Results />
      <Diagnostic />
      <NicheFocus />
      <About />
      <ArticlesPreview />
      <WhyUs />
      <CTAForm />
      <FAQ />
    </>
  )
}

/**
 * AppShell — hook 可注入：
 * 客户端：默认 wouter browser hook；预渲染：传入静态 hook。
 */
export function AppShell({ hook }) {
  return (
    <Router hook={hook}>
      <LanguageProvider>
        <Nav />
        <main>
          <Switch>
            <Route path="/en" component={HomePage} />
            <Route path="/articles" component={ArticlesIndex} />
            <Route path="/articles/:slug">
              {params => <ArticlePage slug={params.slug} />}
            </Route>
            <Route path="/en/articles" component={ArticlesIndex} />
            <Route path="/en/articles/:slug">
              {params => <ArticlePage slug={params.slug} />}
            </Route>
            <Route path="/privacy" component={Privacy} />
            <Route path="/en/privacy" component={Privacy} />
            <Route path="/" component={HomePage} />
            <Route>
              <section>
                <div className="container">
                  <h1>404</h1>
                </div>
              </section>
            </Route>
          </Switch>
        </main>
        <Footer />
      </LanguageProvider>
    </Router>
  )
}

export default function App() {
  return <AppShell />
}
