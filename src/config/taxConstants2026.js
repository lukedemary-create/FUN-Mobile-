// ─────────────────────────────────────────────────────────────────────────────
// src/config/taxConstants2026.js
// Single source of truth for all 2026 tax figures used in Business Planning.
// VERIFIED: 2026-06-16  SOURCE: CFP Board 2026 Exam Tax Reference Tables
// ─────────────────────────────────────────────────────────────────────────────

export const TAX_2026 = {
  year: 2026,
  lastVerified: '2026-06-16',

  // ── Ordinary income brackets ────────────────────────────────────────────
  ordinaryBrackets: {
    single: [
      { upTo: 12400,    rate: 0.10 },
      { upTo: 50400,    rate: 0.12 },
      { upTo: 105700,   rate: 0.22 },
      { upTo: 201775,   rate: 0.24 },
      { upTo: 256225,   rate: 0.32 },
      { upTo: 640600,   rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfj: [
      { upTo: 24800,    rate: 0.10 },
      { upTo: 100800,   rate: 0.12 },
      { upTo: 211400,   rate: 0.22 },
      { upTo: 403550,   rate: 0.24 },
      { upTo: 512450,   rate: 0.32 },
      { upTo: 768700,   rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    mfs: [
      { upTo: 12400,    rate: 0.10 },
      { upTo: 50400,    rate: 0.12 },
      { upTo: 105700,   rate: 0.22 },
      { upTo: 201775,   rate: 0.24 },
      { upTo: 256225,   rate: 0.32 },
      { upTo: 384350,   rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    hoh: [
      { upTo: 18700,    rate: 0.10 },
      { upTo: 57050,    rate: 0.12 },
      { upTo: 92550,    rate: 0.22 },
      { upTo: 111800,   rate: 0.24 },
      { upTo: 201775,   rate: 0.32 },
      { upTo: 256225,   rate: 0.35 },
      { upTo: 640600,   rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },

  // ── Standard deductions ─────────────────────────────────────────────────
  standardDeduction: {
    single: 16100,
    mfj:    32200,
    mfs:    16100,
    hoh:    24150,
  },

  // ── Long-term capital gains breakpoints ─────────────────────────────────
  ltcgBreakpoints: {
    single: [
      { upTo: 49450,    rate: 0 },
      { upTo: 545500,   rate: 0.15 },
      { upTo: Infinity, rate: 0.20 },
    ],
    mfj: [
      { upTo: 98900,    rate: 0 },
      { upTo: 613700,   rate: 0.15 },
      { upTo: Infinity, rate: 0.20 },
    ],
    mfs: [
      { upTo: 49450,    rate: 0 },
      { upTo: 306850,   rate: 0.15 },
      { upTo: Infinity, rate: 0.20 },
    ],
    hoh: [
      { upTo: 66200,    rate: 0 },
      { upTo: 545500,   rate: 0.15 },
      { upTo: Infinity, rate: 0.20 },
    ],
  },

  // ── Self-employment tax ─────────────────────────────────────────────────
  // SE tax = 15.3% on net SE income × 0.9235 (up to SS wage base),
  // then 2.9% Medicare only above the wage base.
  se: {
    ssWageBase:           184500,  // Social Security wage base
    ssRate:               0.124,   // 12.4% SS (both employer + employee)
    medicareRate:         0.029,   // 2.9% Medicare (both portions)
    addlMedicareRate:     0.009,   // Additional 0.9% Medicare surtax
    seIncomeMultiplier:   0.9235,  // Net SE income = gross × 0.9235
    addlMedicareThreshold: {
      single: 200000,
      mfj:    250000,
      mfs:    125000,
      hoh:    200000,
    },
  },

  // ── Net Investment Income Tax (NIIT) ────────────────────────────────────
  niit: {
    rate: 0.038,
    thresholds: {
      single: 200000,
      mfj:    250000,
      mfs:    125000,
      hoh:    200000,
    },
  },

  // ── Corporate rate ──────────────────────────────────────────────────────
  cCorpRate: 0.21,

  // ── Qualified Business Income (§199A) ───────────────────────────────────
  // UNVERIFIED thresholds for 2026 — verify against IRS Rev. Proc. before launch
  qbi: {
    rate: 0.20,
    thresholds: {
      single: 197300,   // Phase-out begins (UNVERIFIED for 2026)
      mfj:    394600,   // Phase-out begins (UNVERIFIED for 2026)
    },
    phaseoutRange: {
      single: 50000,    // UNVERIFIED
      mfj:    100000,   // UNVERIFIED
    },
  },

  // ── Retirement plan limits ──────────────────────────────────────────────
  retirement: {
    sepRate:           0.25,    // 25% of W-2 compensation (sole props: net SE)
    sepLimit:          70000,   // UNVERIFIED for 2026; $69K in 2024
    simpleLimit:       16500,   // UNVERIFIED for 2026
    simpleCatchup:     3500,    // UNVERIFIED for 2026
    e401kElective:     24500,   // From CFP 2026 exam table
    e401kCatchup:      8000,    // Ages 50-59 and 64+; from CFP 2026
    e401kCatchup6063:  11250,   // Ages 60-63 (SECURE 2.0); from CFP 2026
    dcTotalLimit:      70000,   // UNVERIFIED for 2026
    dbPracticalMax:    280000,  // UNVERIFIED for 2026
    secure2StartupCredit: {
      perEmployee:     250,
      max:             5000,
      autoEnrollCredit: 500,
    },
  },

  // ── IRA limits ──────────────────────────────────────────────────────────
  ira: {
    limit:   7500,   // From CFP 2026 exam table
    catchup: 1100,   // From CFP 2026 exam table
    rothPhaseout: {
      single: { start: 153000, end: 168000 },
      mfj:    { start: 242000, end: 252000 },
    },
  },

  // ── HSA limits ──────────────────────────────────────────────────────────
  hsa: {
    selfOnly: 4400,   // From CFP 2026 exam table
    family:   8750,   // From CFP 2026 exam table
    catchup:  1000,   // Age 55+ catch-up
  },

  // ── Estate & gift ───────────────────────────────────────────────────────
  estate: {
    giftAnnualExclusion: 19000,        // From CFP 2026 exam table
    lifetimeExemption:   15000000,     // From CFP 2026 exam table
  },

  // ── AMT ─────────────────────────────────────────────────────────────────
  amt: {
    single: { exemption: 90100,  phaseoutStart: 500000  },
    mfj:    { exemption: 140200, phaseoutStart: 1000000 },
    mfs:    { exemption: 70100,  phaseoutStart: 500000  },
    hoh:    { exemption: 90100,  phaseoutStart: 500000  },
  },

  // ── SS wage base already in se.ssWageBase ───────────────────────────────
};

export default TAX_2026;
