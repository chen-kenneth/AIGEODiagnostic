import { useLang } from '../context/LanguageContext'

/** 脱敏审计报告样例 — P0 信任资产（数据为示意，已明确标注） */
export default function ReportSample() {
  const { t } = useLang()
  const r = t.reportSample

  return (
    <section id="report-sample" className="section-alt">
      <div className="container">
        <div className="label">{r.label}</div>
        <h2>{r.title}</h2>
        <p style={{ maxWidth: '640px', marginTop: '16px' }}>{r.intro}</p>

        <div className="sample-metrics">
          {r.metrics.map((m, i) => (
            <div className="sample-metric" key={i}>
              <div className="sm-value mono">{m.value}</div>
              <div className="sm-label">{m.label}</div>
              <div className="sm-sub">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="sample-table-wrap">
          <h3 className="sample-table-title">{r.tableTitle}</h3>
          <table className="sample-table">
            <thead>
              <tr>
                {r.tableHead.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.tableRows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={j === 0 ? '' : cell === '提及' || cell === 'Mentioned' ? 'hit' : 'miss'}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sample-insight">
          <div className="si-label">{r.insightTitle}</div>
          <p>{r.insightBody}</p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <a href="#cta-form" className="btn-primary">{r.cta}</a>
          <p className="sample-note">{r.note}</p>
        </div>
      </div>
    </section>
  )
}
