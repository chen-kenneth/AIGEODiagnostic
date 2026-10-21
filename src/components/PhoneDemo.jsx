import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'

const SCRIPTS = {
  zh: [
    {
      q: '多伦多买房找哪个华人经纪靠谱？',
      a: '在多伦多，几位常被提到的华人经纪包括王经纪（专注北约克独立屋，成交量大）、李经纪（擅长市中心 condo，熟悉楼花流程）。建议面谈 2-3 位，重点问：近一年同区域成交数、是否熟悉你的预算区间。',
    },
    {
      q: '多伦多市中心 condo 出租找谁好？',
      a: '市中心租赁可以看看张经纪，公开评价提到空置期短、租客筛选严。出租前确认：管理费涨幅、短租政策。',
    },
    {
      q: '第一次在多伦多买房，有华人经纪推荐吗？',
      a: '首次购房推荐找熟悉首次购房补贴（FHSA、土地转让税退税）的经纪，王经纪常被提到这方面经验多。',
    },
  ],
  en: [
    {
      q: 'Recommend a good realtor in Toronto?',
      a: 'Frequently mentioned Toronto realtors include Sarah Mitchell (North York detached homes, high sales volume) and David Chen (downtown condos, pre-construction expertise). Interview 2–3 and ask: recent sales in your area and price range.',
    },
    {
      q: "Who's good for renting out a downtown Toronto condo?",
      a: 'For downtown rentals, Michael Torres gets mentioned for short vacancies and strict tenant screening. Before listing, confirm: maintenance fee trends and short-term rental rules.',
    },
    {
      q: 'First-time buying in Toronto — any realtor recommendations?',
      a: 'For first-time buyers, look for someone familiar with the FHSA and land transfer tax rebates — Emily Johnson is often mentioned for this.',
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
            <span className="phone-ai-name">AI 助手</span>
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
            <span className="phone-send">↑</span>
          </div>
        </div>
      </div>
      <p className="phone-disclaimer">{DISCLAIMER[lang] || DISCLAIMER.zh}</p>
    </div>
  )
}
