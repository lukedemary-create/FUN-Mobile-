import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  ShoppingCart, Home, Fuel, TrendingUp, TrendingDown,
  Search, MapPin, AlertTriangle, Info, ChevronDown,
  CreditCard, BarChart2, PiggyBank,
} from "lucide-react";
import api from "@/api/marketApi";

/* ─── Design tokens ──────────────────────────────────────────────── */
const BG    = "var(--bg)";
const CARD  = "var(--card)";
const BDR   = "var(--border-c)";
const T1    = "var(--text-1)";
const T2    = "var(--text-2)";
const T3    = "var(--text-3)";
const GOLD  = "var(--gold)";
const UP    = "var(--up)";
const DOWN  = "var(--down)";

/* ─── City → FRED HPI mapping ────────────────────────────────────── */
// Case-Shiller MSA codes (seasonally adjusted)
const CASE_SHILLER = {
  'atlanta':       { code: 'ATXRSA',   name: 'Atlanta Metro Area',        state: 'GA', type: 'metro' },
  'boston':        { code: 'BOXRSA',   name: 'Boston Metro Area',          state: 'MA', type: 'metro' },
  'charlotte':     { code: 'CRXRSA',   name: 'Charlotte Metro Area',       state: 'NC', type: 'metro' },
  'chicago':       { code: 'CHXRSA',   name: 'Chicago Metro Area',         state: 'IL', type: 'metro' },
  'cleveland':     { code: 'CEXRSA',   name: 'Cleveland Metro Area',       state: 'OH', type: 'metro' },
  'dallas':        { code: 'DAXRSA',   name: 'Dallas Metro Area',          state: 'TX', type: 'metro' },
  'denver':        { code: 'DNXRSA',   name: 'Denver Metro Area',          state: 'CO', type: 'metro' },
  'detroit':       { code: 'DEXRSA',   name: 'Detroit Metro Area',         state: 'MI', type: 'metro' },
  'las vegas':     { code: 'LVXRSA',   name: 'Las Vegas Metro Area',       state: 'NV', type: 'metro' },
  'los angeles':   { code: 'LXXRSA',   name: 'Los Angeles Metro Area',     state: 'CA', type: 'metro' },
  'miami':         { code: 'MIXRSA',   name: 'Miami Metro Area',           state: 'FL', type: 'metro' },
  'minneapolis':   { code: 'MNXRSA',   name: 'Minneapolis Metro Area',     state: 'MN', type: 'metro' },
  'new york':      { code: 'NYXRSA',   name: 'New York Metro Area',        state: 'NY', type: 'metro' },
  'phoenix':       { code: 'PHXRSA',   name: 'Phoenix Metro Area',         state: 'AZ', type: 'metro' },
  'portland':      { code: 'POXRSA',   name: 'Portland Metro Area',        state: 'OR', type: 'metro' },
  'san diego':     { code: 'SDXRSA',   name: 'San Diego Metro Area',       state: 'CA', type: 'metro' },
  'san francisco': { code: 'SFXRSA',   name: 'San Francisco Metro Area',   state: 'CA', type: 'metro' },
  'seattle':       { code: 'SEXRSA',   name: 'Seattle Metro Area',         state: 'WA', type: 'metro' },
  'tampa':         { code: 'TPXRSA',   name: 'Tampa Metro Area',           state: 'FL', type: 'metro' },
  'washington':    { code: 'WDXRSA',   name: 'Washington D.C. Metro Area', state: 'DC', type: 'metro' },
  // Redirects to nearest Case-Shiller metro
  'houston':       { code: 'DAXRSA',   name: 'Houston (TX — using Dallas Index)', state: 'TX', type: 'metro' },
  'austin':        { code: 'DAXRSA',   name: 'Austin (TX — using Dallas Index)',  state: 'TX', type: 'metro' },
  'san antonio':   { code: 'DAXRSA',   name: 'San Antonio (TX — using Dallas Index)', state: 'TX', type: 'metro' },
  'fort worth':    { code: 'DAXRSA',   name: 'Fort Worth Metro Area',      state: 'TX', type: 'metro' },
  'orlando':       { code: 'MIXRSA',   name: 'Orlando (FL — using Miami Index)',  state: 'FL', type: 'metro' },
  'jacksonville':  { code: 'TPXRSA',   name: 'Jacksonville (FL — using Tampa Index)', state: 'FL', type: 'metro' },
  'nashville':     { code: 'ATXRSA',   name: 'Nashville (TN — using Atlanta Index)', state: 'TN', type: 'metro' },
  'raleigh':       { code: 'CRXRSA',   name: 'Raleigh (NC — using Charlotte Index)', state: 'NC', type: 'metro' },
  'sacramento':    { code: 'SFXRSA',   name: 'Sacramento (CA — using SF Index)',  state: 'CA', type: 'metro' },
  'san jose':      { code: 'SFXRSA',   name: 'San Jose Metro Area',        state: 'CA', type: 'metro' },
  'oakland':       { code: 'SFXRSA',   name: 'Oakland (CA — using SF Index)',    state: 'CA', type: 'metro' },
  'indianapolis':  { code: 'CHXRSA',   name: 'Indianapolis (IN — using Chicago Index)', state: 'IN', type: 'metro' },
  'columbus':      { code: 'CEXRSA',   name: 'Columbus (OH — using Cleveland Index)', state: 'OH', type: 'metro' },
  'cincinnati':    { code: 'CEXRSA',   name: 'Cincinnati (OH — using Cleveland Index)', state: 'OH', type: 'metro' },
  'pittsburgh':    { code: 'CEXRSA',   name: 'Pittsburgh (PA — using Cleveland Index)', state: 'PA', type: 'metro' },
  'baltimore':     { code: 'WDXRSA',   name: 'Baltimore (MD — using DC Index)',   state: 'MD', type: 'metro' },
  'richmond':      { code: 'WDXRSA',   name: 'Richmond (VA — using DC Index)',    state: 'VA', type: 'metro' },
  'st louis':      { code: 'CHXRSA',   name: 'St. Louis (MO — using Chicago Index)', state: 'MO', type: 'metro' },
  'kansas city':   { code: 'DAXRSA',   name: 'Kansas City (MO — using Dallas Index)', state: 'MO', type: 'metro' },
  'salt lake':     { code: 'DNXRSA',   name: 'Salt Lake City (UT — using Denver Index)', state: 'UT', type: 'metro' },
  'boise':         { code: 'DNXRSA',   name: 'Boise (ID — using Denver Index)',   state: 'ID', type: 'metro' },
  'tucson':        { code: 'PHXRSA',   name: 'Tucson (AZ — using Phoenix Index)', state: 'AZ', type: 'metro' },
  'albuquerque':   { code: 'PHXRSA',   name: 'Albuquerque (NM — using Phoenix Index)', state: 'NM', type: 'metro' },
};

/* ─── State FHFA HPI codes ───────────────────────────────────────── */
const STATE_HPI = {
  AL:'ALSTHPI', AK:'AKSTHPI', AZ:'AZSTHPI', AR:'ARSTHPI', CA:'CASTHPI',
  CO:'COSTHPI', CT:'CTSTHPI', DE:'DESTHPI', FL:'FLSTHPI', GA:'GASTHPI',
  HI:'HISTHPI', ID:'IDSTHPI', IL:'ILSTHPI', IN:'INSTHPI', IA:'IASTHPI',
  KS:'KSSTHPI', KY:'KYSTHPI', LA:'LASTHPI', ME:'MESTHPI', MD:'MDSTHPI',
  MA:'MASTHPI', MI:'MISTHPI', MN:'MNSTHPI', MS:'MSSTHPI', MO:'MOSTHPI',
  MT:'MTSTHPI', NE:'NESTHPI', NV:'NVSTHPI', NH:'NHSTHPI', NJ:'NJSTHPI',
  NM:'NMSTHPI', NY:'NYSTHPI', NC:'NCSTHPI', ND:'NDSTHPI', OH:'OHSTHPI',
  OK:'OKSTHPI', OR:'ORSTHPI', PA:'PASTHPI', RI:'RISTHPI', SC:'SCSTHPI',
  SD:'SDSTHPI', TN:'TNSTHPI', TX:'TXSTHPI', UT:'UTSTHPI', VT:'VTSTHPI',
  VA:'VASTHPI', WA:'WASTHPI', WV:'WVSTHPI', WI:'WISTHPI', WY:'WYSTHPI', DC:'DCSTHPI',
};

const STATE_NAMES = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa',
  KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland',
  MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri',
  MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio',
  OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming', DC:'D.C.',
};

/* ─── State name → abbr lookup ──────────────────────────────────── */
const STATE_ABBR = Object.fromEntries(Object.entries(STATE_NAMES).map(([k, v]) => [v.toLowerCase(), k]));

/* ─── EIA code → state abbr ─────────────────────────────────────── */
const EIA_TO_STATE = {
  SAL:'AL', SAK:'AK', SAZ:'AZ', SAR:'AR', SCA:'CA', SCO:'CO', SCT:'CT', SDE:'DE',
  SFL:'FL', SGA:'GA', SHI:'HI', SID:'ID', SIL:'IL', SIN:'IN', SIA:'IA', SKS:'KS',
  SKY:'KY', SLA:'LA', SME:'ME', SMD:'MD', SMA:'MA', SMI:'MI', SMN:'MN', SMS:'MS',
  SMO:'MO', SMT:'MT', SNE:'NE', SNV:'NV', SNH:'NH', SNJ:'NJ', SNM:'NM', SNY:'NY',
  SNC:'NC', SND:'ND', SOH:'OH', SOK:'OK', SOR:'OR', SPA:'PA', SRI:'RI', SSC:'SC',
  SSD:'SD', STN:'TN', STX:'TX', SUT:'UT', SVT:'VT', SVA:'VA', SWA:'WA', SWV:'WV',
  SWI:'WI', SWY:'WY', SDC:'DC',
};

/* ─── Gas price fallback (April 2026, EIA-sourced estimates) ─────── */
const GAS_FALLBACK = {
  AL:2.84, AK:3.64, AZ:3.35, AR:2.81, CA:4.92, CO:3.18, CT:3.28, DE:3.04,
  FL:3.12, GA:2.95, HI:4.77, ID:3.32, IL:3.42, IN:3.05, IA:3.01, KS:2.89,
  KY:2.92, LA:2.82, ME:3.14, MD:3.14, MA:3.19, MI:3.10, MN:3.08, MS:2.78,
  MO:2.89, MT:3.21, NE:2.98, NV:3.84, NH:3.12, NJ:3.08, NM:2.95, NY:3.38,
  NC:3.01, ND:3.05, OH:3.12, OK:2.78, OR:3.65, PA:3.28, RI:3.22, SC:2.88,
  SD:3.02, TN:2.91, TX:2.84, UT:3.28, VT:3.18, VA:3.08, WA:3.88, WV:3.05,
  WI:3.04, WY:3.15, DC:3.42,
};

/* ─── Food items definition ──────────────────────────────────────── */
const FOOD_ITEMS = [
  { id: 'APU0000708111', label: 'Eggs (dozen)', unit: '/doz', icon: '🥚', color: '#f59e0b' },
  { id: 'APU0000703112', label: 'Ground Beef (lb)', unit: '/lb',  icon: '🥩', color: '#ef4444' },
  { id: 'APU0000706111', label: 'Chicken (lb)',     unit: '/lb',  icon: '🍗', color: '#f97316' },
  { id: 'APU0000709112', label: 'Whole Milk (gal)', unit: '/gal', icon: '🥛', color: '#60a5fa' },
  { id: 'APU0000702111', label: 'White Bread (lb)', unit: '/lb',  icon: '🍞', color: '#a78bfa' },
];

/* ─── CPI components ─────────────────────────────────────────────── */
const CPI_COMPONENTS = [
  { id: 'CPIAUCSL',  label: 'All Items',            color: GOLD,     weight: 100 },
  { id: 'CPILFESL',  label: 'Core (ex Food&Energy)', color: '#60a5fa', weight: 79.3 },
  { id: 'CPIFABSL',  label: 'Food & Beverages',     color: '#34d399', weight: 13.5 },
  { id: 'CPIENGSL',  label: 'Energy',               color: '#f97316', weight: 7.2  },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function getYoY(data) {
  if (!data || data.length < 13) return null;
  const latest = data[data.length - 1].value;
  const yearAgo = data[data.length - 13].value;
  return ((latest - yearAgo) / yearAgo) * 100;
}

function getMoM(data) {
  if (!data || data.length < 2) return null;
  const latest = data[data.length - 1].value;
  const prev = data[data.length - 2].value;
  return ((latest - prev) / prev) * 100;
}

function getPeriodChange(data, months) {
  if (!data || data.length < months + 1) return null;
  const latest = data[data.length - 1].value;
  const prev = data[data.length - 1 - months].value;
  return ((latest - prev) / prev) * 100;
}

function lastVal(data) {
  if (!data || data.length === 0) return null;
  return data[data.length - 1].value;
}

function fmt(v, digits = 2) {
  if (v == null || isNaN(v)) return '—';
  return v.toFixed(digits);
}

function fmtPct(v, showPlus = true) {
  if (v == null || isNaN(v)) return '—';
  const s = `${v >= 0 && showPlus ? '+' : ''}${v.toFixed(2)}%`;
  return s;
}

function slicePeriod(data, months) {
  if (!data) return [];
  return data.slice(-months).map(d => ({
    ...d,
    label: d.date?.slice(0, 7),
  }));
}

function trimDate(d) {
  if (!d) return '';
  // Monthly: "2024-03-01" → "Mar 24"
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

function findCity(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // Direct city match
  for (const [key, val] of Object.entries(CASE_SHILLER)) {
    if (q === key || q.startsWith(key) || key.startsWith(q)) return { ...val, matchType: 'metro' };
  }
  // State abbr match
  const abbr = q.toUpperCase();
  if (STATE_HPI[abbr]) return { code: STATE_HPI[abbr], name: `${STATE_NAMES[abbr]} (State)`, state: abbr, type: 'state', matchType: 'state' };
  // State name match
  const byName = STATE_ABBR[q];
  if (byName && STATE_HPI[byName]) return { code: STATE_HPI[byName], name: `${STATE_NAMES[byName]} (State)`, state: byName, type: 'state', matchType: 'state' };
  return null;
}

/* ─── Shared UI primitives ───────────────────────────────────────── */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BDR}`, borderRadius: 10,
      padding: '1.25rem', ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: 38, height: 38, background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={GOLD} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: T1, letterSpacing: '-0.01em' }}>{title}</span>
          {badge && <span style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.1em', color: GOLD, background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase' }}>{badge}</span>}
        </div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: T3, marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit = '', change, changeLabel = 'YoY', sub, loading, color }) {
  const isPos = change >= 0;
  const changeColor = color || (isPos ? UP : DOWN);
  return (
    <Card>
      <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', color: T3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>{label}</div>
      {loading ? (
        <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ) : (
        <>
          <div style={{ fontSize: '1.625rem', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1 }}>
            {value}<span style={{ fontSize: '0.875rem', fontWeight: 500, color: T2, marginLeft: 3 }}>{unit}</span>
          </div>
          {change != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
              {change >= 0 ? <TrendingUp size={12} color={changeColor} /> : <TrendingDown size={12} color={changeColor} />}
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: changeColor }}>{fmtPct(change)}</span>
              <span style={{ fontSize: '0.625rem', color: T3 }}>{changeLabel}</span>
            </div>
          )}
          {sub && <div style={{ fontSize: '0.6875rem', color: T3, marginTop: '0.375rem' }}>{sub}</div>}
        </>
      )}
    </Card>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid rgba(201,168,76,0.15)', borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:0.8}}`}</style>
    </div>
  );
}

function NoData({ msg = 'No data available' }) {
  return <div style={{ textAlign: 'center', color: T3, fontSize: '0.75rem', padding: '2rem 0' }}>{msg}</div>;
}

/* ─── Custom tooltip for recharts ────────────────────────────────── */
function ChartTip({ active, payload, label, prefix = '', suffix = '', decimals = 2 }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(11,13,18,0.97)', border: `1px solid ${BDR}`, borderRadius: 8, padding: '0.625rem 0.875rem', fontSize: '0.75rem' }}>
      <div style={{ color: T3, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {prefix}{typeof p.value === 'number' ? p.value.toFixed(decimals) : p.value}{suffix}</div>
      ))}
    </div>
  );
}

/* ─── Consumer Pulse Section ─────────────────────────────────────── */
function ConsumerPulseSection({ fredData, loading }) {
  const cpi   = fredData?.CPIAUCSL?.data;
  const core  = fredData?.CPILFESL?.data;
  const sent  = fredData?.UMCSENT?.data;
  const save  = fredData?.PSAVERT?.data;

  const cpiYoY  = getYoY(cpi);
  const coreYoY = getYoY(core);
  const sentVal = lastVal(sent);
  const saveVal = lastVal(save);

  // Sentiment baseline is ~90 (long-run avg), savings baseline ~5%
  const sentChange = sentVal != null ? ((sentVal - 90) / 90 * 100) : null;
  const saveChange = save && save.length >= 13 ? (saveVal - save[save.length - 13].value) : null;

  const stressScore = cpiYoY != null && sentVal != null
    ? Math.min(100, Math.max(0, Math.round(50 + (cpiYoY - 2.5) * 8 - (sentVal - 80) * 0.3)))
    : null;

  const stressLabel = stressScore == null ? '—'
    : stressScore < 35 ? 'Resilient'
    : stressScore < 55 ? 'Moderate'
    : stressScore < 70 ? 'Elevated'
    : 'High Stress';

  const stressColor = stressScore == null ? T3
    : stressScore < 35 ? UP
    : stressScore < 55 ? GOLD
    : stressScore < 70 ? '#f97316'
    : DOWN;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionTitle
        icon={ShoppingCart}
        title="Consumer Stress Index"
        subtitle="Composite view of inflation, sentiment, and financial health — as of April 2026"
        badge="Live FRED"
      />

      {/* Stress gauge bar */}
      {stressScore != null && (
        <Card style={{ marginBottom: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
            <span style={{ fontSize: '0.6875rem', color: T3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Consumer Stress Indicator</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: stressColor }}>{stressLabel}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${stressScore}%`, background: `linear-gradient(90deg, ${UP}, ${GOLD} 50%, ${DOWN})`, borderRadius: 999, transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: '0.5625rem', color: T3 }}>Resilient</span>
            <span style={{ fontSize: '0.5625rem', color: T3 }}>High Stress</span>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
        <MetricCard label="CPI — All Items" value={fmt(lastVal(cpi), 1)} unit="index" change={cpiYoY} changeLabel="YoY" sub="Bureau of Labor Statistics" loading={loading} />
        <MetricCard label="Core CPI (ex Food & Energy)" value={fmt(lastVal(core), 1)} unit="index" change={coreYoY} changeLabel="YoY" sub="Excludes volatile categories" loading={loading} />
        <MetricCard label="Consumer Sentiment" value={fmt(sentVal, 1)} unit="pts" change={sentChange} changeLabel="vs. 90 avg" sub="Univ. of Michigan Survey" loading={loading} color={sentChange != null && sentChange >= 0 ? UP : DOWN} />
        <MetricCard label="Personal Savings Rate" value={fmt(saveVal, 1)} unit="%" change={saveChange} changeLabel="YoY pts" sub="% of disposable income" loading={loading} color={saveChange != null && saveChange >= 0 ? UP : DOWN} />
      </div>

      {/* CPI Trend Mini-Chart */}
      {!loading && cpi && cpi.length > 12 && (
        <Card style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: T1 }}>CPI Components — 5-Year Trend</span>
            <span style={{ fontSize: '0.625rem', color: T3 }}>Monthly, YoY %</span>
          </div>
          <CPILineChart fredData={fredData} />
        </Card>
      )}
    </section>
  );
}

function CPILineChart({ fredData }) {
  const months = 60;
  // Build aligned dataset
  const cpiData = fredData?.CPIAUCSL?.data?.slice(-months) || [];
  const merged = cpiData.map((d, i) => {
    const getYoYAt = (series, idx, arr) => {
      if (idx < 12) return null;
      const cur = arr[idx].value;
      const prev = arr[idx - 12].value;
      return ((cur - prev) / prev) * 100;
    };
    const cpiArr = fredData?.CPIAUCSL?.data || [];
    const coreArr = fredData?.CPILFESL?.data || [];
    const foodArr = fredData?.CPIFABSL?.data || [];
    const energyArr = fredData?.CPIENGSL?.data || [];

    const cpiIdx = cpiArr.findIndex(x => x.date === d.date);
    const coreIdx = coreArr.findIndex(x => x.date === d.date);
    const foodIdx = foodArr.findIndex(x => x.date === d.date);
    const energyIdx = energyArr.findIndex(x => x.date === d.date);

    return {
      label: trimDate(d.date),
      cpi:    cpiIdx >= 12    ? getYoYAt(null, cpiIdx, cpiArr) : null,
      core:   coreIdx >= 12   ? getYoYAt(null, coreIdx, coreArr) : null,
      food:   foodIdx >= 12   ? getYoYAt(null, foodIdx, foodArr) : null,
      energy: energyIdx >= 12 ? getYoYAt(null, energyIdx, energyArr) : null,
    };
  }).filter(d => d.cpi != null);

  if (merged.length === 0) return <NoData />;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={merged} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="label" tick={{ fill: T3, fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: T3, fontSize: 9 }} tickLine={false} tickFormatter={v => `${v.toFixed(1)}%`} />
        <Tooltip content={<ChartTip suffix="%" decimals={2} />} />
        <ReferenceLine y={2} stroke={GOLD} strokeDasharray="4 2" strokeWidth={1} label={{ value: '2% target', fill: GOLD, fontSize: 9, position: 'right' }} />
        <Line dataKey="cpi"    name="All Items"    stroke={GOLD}     strokeWidth={2} dot={false} />
        <Line dataKey="core"   name="Core"         stroke="#60a5fa"  strokeWidth={1.5} dot={false} />
        <Line dataKey="food"   name="Food"         stroke="#34d399"  strokeWidth={1.5} dot={false} strokeDasharray="3 2" />
        <Line dataKey="energy" name="Energy"       stroke="#f97316"  strokeWidth={1.5} dot={false} strokeDasharray="3 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ─── Housing Section ────────────────────────────────────────────── */
function HousingSection({ fredData, loading }) {
  const [cityInput, setCityInput] = useState('');
  const [cityResult, setCityResult] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState('');
  const [horizon, setHorizon] = useState('10yr');
  // Fetch CSUSHPINSA independently with a high limit so 30yr chart has enough data
  const [hpiLong, setHpiLong] = useState(null);

  useEffect(() => {
    api.fred('CSUSHPINSA', 500)
      .then(res => { if (res?.data?.length) setHpiLong(res.data); })
      .catch(() => {});
  }, []);

  const mspus   = fredData?.MSPUS?.data;
  const mort30  = fredData?.MORTGAGE30US?.data;
  // Prefer the independently-fetched long history; fall back to shared fredData
  const hpi     = hpiLong || fredData?.CSUSHPINSA?.data;

  const medPrice = lastVal(mspus);
  const mort30v  = lastVal(mort30);
  const medChg5  = getPeriodChange(mspus, Math.min(20, (mspus?.length || 0) - 1));

  const horizonMonths = { '5yr': 60, '10yr': 120, '30yr': 360 };

  async function searchCity() {
    const match = findCity(cityInput);
    if (!match) { setCityError(`No data found for "${cityInput}". Try a major city or state name.`); setCityResult(null); return; }
    setCityError('');
    setCityResult(match);
    setCityLoading(true);
    try {
      const res = await api.fred(match.code, 500);
      setCityData(res.data || []);
    } catch (e) {
      setCityError('Could not load housing data. Please try again.');
    } finally { setCityLoading(false); }
  }

  // Build a single merged dataset so both lines share the same X axis.
  // National monthly data is the spine. City data can be monthly (Case-Shiller)
  // or quarterly (FHFA state HPI) — quarterly dates are interpolated forward-filled
  // so the city line appears continuous on a monthly axis.
  function buildMergedChart(natData, citData, months) {
    if (!natData || natData.length === 0) return [];
    const natSlice = natData.slice(-months);
    const natBase  = natSlice[0]?.value || 1;

    // Build a sorted city array and forward-fill quarterly gaps
    const cityMap = {};
    if (citData && citData.length > 0) {
      const startDate = natSlice[0].date;
      const citInRange = citData.filter(d => d.date >= startDate).sort((a, b) => a.date.localeCompare(b.date));
      if (citInRange.length > 0) {
        const citBase = citInRange[0].value;
        // Normalise to %
        const normalised = citInRange.map(d => ({ date: d.date, pct: ((d.value - citBase) / citBase) * 100 }));
        // Forward-fill: for each quarterly (or monthly) point, mark it; interpolation handled by connectNulls
        normalised.forEach(d => { cityMap[d.date] = d.pct; });
      }
    }

    return natSlice.map(d => ({
      label:    trimDate(d.date),
      date:     d.date,
      national: ((d.value - natBase) / natBase) * 100,
      city:     cityMap[d.date] ?? null,
    }));
  }

  const mergedChart   = buildMergedChart(hpi, cityData, horizonMonths[horizon]);
  const lastPoint     = mergedChart[mergedChart.length - 1];
  const cityPctChange = lastPoint?.city  ?? null;
  const natPctChange  = lastPoint?.national ?? null;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionTitle
        icon={Home}
        title="Housing Market Intelligence"
        subtitle="Home price appreciation, mortgage rates, and affordability — S&P/Case-Shiller & FHFA indices"
        badge="FRED Data"
      />

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem', marginBottom: '1rem' }}>
        <MetricCard label="Median Sale Price (National)" value={medPrice ? `$${(medPrice / 1000).toFixed(0)}K` : '—'} unit="" change={medChg5} changeLabel="5yr" sub="U.S. Census Bureau / HUD" loading={loading} />
        <MetricCard label="30-Yr Fixed Mortgage" value={fmt(mort30v, 2)} unit="%" change={mort30 && mort30.length >= 52 ? (mort30v - mort30[mort30.length - 52].value) : null} changeLabel="1yr chg" sub="Freddie Mac Primary Market Survey" loading={loading} />
        <MetricCard label="Case-Shiller National HPI" value={fmt(lastVal(hpi), 1)} unit="idx" change={getPeriodChange(hpi, Math.min(12, (hpi?.length || 0) - 1))} changeLabel="1yr" sub="Base Jan 2000 = 100" loading={loading} />
        <Card>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', color: T3, textTransform: 'uppercase', marginBottom: '0.75rem' }}>Monthly Payment Est.</div>
          {loading ? <div style={{ height: 36, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} /> : (
            <>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1 }}>
                ${medPrice && mort30v ? Math.round((medPrice * 0.8) * (mort30v / 100 / 12) / (1 - Math.pow(1 + mort30v / 100 / 12, -360))).toLocaleString() : '—'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: T3, marginTop: 4 }}>20% down, 30yr at {fmt(mort30v, 2)}%</div>
            </>
          )}
        </Card>
      </div>

      {/* City search + chart */}
      <Card style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T1, marginBottom: '0.5rem' }}>Search Your City or State</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <MapPin size={13} color={T3} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchCity()}
                placeholder="e.g. Chicago, Phoenix, California..."
                style={{ width: '100%', paddingLeft: 30, padding: '0.5rem 0.75rem 0.5rem 30px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BDR}`, borderRadius: 7, color: T1, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={searchCity}
              style={{ padding: '0.5rem 1rem', background: GOLD, border: 'none', borderRadius: 7, color: '#07080a', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Search size={13} /> Search
            </button>
          </div>
          {cityError && <div style={{ fontSize: '0.6875rem', color: DOWN, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11} />{cityError}</div>}
        </div>

        {/* Horizon toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
          {['5yr', '10yr', '30yr'].map(h => (
            <button key={h} onClick={() => setHorizon(h)}
              style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${horizon === h ? GOLD : BDR}`, background: horizon === h ? 'rgba(201,168,76,0.1)' : 'transparent', color: horizon === h ? GOLD : T3, fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer' }}>
              {h}
            </button>
          ))}
          <span style={{ fontSize: '0.625rem', color: T3, alignSelf: 'center' }}>Price appreciation from start of period</span>
        </div>

        {/* Chart — single data array so both lines share the same X axis */}
        {cityLoading ? <Spinner /> : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mergedChart} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: T3, fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: T3, fontSize: 9 }} tickLine={false} tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`} />
              <Tooltip content={<ChartTip prefix="" suffix="%" decimals={1} />} />
              <ReferenceLine y={0} stroke={BDR} strokeWidth={1} />
              <Line dataKey="national" name="National" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" connectNulls />
              {cityResult && (
                <Line dataKey="city" name={cityResult.name} stroke={GOLD} strokeWidth={2.5} dot={false} connectNulls />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}

        {cityResult && cityPctChange != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(201,168,76,0.05)', borderRadius: 8, border: `1px solid rgba(201,168,76,0.15)` }}>
            <div>
              <div style={{ fontSize: '0.625rem', color: T3, marginBottom: 2 }}>SELECTED AREA</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: T1 }}>{cityResult.name}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.625rem', color: T3 }}>{horizon} Appreciation</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: cityPctChange >= 0 ? UP : DOWN }}>{fmtPct(cityPctChange)}</div>
            </div>
            {natPctChange != null && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.625rem', color: T3 }}>National</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: T2 }}>{fmtPct(natPctChange)}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <Info size={10} color={T3} style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: '0.5625rem', color: T3, lineHeight: 1.6 }}>
            Metro areas use the S&P/Case-Shiller Home Price Index (SA). State-level areas use the FHFA All-Transactions HPI. Both are index-based — they show appreciation from the start of the selected period, not absolute dollar values. National median home price shown separately.
          </div>
        </div>
      </Card>

      {/* Median home price trend */}
      {!loading && mspus && (
        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T1, marginBottom: '0.875rem' }}>U.S. Median Home Sale Price (Historical)</div>
          <MedianPriceChart data={mspus} />
        </Card>
      )}
    </section>
  );
}

function MedianPriceChart({ data }) {
  const chartData = (data || []).slice(-60).map(d => ({ label: trimDate(d.date), value: d.value / 1000 }));
  if (!chartData.length) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="houseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.25} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="label" tick={{ fill: T3, fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: T3, fontSize: 9 }} tickLine={false} tickFormatter={v => `$${v}K`} />
        <Tooltip content={<ChartTip prefix="$" suffix="K" decimals={1} />} />
        <Area dataKey="value" name="Median Price" stroke={GOLD} strokeWidth={2} fill="url(#houseFill)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Gas Prices Section ─────────────────────────────────────────── */
function GasSection({ fredData, loading }) {
  const [stateGas, setStateGas] = useState(null);
  const [gasLoading, setGasLoading] = useState(true);
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    api.eiaStateGas()
      .then(data => {
        // Map EIA codes to state data
        const mapped = {};
        for (const [eiaCode, val] of Object.entries(data || {})) {
          const abbr = EIA_TO_STATE[eiaCode];
          if (abbr) mapped[abbr] = val.value;
        }
        setStateGas(Object.keys(mapped).length > 0 ? mapped : null);
      })
      .catch(() => setStateGas(null))
      .finally(() => setGasLoading(false));
  }, []);

  const gasData = fredData?.GASREGCOVW?.data;
  const currentGas = lastVal(gasData);

  // Build chart
  const gasChart = (gasData || []).slice(-104).map(d => ({ label: trimDate(d.date), price: d.value }));
  const gasYoY = getYoY(gasData?.length >= 53 ? gasData : null);
  const gas1Yr = gasData && gasData.length >= 53 ? gasData[gasData.length - 53].value : null;

  // Combine EIA live + fallback
  const stateTable = Object.entries(STATE_NAMES).map(([abbr, name]) => {
    const livePrice = stateGas?.[abbr];
    const fallback = GAS_FALLBACK[abbr];
    return { abbr, name, price: livePrice ?? fallback, isLive: livePrice != null };
  }).filter(s => s.price != null);

  const sorted = [...stateTable].sort((a, b) => sortDir === 'desc' ? b.price - a.price : a.price - b.price);
  const cheapest = [...stateTable].sort((a, b) => a.price - b.price).slice(0, 5);
  const priciest = [...stateTable].sort((a, b) => b.price - a.price).slice(0, 5);

  const nationalAvg = stateTable.length > 0 ? stateTable.reduce((s, x) => s + x.price, 0) / stateTable.length : currentGas;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionTitle
        icon={Fuel}
        title="At the Pump — National & State Gas Prices"
        subtitle="Weekly retail regular unleaded prices — EIA & FRED | Fuels consumer spending and inflation"
        badge="EIA + FRED"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem', marginBottom: '1rem' }}>
        <MetricCard label="National Avg (Regular)" value={`$${fmt(currentGas, 3)}`} change={gasYoY} changeLabel="YoY" sub="FRED / EIA Weekly Survey" loading={loading} />
        <MetricCard label="1-Year Ago" value={gas1Yr ? `$${fmt(gas1Yr, 3)}` : '—'} change={null} sub="Same week, prior year" loading={loading} />
        <MetricCard label="State Range (Low)" value={stateTable.length ? `$${fmt(Math.min(...stateTable.map(s=>s.price)), 3)}` : '—'} change={null} sub={stateTable.length ? cheapest[0].name : ''} loading={gasLoading || loading} />
        <MetricCard label="State Range (High)" value={stateTable.length ? `$${fmt(Math.max(...stateTable.map(s=>s.price)), 3)}` : '—'} change={null} sub={stateTable.length ? priciest[0].name : ''} loading={gasLoading || loading} />
      </div>

      {/* National gas trend */}
      {gasChart.length > 0 && (
        <Card style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T1, marginBottom: '0.875rem' }}>National Average Gas Price — 2-Year Weekly</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={gasChart} margin={{ top: 4, right: 4, bottom: 0, left: -4 }}>
              <defs>
                <linearGradient id="gasFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: T3, fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: T3, fontSize: 9 }} tickLine={false} tickFormatter={v => `$${v.toFixed(2)}`} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTip prefix="$" decimals={3} />} />
              <Area dataKey="price" name="Gas Price" stroke="#f97316" strokeWidth={2} fill="url(#gasFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* State gas table */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: T1 }}>State-by-State Regular Gas Prices</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!stateGas && !gasLoading && (
              <span style={{ fontSize: '0.5625rem', color: GOLD, background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.15)`, borderRadius: 4, padding: '2px 6px' }}>EIA Est. — Apr 2026</span>
            )}
            <button onClick={() => setSortDir(s => s === 'desc' ? 'asc' : 'desc')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'transparent', border: `1px solid ${BDR}`, borderRadius: 6, color: T3, fontSize: '0.625rem', cursor: 'pointer' }}>
              <ChevronDown size={10} style={{ transform: sortDir === 'asc' ? 'rotate(180deg)' : 'none' }} />
              {sortDir === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
          </div>
        </div>
        {gasLoading ? <Spinner /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.375rem' }}>
            {sorted.map(s => {
              const diff = s.price - nationalAvg;
              const pct = (s.price / Math.max(...stateTable.map(x => x.price))) * 100;
              return (
                <div key={s.abbr} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', background: 'rgba(255,255,255,0.02)', borderRadius: 7, border: `1px solid ${BDR}` }}>
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: T3, width: 20, flexShrink: 0 }}>{s.abbr}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.price > 4 ? DOWN : s.price < 3 ? UP : '#f97316', borderRadius: 999 }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: s.price > 4 ? DOWN : s.price < 3 ? UP : T1, flexShrink: 0 }}>${fmt(s.price, 3)}</span>
                  <span style={{ fontSize: '0.5625rem', color: diff >= 0 ? DOWN : UP, flexShrink: 0 }}>{diff >= 0 ? '+' : ''}{diff.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
}

/* ─── Food Prices Section ────────────────────────────────────────── */
function FoodSection({ foodData, foodLoading }) {
  const foodCpi = foodData?.CPIFABSL?.data;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionTitle
        icon={ShoppingCart}
        title="The Grocery Bill — Food & Staples"
        subtitle="Average consumer prices for key food items — Bureau of Labor Statistics via FRED"
        badge="BLS / FRED"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.875rem', marginBottom: '1rem' }}>
        {FOOD_ITEMS.map(item => {
          const series = foodData?.[item.id];
          const data = series?.data || [];
          const current = lastVal(data);
          const yoy = getYoY(data);
          const mom = getMoM(data);
          const sparkData = data.slice(-24).map(d => ({ v: d.value }));
          return (
            <Card key={item.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: T3, textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: '0.5625rem', color: T3 }}>national average</div>
                </div>
              </div>
              {foodLoading ? (
                <div style={{ height: 50, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
              ) : current != null ? (
                <>
                  <div style={{ fontSize: '1.625rem', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    ${fmt(current, 2)}<span style={{ fontSize: '0.75rem', color: T3, marginLeft: 2 }}>{item.unit}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.5rem' }}>
                    {yoy != null && (
                      <div>
                        <div style={{ fontSize: '0.5625rem', color: T3 }}>YoY</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: yoy >= 0 ? DOWN : UP }}>{fmtPct(yoy)}</div>
                      </div>
                    )}
                    {mom != null && (
                      <div>
                        <div style={{ fontSize: '0.5625rem', color: T3 }}>MoM</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: mom >= 0 ? DOWN : UP }}>{fmtPct(mom)}</div>
                      </div>
                    )}
                  </div>
                  {sparkData.length > 4 && (
                    <div style={{ marginTop: '0.625rem' }}>
                      <ResponsiveContainer width="100%" height={40}>
                        <LineChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                          <Line dataKey="v" stroke={item.color} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </>
              ) : (
                <NoData msg="Data unavailable" />
              )}
            </Card>
          );
        })}
      </div>

      {/* Food CPI trend */}
      {foodCpi && foodCpi.length > 12 && (
        <Card>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T1, marginBottom: '0.875rem' }}>Food & Beverages CPI — 5-Year History</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={foodCpi.slice(-60).map(d => ({ label: trimDate(d.date), value: d.value }))} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="foodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fill: T3, fontSize: 9 }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: T3, fontSize: 9 }} tickLine={false} />
              <Tooltip content={<ChartTip decimals={1} />} />
              <Area dataKey="value" name="Food & Beverages CPI" stroke="#34d399" strokeWidth={2} fill="url(#foodFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}
    </section>
  );
}

/* ─── CPI Breakdown Section ──────────────────────────────────────── */
function CPIBreakdownSection({ fredData, loading }) {
  const cpi    = fredData?.CPIAUCSL?.data;
  const core   = fredData?.CPILFESL?.data;
  const food   = fredData?.CPIFABSL?.data;
  const energy = fredData?.CPIENGSL?.data;

  const getChg = (arr, n) => getPeriodChange(arr, Math.min(n, (arr?.length || 0) - 1));

  const rows = [
    { label: 'All Items (Headline)',    color: GOLD,     data: cpi,    weight: '100%' },
    { label: 'Core (ex Food & Energy)', color: '#60a5fa', data: core,   weight: '79.3%' },
    { label: 'Food & Beverages',        color: '#34d399', data: food,   weight: '13.5%' },
    { label: 'Energy',                  color: '#f97316', data: energy, weight: '7.2%'  },
  ];

  const cpiYoY = getYoY(cpi);
  const coreYoY = getYoY(core);
  const foodYoY = getYoY(food);
  const energyYoY = getYoY(energy);

  const analyst = (() => {
    if (cpiYoY == null) return null;
    const lines = [];
    if (cpiYoY > 3.5) lines.push(`Headline CPI running at ${fmt(cpiYoY, 1)}% YoY — materially above the Fed's 2% target, maintaining upward pressure on consumer purchasing power.`);
    else if (cpiYoY > 2.5) lines.push(`Headline CPI at ${fmt(cpiYoY, 1)}% YoY — moderating but still above target; the disinflation trend is underway.`);
    else lines.push(`Headline CPI near ${fmt(cpiYoY, 1)}% YoY — approaching the Fed's 2% objective. Inflation stress on the consumer is easing.`);
    if (foodYoY != null) lines.push(`Food inflation of ${fmt(foodYoY, 1)}% YoY disproportionately impacts lower-income households who allocate a larger share of budget to groceries.`);
    if (energyYoY != null) {
      lines.push(energyYoY > 5 ? `Energy CPI surging at ${fmt(energyYoY, 1)}% YoY — amplifying cost of transportation and household utilities.` : `Energy costs ${energyYoY >= 0 ? 'rising' : 'falling'} ${fmt(Math.abs(energyYoY), 1)}% YoY, providing ${energyYoY < 0 ? 'relief' : 'additional headwinds'} to the consumer.`);
    }
    return lines;
  })();

  return (
    <section style={{ marginBottom: '2rem' }}>
      <SectionTitle
        icon={TrendingUp}
        title="CPI Deep Dive — The Inflation Blueprint"
        subtitle="Component breakdown, weights, and multi-period change — as tracked by the Bureau of Labor Statistics"
        badge="BLS / FRED"
      />

      {/* Component table */}
      <Card style={{ marginBottom: '1rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BDR}` }}>
                {['Component', 'Weight', '1-Month', '3-Month', '6-Month', '1-Year', '5-Year'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: h === 'Component' ? 'left' : 'right', color: T3, fontWeight: 600, fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.03)` }}>
                  <td style={{ padding: '0.625rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: row.color, flexShrink: 0 }} />
                      <span style={{ color: T1, fontWeight: 600 }}>{row.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', color: T3 }}>{row.weight}</td>
                  {[1, 3, 6, 12, 60].map(n => {
                    const chg = getChg(row.data, n);
                    return (
                      <td key={n} style={{ padding: '0.625rem 0.75rem', textAlign: 'right' }}>
                        {loading ? <span style={{ color: T3 }}>—</span> : chg != null ? (
                          <span style={{ color: chg >= 0 ? DOWN : UP, fontWeight: 600 }}>{fmtPct(chg)}</span>
                        ) : <span style={{ color: T3 }}>—</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Analyst commentary */}
      {analyst && (
        <Card style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: '1.25rem' }}>
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Analyst Commentary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {analyst.map((line, i) => (
              <div key={i} style={{ fontSize: '0.8125rem', color: T2, lineHeight: 1.6 }}>{line}</div>
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}

/* ─── Main Consumer Page ─────────────────────────────────────────── */
const PULSE_SERIES  = ['CPIAUCSL', 'CPILFESL', 'CPIFABSL', 'CPIENGSL', 'UMCSENT', 'PSAVERT'];
const HOUSING_SERIES = ['MSPUS', 'MORTGAGE30US', 'CSUSHPINSA'];
const GAS_SERIES    = ['GASREGCOVW'];
const FOOD_SERIES_IDS = [...FOOD_ITEMS.map(f => f.id), 'CPIFABSL'];

export default function Consumer() {
  const [fredData, setFredData] = useState({});
  const [foodData, setFoodData] = useState({});
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const allSeries = [...new Set([...PULSE_SERIES, ...HOUSING_SERIES, ...GAS_SERIES])];

    Promise.allSettled([
      api.fredMultiple(allSeries, 480),
      api.fredMultiple(FOOD_SERIES_IDS, 130),
    ]).then(([mainRes, foodRes]) => {
      if (mainRes.status === 'fulfilled') setFredData(mainRes.value || {});
      else setError('Could not reach FRED data server. Check that the local backend is running.');

      if (foodRes.status === 'fulfilled') setFoodData(foodRes.value || {});
    }).finally(() => {
      setLoading(false);
      setFoodLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border-c)",
        borderRadius: 16,
        padding: "1.75rem 2rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 320, height: 320,
          background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", position: "relative" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <ShoppingCart size={14} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="t-page-title" style={{ margin: 0 }}>THE CONSUMER</h1>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: 560, margin: "0 0 1rem" }}>
              Monitor the American consumer — the engine of the US economy. Track retail spending, consumer confidence, credit conditions, and personal savings trends.
            </p>
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Retail Sales", "Consumer Sentiment", "Credit Trends", "PCE Inflation"].map((label) => (
                <span key={label} style={{
                  fontSize: "0.6875rem", fontWeight: 700, padding: "3px 10px",
                  borderRadius: 99, letterSpacing: "0.04em",
                  background: "rgba(201,168,76,0.10)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "var(--gold)",
                }}>{label}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", flexShrink: 0 }}>
            {[
              { icon: ShoppingCart, label: "Retail Sales", sub: "Monthly spending data", color: "#3b82f6" },
              { icon: BarChart2, label: "Consumer Confidence", sub: "U of M & Conference Board", color: "var(--gold)" },
              { icon: CreditCard, label: "Credit Card Debt", sub: "Consumer credit trends", color: "var(--teal)" },
              { icon: PiggyBank, label: "Savings Rate", sub: "Personal saving & PCE", color: "#f59e0b" },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem",
                background: "var(--bg)", border: "1px solid var(--border-c)",
                borderRadius: 10, minWidth: 170,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: 2, lineHeight: 1.3 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.8125rem', color: DOWN }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <ConsumerPulseSection fredData={fredData} loading={loading} />
      <HousingSection fredData={fredData} loading={loading} />
      <GasSection fredData={fredData} loading={loading} />
      <FoodSection foodData={foodData} foodLoading={foodLoading} />
      <CPIBreakdownSection fredData={fredData} loading={loading} />

      <div style={{ textAlign: 'center', padding: '1rem 0', fontSize: '0.5625rem', color: T3, lineHeight: 1.8 }}>
        Data sourced from the Federal Reserve Bank of St. Louis (FRED), U.S. Energy Information Administration (EIA), and Bureau of Labor Statistics (BLS).
        All data is for educational and informational purposes only. Not investment advice.
      </div>
    </div>
  );
}
