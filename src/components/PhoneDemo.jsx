import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

const SCRIPTS = {
  zh: [
    {
      q: '多伦多买房找哪个华人经纪靠谱？',
      a: '如果你主要考虑北约克独立屋，可以了解王经纪，其模拟资料侧重家庭住宅和社区选择。如果想买市中心 Condo，也可以比较李经纪的公寓交易经验。建议查看双方近期客户评价、服务区域和交易经验，并安排面谈，了解他们如何帮助你选房和制定报价策略。',
    },
    {
      q: '多伦多市中心 condo 出租找谁好？',
      a: '如果你要出租市中心 Condo，可以考虑熟悉 Downtown 租赁市场的张经纪，其模拟服务资料包括租金定价、安排看房和租客筛选。选择前建议询问近期同类单位出租经验、营销计划、信用及收入核验流程，以及经纪对安省租赁规定的熟悉程度。',
    },
    {
      q: '第一次在多伦多买房，有华人经纪推荐吗？',
      a: '首次购房可以考虑熟悉预算规划、Offer 条件和成交成本的经纪。例如，陈经纪的模拟服务资料重点介绍首次购房流程及华语沟通支持。面谈时可以询问其如何协助了解 FHSA、土地转让税退税等事项，并请税务专业人士确认具体资格。',
    },
  ],
  en: [
    {
      q: 'Recommend a good realtor in Toronto?',
      a: 'Based on their illustrative profiles, Sarah Mitchell focuses on detached homes in North York, while David Chen specializes in downtown condos. Compare their recent client reviews, relevant experience, and approach to pricing before deciding whom to interview.',
    },
    {
      q: "Who can help rent out my downtown Toronto condo?",
      a: 'Michael Torres is presented in this simulation as a downtown rental specialist offering pricing guidance, listing marketing, and tenant-screening support. Before hiring an agent, ask about comparable rentals, screening procedures, and familiarity with Ontario tenancy requirements.',
    },
    {
      q: 'Which Toronto realtor is good for first-time buyers?',
      a: 'Emily Johnson is featured in this simulated example for her focus on first-time buyers. Look for an agent who can explain offer conditions, closing costs, and local market options, while referring you to qualified professionals for mortgage and tax advice.',
    },
  ],
}

const DISCLAIMER = {
  zh: '模拟演示：AI 回答基于公开信息整理，不构成推荐',
  en: 'Mock demo: AI-style answer compiled from public info, not a recommendation',
}

/**
 * 手机框问答动画：客户打字提问 → AI 思考 → AI 逐字回答 → 循环
 * 无障碍：prefers-reduced-motion 时显示静态终态；动画区 aria-hidden
 */
export default function PhoneDemo() {
  const { lang } = useLang()
  const scripts = SCRIPTS[lang] || SCRIPTS.zh
  const [step, setStep] = useState(0) // 当前第几组
  const [phase, setPhase] = useState('typing-q') // typing-q | thinking | typing-a | pause
  const [typedQ, setTypedQ] = useState('')
  const [typedA, setTypedA] = useState('')
  const [reduced, setReduced] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = e => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) {
      // 静态：直接显示第一组的完整问答
      setTypedQ(scripts[0].q)
      setTypedA(scripts[0].a)
      setPhase('pause')
      return
    }
    timers.current.forEach(clearTimeout)
    timers.current = []
    const script = scripts[step % scripts.length]
    setTypedQ('')
    setTypedA('')
    setPhase('typing-q')

    let t = 0
    // 打字提问
    const qChars = [...script.q]
    qChars.forEach((ch, i) => {
      t += 45 + Math.random() * 60
      timers.current.push(setTimeout(() => setTypedQ(qChars.slice(0, i + 1).join('')), t))
    })
    // 发送后 AI 思考
    t += 600
    timers.current.push(setTimeout(() => setPhase('thinking'), t))
    // AI 逐字回答
    t += 1400
    timers.current.push(setTimeout(() => setPhase('typing-a'), t))
    const aChars = [...script.a]
    aChars.forEach((ch, i) => {
      t += 18
      timers.current.push(setTimeout(() => setTypedA(aChars.slice(0, i + 1).join('')), t))
    })
    // 停顿后下一组
    t += 3500
    timers.current.push(setTimeout(() => {
      setStep(s => s + 1)
    }, t))

    return () => timers.current.forEach(clearTimeout)
  }, [step, lang, reduced, scripts])

  const showQ = phase !== 'typing-q'
  const showThinking = phase === 'thinking'
  const showA = phase === 'typing-a' || phase === 'pause'

  return (
    <div className="phone-demo" aria-hidden="true">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-header">
            <span className="phone-ai-name">{lang === 'zh' ? 'AI 助手' : 'AI Assistant'}</span>
            <span className="phone-badge">{lang === 'zh' ? '模拟演示' : 'Mock demo'}</span>
          </div>
          <div className="phone-chat">
            {showQ && (
              <div className="chat-bubble user">{scripts[step % scripts.length].q}</div>
            )}
            {showThinking && (
              <div className="chat-bubble ai thinking">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            )}
            {showA && (
              <div className="chat-bubble ai">{typedA}<span className="caret" /></div>
            )}
          </div>
          <div className="phone-input">
            <span className="phone-input-text">
              {phase === 'typing-q' ? typedQ : (lang === 'zh' ? '输入问题…' : 'Type a question…')}
              {phase === 'typing-q' && <span className="caret" />}
            </span>
            <span className={`phone-send${phase === 'typing-q' ? ' active' : ''}`}>↑</span>
          </div>
        </div>
      </div>
      <p className="phone-disclaimer">{DISCLAIMER[lang] || DISCLAIMER.zh}</p>
    </div>
  )
}
