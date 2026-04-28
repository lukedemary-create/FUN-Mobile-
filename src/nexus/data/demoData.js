export const advisor = {
  id: 'adv1',
  name: 'Marcus Chen',
  initials: 'MC',
  title: 'Senior Wealth Advisor',
  firm: 'Nexus Capital Management',
  credentials: ['CFP', 'CFA'],
  phone: '+1 (212) 555-0187',
  email: 'm.chen@nexuscm.com',
  aum: 47_500_000,
  clientCount: 23,
  avgEngagement: 72,
}

export const clients = [
  {
    id: 'c1',
    name: 'Alexandra Hartwell',
    firstName: 'Alexandra',
    initials: 'AH',
    email: 'a.hartwell@techventure.com',
    phone: '+1 (646) 555-0192',
    age: 48,
    occupation: 'Chief Marketing Officer',
    employer: 'TechVenture Corp',
    location: 'New York, NY',
    portfolioValue: 2_450_000,
    ytdReturn: 8.4,
    benchmarkReturn: 7.1,
    engagementScore: 92,
    riskProfile: 'Moderate Growth',
    lastInteraction: '2026-03-28',
    nextMeeting: '2026-04-12T10:00:00',
    joinDate: '2019-03-15',

    allocation: [
      { name: 'US Equities',    value: 45, amount: 1_102_500, color: '#c9a84c' },
      { name: 'Intl Equities',  value: 20, amount:   490_000, color: '#2dd4a4' },
      { name: 'Fixed Income',   value: 25, amount:   612_500, color: '#4a8fff' },
      { name: 'Alternatives',   value:  7, amount:   171_500, color: '#a78bfa' },
      { name: 'Cash',           value:  3, amount:    73_500, color: '#4a5d7a' },
    ],

    holdings: [
      { ticker: 'VTI',   name: 'Vanguard Total Stock Market ETF',   value: 680_000, shares: 3240, price: 209.88, gainPct: 12.4, allocPct: 27.8 },
      { ticker: 'SCHD',  name: 'Schwab US Dividend Equity ETF',      value: 422_500, shares: 5890, price:  71.74, gainPct:  8.2, allocPct: 17.2 },
      { ticker: 'VEA',   name: 'Vanguard Developed Markets ETF',     value: 490_000, shares: 9200, price:  53.26, gainPct:  5.8, allocPct: 20.0 },
      { ticker: 'AGG',   name: 'iShares Core US Aggregate Bond',     value: 367_500, shares: 3850, price:  95.45, gainPct:  2.1, allocPct: 15.0 },
      { ticker: 'TIP',   name: 'iShares TIPS Bond ETF',              value: 245_000, shares: 2350, price: 104.26, gainPct:  1.8, allocPct: 10.0 },
      { ticker: 'PIMIX', name: 'PIMCO Income Fund Inst.',            value: 171_500, shares:14290, price:  12.00, gainPct:  4.2, allocPct:  7.0 },
      { ticker: 'CASH',  name: 'Money Market',                        value:  73_500, shares: null,  price:   1.00, gainPct:  5.2, allocPct:  3.0 },
    ],

    performanceHistory: [
      { month: 'Apr 25', value: 2_180_000, benchmark: 2_150_000 },
      { month: 'May 25', value: 2_210_000, benchmark: 2_175_000 },
      { month: 'Jun 25', value: 2_195_000, benchmark: 2_160_000 },
      { month: 'Jul 25', value: 2_285_000, benchmark: 2_220_000 },
      { month: 'Aug 25', value: 2_260_000, benchmark: 2_200_000 },
      { month: 'Sep 25', value: 2_310_000, benchmark: 2_245_000 },
      { month: 'Oct 25', value: 2_340_000, benchmark: 2_270_000 },
      { month: 'Nov 25', value: 2_380_000, benchmark: 2_295_000 },
      { month: 'Dec 25', value: 2_420_000, benchmark: 2_310_000 },
      { month: 'Jan 26', value: 2_390_000, benchmark: 2_285_000 },
      { month: 'Feb 26', value: 2_415_000, benchmark: 2_305_000 },
      { month: 'Mar 26', value: 2_450_000, benchmark: 2_325_000 },
    ],

    goals: [
      { id: 'g1', name: 'Retirement at 60',       target: 4_500_000, current: 2_450_000, targetDate: '2038-01-01', category: 'retirement',   onTrack: true  },
      { id: 'g2', name: 'Beach House Purchase',    target:   800_000, current:   245_000, targetDate: '2028-06-01', category: 'real-estate',  onTrack: true  },
      { id: 'g3', name: "College Fund — Emma",     target:   200_000, current:   128_000, targetDate: '2029-09-01', category: 'education',    onTrack: false },
    ],

    lifeEvents: [
      { id: 'le1', date: '2026-02-14', category: 'family',    title: 'Daughter started college applications',   description: 'Emma is applying to 8 schools. Financial aid packages expected spring.', advisorNote: 'Review 529 balance and consider contribution increase. Model expected FA impact.', actionCreated: true  },
      { id: 'le2', date: '2025-11-01', category: 'career',    title: 'Promoted to CMO',                         description: 'Significant compensation increase. New RSU grant — $240K over 4-year vest.', advisorNote: 'RSU vesting schedule analysis needed. Model marginal tax rates with new comp.', actionCreated: true  },
      { id: 'le3', date: '2025-06-15', category: 'financial', title: 'Inherited Connecticut property',          description: "Mother passed. Inherited family home — estimated value $650K.", advisorNote: 'Estate review. Consider 1031 exchange or stepped-up cost basis if selling.',    actionCreated: true  },
    ],

    actionItems: [
      { id: 'ai1', text: 'Review RSU vesting schedule and 2026 tax implications',     completed: false, dueDate: '2026-04-15', owner: 'advisor', priority: 'high'   },
      { id: 'ai2', text: "Increase Emma's 529 contribution to $2,000/month",          completed: false, dueDate: '2026-04-20', owner: 'client', priority: 'high'   },
      { id: 'ai3', text: 'Connecticut property — sell or rent decision framework',     completed: false, dueDate: '2026-05-01', owner: 'both',   priority: 'medium' },
      { id: 'ai4', text: 'Annual beneficiary designation review',                      completed: true,  dueDate: '2026-03-31', owner: 'client', priority: 'medium' },
      { id: 'ai5', text: 'Q1 portfolio rebalancing',                                   completed: true,  dueDate: '2026-03-31', owner: 'advisor', priority: 'low'  },
    ],

    messages: [
      { id: 'm1', sender: 'advisor', text: "Alexandra — after Q1 rebalancing your portfolio is outperforming benchmark by 1.3%. Full report is ready in the vault ahead of our April 12th call.", timestamp: '2026-03-28T09:15:00', read: true  },
      { id: 'm2', sender: 'client', text: "That's great to hear. The tech volatility has me a little nervous — should we be repositioning anything?", timestamp: '2026-03-28T11:30:00', read: true  },
      { id: 'm3', sender: 'advisor', text: "Your allocation is built specifically for this — the bond exposure is acting as the shock absorber right now. Let's walk through it on the 12th. Nothing to do today.", timestamp: '2026-03-28T14:00:00', read: true  },
      { id: 'm4', sender: 'client', text: "Perfect. Also — Emma just got her first acceptance! Stanford. Financial aid package comes next week.", timestamp: '2026-03-30T16:45:00', read: false },
    ],

    documents: [
      { id: 'd1', name: 'Q1 2026 Portfolio Report.pdf',             type: 'report',   sizeMb: '2.4', date: '2026-03-31', sharedBy: 'advisor', category: 'reports'    },
      { id: 'd2', name: 'Investment Policy Statement 2026.pdf',     type: 'policy',   sizeMb: '0.9', date: '2026-01-15', sharedBy: 'advisor', category: 'agreements' },
      { id: 'd3', name: 'RSU Vesting Schedule — TechVenture.pdf',  type: 'document', sizeMb: '1.2', date: '2026-02-28', sharedBy: 'client',  category: 'tax'        },
      { id: 'd4', name: 'CT Property Estate Notes.pdf',             type: 'memo',     sizeMb: '0.5', date: '2026-01-20', sharedBy: 'advisor', category: 'planning'   },
      { id: 'd5', name: 'Q4 2025 Portfolio Report.pdf',             type: 'report',   sizeMb: '2.1', date: '2025-12-31', sharedBy: 'advisor', category: 'reports'    },
    ],

    agendaItems: [
      { id: 'ma1', text: 'Q1 Portfolio Performance Review',             completed: false, addedBy: 'advisor' },
      { id: 'ma2', text: 'RSU Vesting & Tax Strategy',                  completed: false, addedBy: 'advisor' },
      { id: 'ma3', text: "Emma's College Funding — 529 Optimization",   completed: false, addedBy: 'client'  },
      { id: 'ma4', text: 'Connecticut Property Decision',               completed: false, addedBy: 'advisor' },
      { id: 'ma5', text: 'Q2 Goals & Priorities',                       completed: false, addedBy: 'advisor' },
    ],
    nextMeetingType: 'Quarterly Review',
    nextMeetingLocation: 'Video Call — Zoom',
  },

  {
    id: 'c2',
    name: 'Robert & Diana Faulkner',
    firstName: 'Robert',
    initials: 'RF',
    email: 'rfaulkner@faulknerlaw.com',
    phone: '+1 (212) 555-0284',
    age: 62,
    occupation: 'Senior Partner',
    employer: 'Faulkner & Associates LLP',
    location: 'Greenwich, CT',
    portfolioValue: 8_750_000,
    ytdReturn: 6.2,
    benchmarkReturn: 7.1,
    engagementScore: 65,
    riskProfile: 'Conservative Growth',
    lastInteraction: '2026-03-05',
    nextMeeting: '2026-04-22T14:00:00',
    joinDate: '2015-08-20',

    allocation: [
      { name: 'US Equities',   value: 35, amount: 3_062_500, color: '#c9a84c' },
      { name: 'Intl Equities', value: 15, amount: 1_312_500, color: '#2dd4a4' },
      { name: 'Fixed Income',  value: 35, amount: 3_062_500, color: '#4a8fff' },
      { name: 'Alternatives',  value: 10, amount:   875_000, color: '#a78bfa' },
      { name: 'Cash',          value:  5, amount:   437_500, color: '#4a5d7a' },
    ],

    holdings: [
      { ticker: 'VTI',   name: 'Vanguard Total Stock Market ETF', value: 2_187_500, shares: 10420, price: 209.88, gainPct:  7.8, allocPct: 25.0 },
      { ticker: 'VEA',   name: 'Vanguard Developed Markets ETF',  value: 1_312_500, shares: 24640, price:  53.26, gainPct:  3.2, allocPct: 15.0 },
      { ticker: 'BND',   name: 'Vanguard Total Bond Market ETF',  value: 1_750_000, shares: 22750, price:  76.92, gainPct:  1.9, allocPct: 20.0 },
      { ticker: 'MUB',   name: "iShares Nat'l Muni Bond ETF",     value: 1_312_500, shares: 13420, price:  97.80, gainPct:  2.4, allocPct: 15.0 },
      { ticker: 'VWINX', name: 'Vanguard Wellesley Income Fund',  value:   875_000, shares: 35180, price:  24.87, gainPct:  5.1, allocPct: 10.0 },
      { ticker: 'VNQ',   name: 'Vanguard Real Estate ETF',        value:   875_000, shares:  9940, price:  88.02, gainPct:  4.8, allocPct: 10.0 },
      { ticker: 'CASH',  name: 'Money Market',                     value:   437_500, shares:  null, price:   1.00, gainPct:  5.2, allocPct:  5.0 },
    ],

    performanceHistory: [
      { month: 'Apr 25', value: 8_050_000, benchmark: 8_100_000 },
      { month: 'May 25', value: 8_120_000, benchmark: 8_160_000 },
      { month: 'Jun 25', value: 8_090_000, benchmark: 8_130_000 },
      { month: 'Jul 25', value: 8_280_000, benchmark: 8_310_000 },
      { month: 'Aug 25', value: 8_250_000, benchmark: 8_290_000 },
      { month: 'Sep 25', value: 8_400_000, benchmark: 8_420_000 },
      { month: 'Oct 25', value: 8_520_000, benchmark: 8_510_000 },
      { month: 'Nov 25', value: 8_610_000, benchmark: 8_550_000 },
      { month: 'Dec 25', value: 8_680_000, benchmark: 8_590_000 },
      { month: 'Jan 26', value: 8_620_000, benchmark: 8_540_000 },
      { month: 'Feb 26', value: 8_700_000, benchmark: 8_590_000 },
      { month: 'Mar 26', value: 8_750_000, benchmark: 8_650_000 },
    ],

    goals: [
      { id: 'g1', name: 'Full Retirement at 65',        target: 12_000_000, current:  8_750_000, targetDate: '2029-01-01', category: 'retirement', onTrack: true  },
      { id: 'g2', name: 'Annual Retirement Income $350K', target:    350_000, current:    285_000, targetDate: '2026-12-31', category: 'income',     onTrack: false },
      { id: 'g3', name: "Grandchildren Trust Fund",      target:    500_000, current:    125_000, targetDate: '2030-01-01', category: 'estate',     onTrack: true  },
    ],

    lifeEvents: [
      { id: 'le1', date: '2026-01-15', category: 'family', title: 'First grandchild born — Oliver', description: 'Robert and Diana welcomed Oliver James Faulkner, 7lb 4oz.', advisorNote: 'Perfect opportunity to discuss trust fund and 529 education plan for Oliver.', actionCreated: true },
    ],

    actionItems: [
      { id: 'ai1', text: 'Social Security claiming strategy — optimal timing analysis', completed: false, dueDate: '2026-04-30', owner: 'advisor', priority: 'high'   },
      { id: 'ai2', text: "Set up Oliver's 529 education savings plan",                  completed: false, dueDate: '2026-04-22', owner: 'both',   priority: 'medium' },
      { id: 'ai3', text: 'Medicare Part B enrollment review',                            completed: false, dueDate: '2026-05-15', owner: 'advisor', priority: 'medium' },
      { id: 'ai4', text: 'Annual tax-loss harvesting review',                            completed: true,  dueDate: '2025-12-31', owner: 'advisor', priority: 'low'   },
    ],

    messages: [
      { id: 'm1', sender: 'advisor', text: "Robert, congratulations to you and Diana on little Oliver! I've put together some thoughts on educational savings and trust structures — let's discuss at the April 22nd meeting.", timestamp: '2026-01-16T09:00:00', read: true  },
      { id: 'm2', sender: 'client', text: "Thank you Marcus! We're over the moon. Diana is already asking about the trust — she wants everything set up properly.", timestamp: '2026-01-16T14:30:00', read: true  },
      { id: 'm3', sender: 'advisor', text: "Perfect. Also pulling together the Social Security timing analysis ahead of our meeting. The window for optimal claiming is coming up in 2027.", timestamp: '2026-03-05T10:00:00', read: true  },
    ],

    documents: [
      { id: 'd1', name: 'Q1 2026 Portfolio Report.pdf',           type: 'report',   sizeMb: '3.1', date: '2026-03-31', sharedBy: 'advisor', category: 'reports'  },
      { id: 'd2', name: 'Retirement Income Analysis 2026.pdf',    type: 'analysis', sizeMb: '1.8', date: '2026-02-15', sharedBy: 'advisor', category: 'planning' },
      { id: 'd3', name: 'Trust Fund Structure Options.pdf',        type: 'memo',     sizeMb: '1.1', date: '2026-01-20', sharedBy: 'advisor', category: 'planning' },
      { id: 'd4', name: 'Q4 2025 Portfolio Report.pdf',            type: 'report',   sizeMb: '2.9', date: '2025-12-31', sharedBy: 'advisor', category: 'reports'  },
    ],

    agendaItems: [
      { id: 'ma1', text: 'Q1 Performance & Market Outlook',         completed: false, addedBy: 'advisor' },
      { id: 'ma2', text: 'Retirement Income Strategy Update',        completed: false, addedBy: 'advisor' },
      { id: 'ma3', text: "Oliver's Trust & 529 Setup",              completed: false, addedBy: 'client'  },
      { id: 'ma4', text: 'Social Security Claiming — Timing',       completed: false, addedBy: 'advisor' },
    ],
    nextMeetingType: 'Quarterly Review',
    nextMeetingLocation: 'In Person — 535 Madison Ave, New York',
  },

  {
    id: 'c3',
    name: 'James Whitmore',
    firstName: 'James',
    initials: 'JW',
    email: 'j.whitmore@datapulse.ai',
    phone: '+1 (415) 555-0391',
    age: 35,
    occupation: 'Co-founder & CTO',
    employer: 'DataPulse AI',
    location: 'San Francisco, CA',
    portfolioValue: 3_850_000,
    ytdReturn: 14.2,
    benchmarkReturn: 7.1,
    engagementScore: 88,
    riskProfile: 'Aggressive Growth',
    lastInteraction: '2026-04-01',
    nextMeeting: '2026-04-18T15:00:00',
    joinDate: '2022-06-10',

    allocation: [
      { name: 'US Equities',   value: 60, amount: 2_310_000, color: '#c9a84c' },
      { name: 'Intl Equities', value: 20, amount:   770_000, color: '#2dd4a4' },
      { name: 'Alternatives',  value: 12, amount:   462_000, color: '#a78bfa' },
      { name: 'Fixed Income',  value:  5, amount:   192_500, color: '#4a8fff' },
      { name: 'Cash',          value:  3, amount:   115_500, color: '#4a5d7a' },
    ],

    holdings: [
      { ticker: 'QQQ',  name: 'Invesco QQQ Trust',              value: 1_155_000, shares:  2850, price: 405.26, gainPct: 22.4, allocPct: 30.0 },
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF', value:   770_000, shares:  3670, price: 209.88, gainPct: 15.8, allocPct: 20.0 },
      { ticker: 'ARKK', name: 'ARK Innovation ETF',              value:   385_000, shares:  7540, price:  51.06, gainPct: 18.2, allocPct: 10.0 },
      { ticker: 'VEA',  name: 'Vanguard Developed Markets ETF',  value:   770_000, shares: 14460, price:  53.26, gainPct:  8.4, allocPct: 20.0 },
      { ticker: 'IBTC', name: 'iShares Bitcoin Trust',           value:   462_000, shares: 10240, price:  45.12, gainPct: 42.8, allocPct: 12.0 },
      { ticker: 'TIP',  name: 'iShares TIPS Bond ETF',           value:   192_500, shares:  1846, price: 104.26, gainPct:  1.8, allocPct:  5.0 },
      { ticker: 'CASH', name: 'Money Market',                     value:   115_500, shares:  null, price:   1.00, gainPct:  5.2, allocPct:  3.0 },
    ],

    performanceHistory: [
      { month: 'Apr 25', value: 2_920_000, benchmark: 3_150_000 },
      { month: 'May 25', value: 3_080_000, benchmark: 3_175_000 },
      { month: 'Jun 25', value: 3_020_000, benchmark: 3_140_000 },
      { month: 'Jul 25', value: 3_280_000, benchmark: 3_230_000 },
      { month: 'Aug 25', value: 3_350_000, benchmark: 3_205_000 },
      { month: 'Sep 25', value: 3_420_000, benchmark: 3_265_000 },
      { month: 'Oct 25', value: 3_560_000, benchmark: 3_310_000 },
      { month: 'Nov 25', value: 3_640_000, benchmark: 3_345_000 },
      { month: 'Dec 25', value: 3_520_000, benchmark: 3_365_000 },
      { month: 'Jan 26', value: 3_580_000, benchmark: 3_310_000 },
      { month: 'Feb 26', value: 3_720_000, benchmark: 3_350_000 },
      { month: 'Mar 26', value: 3_850_000, benchmark: 3_380_000 },
    ],

    goals: [
      { id: 'g1', name: 'Series B Secondary Liquidity',   target: 10_000_000, current: 3_850_000, targetDate: '2027-01-01', category: 'financial',   onTrack: true  },
      { id: 'g2', name: 'Early Retirement Option at 45',  target:  6_000_000, current: 3_850_000, targetDate: '2036-01-01', category: 'retirement',  onTrack: true  },
      { id: 'g3', name: 'Real Estate Portfolio',          target:  2_000_000, current:         0, targetDate: '2028-01-01', category: 'real-estate', onTrack: false },
    ],

    lifeEvents: [
      { id: 'le1', date: '2026-03-01', category: 'career',  title: 'Series B Closed — $45M',        description: "DataPulse AI closed Series B. James's stake now valued at ~$8M pre-liquidity.", advisorNote: 'Tax planning for potential secondary sale critical. Model QSBS exclusion scenarios.',  actionCreated: true  },
      { id: 'le2', date: '2025-12-20', category: 'family',  title: 'Engaged to Sarah Mitchell',      description: 'Planning a March 2027 wedding in Napa Valley.', advisorNote: 'Pre-nuptial financial planning discussion. Joint financial plan update needed.', actionCreated: false },
    ],

    actionItems: [
      { id: 'ai1', text: 'Model tax scenarios — Series B secondary sale timing',        completed: false, dueDate: '2026-04-18', owner: 'advisor', priority: 'high'   },
      { id: 'ai2', text: 'Pre-nuptial agreement financial disclosure preparation',       completed: false, dueDate: '2026-05-01', owner: 'client',  priority: 'medium' },
      { id: 'ai3', text: 'Crypto allocation review — position sizing vs. total AUM',    completed: false, dueDate: '2026-04-30', owner: 'advisor', priority: 'medium' },
      { id: 'ai4', text: 'Update beneficiary designations post-engagement',             completed: false, dueDate: '2026-04-30', owner: 'client',  priority: 'low'    },
    ],

    messages: [
      { id: 'm1', sender: 'advisor', text: "James! The Series B closing is huge — congrats. We need to talk tax strategy on secondary sale timing ASAP. Are you free Thursday or Friday?", timestamp: '2026-03-01T15:30:00', read: true  },
      { id: 'm2', sender: 'client', text: "Thank you! It's been insane. Friday works. Should I be doing anything different with the portfolio given the new company valuation?", timestamp: '2026-03-01T18:00:00', read: true  },
      { id: 'm3', sender: 'advisor', text: "Yes — let's talk concentration risk and building a separate diversified portfolio ahead of any liquidity event. Bring your cap table. QSBS exclusion may apply here.", timestamp: '2026-03-02T08:45:00', read: true  },
      { id: 'm4', sender: 'client', text: "Also — Sarah and I set the date. March 14, 2027. I know you mentioned pre-nuptial planning. Let's add that to the April agenda.", timestamp: '2026-03-31T20:15:00', read: false },
    ],

    documents: [
      { id: 'd1', name: 'Q1 2026 Portfolio Report.pdf',     type: 'report',   sizeMb: '2.8', date: '2026-03-31', sharedBy: 'advisor', category: 'reports' },
      { id: 'd2', name: 'Series B Tax Planning Memo.pdf',   type: 'memo',     sizeMb: '1.4', date: '2026-03-05', sharedBy: 'advisor', category: 'tax'     },
      { id: 'd3', name: 'DataPulse Cap Table Mar 2026.pdf', type: 'document', sizeMb: '0.9', date: '2026-03-01', sharedBy: 'client',  category: 'tax'     },
    ],

    agendaItems: [
      { id: 'ma1', text: 'Series B Tax Strategy & Secondary Sale Timing', completed: false, addedBy: 'advisor' },
      { id: 'ma2', text: 'Portfolio Concentration Risk Review',            completed: false, addedBy: 'advisor' },
      { id: 'ma3', text: 'Pre-Nuptial Financial Planning',                 completed: false, addedBy: 'client'  },
      { id: 'ma4', text: 'Crypto Allocation Review',                       completed: false, addedBy: 'client'  },
    ],
    nextMeetingType: 'Strategy Session',
    nextMeetingLocation: 'Video Call — Zoom',
  },

  {
    id: 'c4',
    name: 'Priya Mehta',
    firstName: 'Priya',
    initials: 'PM',
    email: 'p.mehta@northwestern.edu',
    phone: '+1 (312) 555-0445',
    age: 41,
    occupation: 'Chief of Thoracic Surgery',
    employer: 'Northwestern Medicine',
    location: 'Chicago, IL',
    portfolioValue: 1_850_000,
    ytdReturn: 7.8,
    benchmarkReturn: 7.1,
    engagementScore: 45,
    riskProfile: 'Moderate',
    lastInteraction: '2026-02-15',
    nextMeeting: '2026-05-05T11:00:00',
    joinDate: '2020-11-30',

    allocation: [
      { name: 'US Equities',   value: 50, amount:   925_000, color: '#c9a84c' },
      { name: 'Fixed Income',  value: 25, amount:   462_500, color: '#4a8fff' },
      { name: 'Intl Equities', value: 15, amount:   277_500, color: '#2dd4a4' },
      { name: 'Alternatives',  value:  5, amount:    92_500, color: '#a78bfa' },
      { name: 'Cash',          value:  5, amount:    92_500, color: '#4a5d7a' },
    ],

    holdings: [
      { ticker: 'VTI',  name: 'Vanguard Total Stock Market ETF', value: 555_000, shares: 2645, price: 209.88, gainPct:  9.2, allocPct: 30.0 },
      { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF',   value: 370_000, shares: 5160, price:  71.74, gainPct:  7.8, allocPct: 20.0 },
      { ticker: 'VEA',  name: 'Vanguard Developed Markets ETF',  value: 277_500, shares: 5210, price:  53.26, gainPct:  4.8, allocPct: 15.0 },
      { ticker: 'AGG',  name: 'iShares Core US Aggregate Bond',  value: 277_500, shares: 2908, price:  95.45, gainPct:  2.0, allocPct: 15.0 },
      { ticker: 'MUB',  name: "iShares Nat'l Muni Bond ETF",     value: 185_000, shares: 1891, price:  97.80, gainPct:  2.2, allocPct: 10.0 },
      { ticker: 'VNQ',  name: 'Vanguard Real Estate ETF',        value:  92_500, shares: 1051, price:  88.02, gainPct:  5.8, allocPct:  5.0 },
      { ticker: 'CASH', name: 'Money Market',                     value:  92_500, shares: null, price:   1.00, gainPct:  5.2, allocPct:  5.0 },
    ],

    performanceHistory: [
      { month: 'Apr 25', value: 1_680_000, benchmark: 1_690_000 },
      { month: 'May 25', value: 1_710_000, benchmark: 1_710_000 },
      { month: 'Jun 25', value: 1_695_000, benchmark: 1_695_000 },
      { month: 'Jul 25', value: 1_750_000, benchmark: 1_745_000 },
      { month: 'Aug 25', value: 1_740_000, benchmark: 1_730_000 },
      { month: 'Sep 25', value: 1_780_000, benchmark: 1_770_000 },
      { month: 'Oct 25', value: 1_800_000, benchmark: 1_790_000 },
      { month: 'Nov 25', value: 1_820_000, benchmark: 1_805_000 },
      { month: 'Dec 25', value: 1_840_000, benchmark: 1_810_000 },
      { month: 'Jan 26', value: 1_810_000, benchmark: 1_790_000 },
      { month: 'Feb 26', value: 1_830_000, benchmark: 1_810_000 },
      { month: 'Mar 26', value: 1_850_000, benchmark: 1_825_000 },
    ],

    goals: [
      { id: 'g1', name: 'Retirement at 58',         target: 5_000_000, current: 1_850_000, targetDate: '2043-01-01', category: 'retirement', onTrack: true  },
      { id: 'g2', name: 'Medical Practice Buyout',  target:   600_000, current:   185_000, targetDate: '2028-01-01', category: 'financial',  onTrack: false },
    ],

    lifeEvents: [
      { id: 'le1', date: '2025-09-10', category: 'career', title: 'Named Chief of Thoracic Surgery', description: 'Appointed Department Chief at Northwestern. Significant income increase — new deferred comp plan.', advisorNote: 'Review deferred compensation elections. Max defined benefit plan contributions.', actionCreated: true },
    ],

    actionItems: [
      { id: 'ai1', text: 'Review malpractice insurance coverage post-promotion',   completed: false, dueDate: '2026-05-05', owner: 'client',  priority: 'medium' },
      { id: 'ai2', text: 'Maximize defined benefit plan contribution for 2026',    completed: false, dueDate: '2026-04-30', owner: 'advisor', priority: 'high'   },
      { id: 'ai3', text: 'Q2 check-in — schedule proactively',                     completed: false, dueDate: '2026-04-15', owner: 'client',  priority: 'low'    },
    ],

    messages: [
      { id: 'm1', sender: 'advisor', text: "Priya, hope all is well — I know the Chief role has been keeping you busy. Reaching out about your defined benefit plan contributions. There's a meaningful window before April 30th. Let's connect.", timestamp: '2026-03-20T10:00:00', read: false },
    ],

    documents: [
      { id: 'd1', name: 'Q1 2026 Portfolio Report.pdf',       type: 'report',   sizeMb: '2.2', date: '2026-03-31', sharedBy: 'advisor', category: 'reports'  },
      { id: 'd2', name: 'Defined Benefit Plan Summary.pdf',    type: 'document', sizeMb: '0.8', date: '2026-01-10', sharedBy: 'advisor', category: 'planning' },
    ],

    agendaItems: [
      { id: 'ma1', text: 'Q1 Portfolio Review',                completed: false, addedBy: 'advisor' },
      { id: 'ma2', text: 'Defined Benefit Plan Strategy',      completed: false, addedBy: 'advisor' },
      { id: 'ma3', text: 'Medical Practice Buyout Planning',   completed: false, addedBy: 'client'  },
    ],
    nextMeetingType: 'Quarterly Review',
    nextMeetingLocation: 'Video Call — Zoom',
  },
]

export const broadcastMessages = [
  {
    id: 'bm1',
    subject: 'Q1 2026 Market Recap & Your Portfolio',
    preview: 'Markets navigated Q1 with resilience despite rate uncertainty. Here\'s how your portfolio performed...',
    body: `Dear {{firstName}},

I wanted to share a few thoughts on Q1 2026 as we head into a potentially pivotal second quarter.

Markets navigated continued Federal Reserve uncertainty with more resilience than most anticipated. Your {{riskProfile}} portfolio returned {{ytdReturn}}% YTD, {{vsbenchmark}} the benchmark by {{bpDiff}} basis points.

A few highlights worth noting:
• Your fixed income sleeve outperformed in Q1 as rates stabilized
• The international equity allocation added meaningful diversification during the February volatility
• Cash is being put to work selectively as opportunities arise

I've posted the full Q1 report to your document vault. Let's connect at our upcoming meeting to discuss positioning for Q2.

Best,
Marcus Chen, CFP®, CFA
Senior Wealth Advisor`,
    sentDate: '2026-03-31',
    recipientIds: ['c1', 'c2', 'c3', 'c4'],
    openRate: 75,
    status: 'sent',
  },
  {
    id: 'bm2',
    subject: 'Tax Season: Year-End Documents Available',
    preview: 'Your 1099 and year-end tax documents are now available in your document vault...',
    body: `Dear {{firstName}},

Your year-end tax documents are now available in the NEXUS document vault, including:

• Form 1099-DIV (Dividends and Distributions)
• Form 1099-B (Proceeds from Broker Transactions)
• Year-End Portfolio Summary

Please share these with your tax professional at your earliest convenience. If you have questions about any line items, I'm happy to walk through them together.

Marcus Chen, CFP®, CFA`,
    sentDate: '2026-02-01',
    recipientIds: ['c1', 'c2', 'c3', 'c4'],
    openRate: 100,
    status: 'sent',
  },
]

// ─── Formatters ────────────────────────────────────
export const fmt = {
  currency: (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v),
  compact: (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
    if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
    return `$${v}`
  },
  pct: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
  date: (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  relDate: (s) => {
    const d = new Date(s)
    const now = new Date('2026-04-04')
    const days = Math.round((now - d) / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7)  return `${days}d ago`
    if (days < 30) return `${Math.round(days/7)}w ago`
    return `${Math.round(days/30)}mo ago`
  },
  meetingDate: (s) => {
    const d = new Date(s)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }) + ' at ' +
           d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  },
}

export const engagementColor = (score) => {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--danger)'
}

export const engagementLabel = (score) => {
  if (score >= 80) return 'Highly Engaged'
  if (score >= 60) return 'Moderate'
  return 'Needs Attention'
}

export const categoryIcon = {
  family:    '👪',
  career:    '💼',
  financial: '📊',
  health:    '❤️',
  education: '🎓',
  travel:    '✈️',
}

export const goalCategoryColor = {
  retirement:  '#c9a84c',
  'real-estate': '#2dd4a4',
  education:   '#4a8fff',
  financial:   '#a78bfa',
  income:      '#f59e0b',
  estate:      '#f06060',
}

export const totalAUM = clients.reduce((s, c) => s + c.portfolioValue, 0)
