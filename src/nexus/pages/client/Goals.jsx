import React from 'react'
import { Header } from '../../components/shared/Header'
import { useApp } from '../../context/AppContext'
import { fmt, goalCategoryColor } from '../../data/demoData'
import { Umbrella, Home, GraduationCap, TrendingUp, DollarSign, Landmark, Target } from 'lucide-react'

const CATEGORY_ICONS = {
  retirement: Umbrella,
  'real-estate': Home,
  education: GraduationCap,
  financial: TrendingUp,
  income: DollarSign,
  estate: Landmark,
}

const CATEGORY_LABELS = {
  retirement: 'Retirement',
  'real-estate': 'Real Estate',
  education: 'Education',
  financial: 'Financial',
  income: 'Income',
  estate: 'Estate',
}

function yearsUntil(dateStr) {
  const target = new Date(dateStr)
  const now = new Date('2026-04-04')
  return Math.max(0, Math.round((target - now) / (365.25 * 24 * 3600 * 1000)))
}

function requiredMonthly(current, target, years) {
  if (years <= 0) return 0
  const months = years * 12
  const needed = target - current
  return needed / months
}

export default function Goals() {
  const { selectedClientId, getClientData } = useApp()
  const client = getClientData(selectedClientId)
  const goals = client.goals || []

  const totalGoalValue = goals.reduce((s, g) => s + g.target, 0)
  const totalCurrentValue = goals.reduce((s, g) => s + g.current, 0)
  const onTrackCount = goals.filter(g => g.onTrack).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Header
        title="Financial Goals"
        subtitle={`${onTrackCount} of ${goals.length} goals on track`}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

        {/* Summary Row */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryItem}>
            <div className="stat-label">Total Goal Target</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6 }}>
              {fmt.compact(totalGoalValue)}
            </div>
          </div>
          <div style={styles.divider} />
          <div style={styles.summaryItem}>
            <div className="stat-label">Currently Funded</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--gold)', marginTop: 6 }}>
              {fmt.compact(totalCurrentValue)}
            </div>
          </div>
          <div style={styles.divider} />
          <div style={styles.summaryItem}>
            <div className="stat-label">Overall Progress</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--success)', marginTop: 6 }}>
              {Math.round((totalCurrentValue / totalGoalValue) * 100)}%
            </div>
          </div>
          <div style={styles.divider} />
          <div style={styles.summaryItem}>
            <div className="stat-label">On Track</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: onTrackCount === goals.length ? 'var(--success)' : 'var(--warning)', marginTop: 6 }}>
              {onTrackCount} / {goals.length}
            </div>
          </div>
        </div>

        {/* Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
            const yrs = yearsUntil(goal.targetDate)
            const monthly = requiredMonthly(goal.current, goal.target, yrs)
            const color = goalCategoryColor[goal.category] || 'var(--gold)'

            return (
              <div key={goal.id} className="card" style={{ border: `1px solid ${color}38`, background: `${color}06`, borderTop: `2px solid ${color}` }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  {/* Icon + Label */}
                  <div style={{ ...styles.goalIcon, background: color + '18', borderColor: color + '40' }}>
                    {(() => { const GI = CATEGORY_ICONS[goal.category] || Target; return <GI size={22} color={color} />; })()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{goal.name}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span className="tag">{CATEGORY_LABELS[goal.category] || goal.category}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Target: {new Date(goal.targetDate).getFullYear()}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{yrs} year{yrs !== 1 ? 's' : ''} away</span>
                        </div>
                      </div>
                      <span className={`badge ${goal.onTrack ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 12 }}>
                        {goal.onTrack ? '✓ On Track' : '⚠ Behind Pace'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color }}>
                            {fmt.compact(goal.current)}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-tertiary)', marginLeft: 8 }}>
                            / {fmt.compact(goal.target)}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color }}>
                          {pct}%
                        </span>
                      </div>
                      <div style={{ height: 10, background: 'var(--bg-surface-3)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${color}80, ${color})`,
                          borderRadius: 5,
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div style={styles.goalStats}>
                      <div style={styles.goalStat}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Still Needed</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {fmt.compact(Math.max(0, goal.target - goal.current))}
                        </div>
                      </div>
                      <div style={styles.goalStatDivider} />
                      <div style={styles.goalStat}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Est. Monthly to Goal</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: goal.onTrack ? 'var(--success)' : 'var(--warning)' }}>
                          {fmt.compact(monthly)}/mo
                        </div>
                      </div>
                      <div style={styles.goalStatDivider} />
                      <div style={styles.goalStat}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Target Year</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {new Date(goal.targetDate).getFullYear()}
                        </div>
                      </div>
                      <div style={styles.goalStatDivider} />
                      <div style={styles.goalStat}>
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Category</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {CATEGORY_LABELS[goal.category] || goal.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {goals.length === 0 && (
            <div className="empty-state">
              <Target size={40} color="var(--gold)" />
              <div>No goals set up yet. Contact your advisor to define your financial goals.</div>
            </div>
          )}
        </div>

        {/* Advisor Note */}
        <div style={styles.advisorNote}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <div style={styles.mcAvatar}>MC</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)' }}>Marcus Chen, CFP® · CFA</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Goal Review Guidance</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Your goals are reviewed and updated at each quarterly meeting. If your circumstances change —
            new income, new life event, or shifting priorities — let me know and we'll adjust the plan accordingly.
            Every goal is modeled with your current portfolio trajectory and updated monthly.
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '18px 24px',
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    background: 'var(--border)',
    flexShrink: 0,
  },
  goalIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  goalStats: {
    display: 'flex',
    gap: 0,
    background: 'var(--bg-surface-2)',
    borderRadius: 8,
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  goalStat: {
    flex: 1,
    padding: '10px 14px',
  },
  goalStatDivider: {
    width: 1,
    background: 'var(--border)',
    flexShrink: 0,
  },
  advisorNote: {
    marginTop: 20,
    padding: '16px 20px',
    background: 'var(--gold-glow)',
    border: '1px solid var(--gold-dim)',
    borderRadius: 12,
  },
  mcAvatar: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--gold-dim)',
    border: '1px solid var(--gold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--gold)',
  },
}
