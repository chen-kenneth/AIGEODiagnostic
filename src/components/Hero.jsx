import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const { lang } = useLang()
  const heroImg = lang === 'zh' ? '/hero-cn.png' : '/hero-en.png'

  return (
    <section className="hero">
      <img src={heroImg} alt="RankGeo Hero" className="hero-image" />
    </section>
  )
}
