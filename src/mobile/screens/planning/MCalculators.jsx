import { useState } from 'react'
import { Search, ChevronLeft, TrendingUp, Home, Clock, Receipt, CreditCard, DollarSign, Car, Percent } from 'lucide-react'
import ScreenHeader from '../../navigation/ScreenHeader'
import { MCard, MSectionHeader, MResultRow, MPrimaryBtn } from '../../components/MCard'
import { C, UI, MONO, DISPLAY } from '../../tokens'

// ─── All calculator definitions ──────────────────────────────────────────────
const CALCS = {
  'Compound Interest': {
    icon: TrendingUp, color: C.teal,
    fields: [
      { key:'principal', label:'Initial Investment', prefix:'$', def:10000 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
      { key:'years', label:'Years', def:20 },
      { key:'monthly', label:'Monthly Addition', prefix:'$', def:200 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const fv = f.principal*Math.pow(1+r,n) + f.monthly*((Math.pow(1+r,n)-1)/r)
      const contrib = f.principal + f.monthly*n
      const interest = fv - contrib
      return [['Future Value', '$'+Math.round(fv).toLocaleString(), true], ['Total Contributed', '$'+Math.round(contrib).toLocaleString()], ['Interest Earned', '$'+Math.round(interest).toLocaleString()]]
    }
  },
  'Mortgage Payment': {
    icon: Home, color: C.gold,
    fields: [
      { key:'price', label:'Home Price', prefix:'$', def:400000 },
      { key:'down', label:'Down Payment (%)', suffix:'%', def:20 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.82 },
      { key:'years', label:'Loan Term (years)', def:30 },
    ],
    calc: f => {
      const loan = f.price*(1-f.down/100), r = f.rate/100/12, n = f.years*12
      const pmt = r>0 ? loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : loan/n
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Loan Amount', '$'+Math.round(loan).toLocaleString()], ['Total Interest', '$'+Math.round(pmt*n-loan).toLocaleString()]]
    }
  },
  'Retirement Savings': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'current', label:'Current Savings', prefix:'$', def:50000 },
      { key:'monthly', label:'Monthly Contribution', prefix:'$', def:1000 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
      { key:'years', label:'Years to Retirement', def:30 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const fv = f.current*Math.pow(1+r,n) + f.monthly*((Math.pow(1+r,n)-1)/r)
      return [['Nest Egg', '$'+Math.round(fv).toLocaleString(), true], ['Monthly Income (4%)', '$'+Math.round(fv*0.04/12).toLocaleString()], ['Total Contributions', '$'+Math.round(f.current+f.monthly*n).toLocaleString()]]
    }
  },
  'Loan Payment': {
    icon: DollarSign, color: '#06b6d4',
    fields: [
      { key:'amount', label:'Loan Amount', prefix:'$', def:25000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:7.5 },
      { key:'years', label:'Loan Term (years)', def:5 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const pmt = r>0 ? f.amount*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : f.amount/n
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Paid', '$'+Math.round(pmt*n).toLocaleString()], ['Total Interest', '$'+Math.round(pmt*n-f.amount).toLocaleString()]]
    }
  },
  'Debt Payoff': {
    icon: CreditCard, color: C.warning,
    fields: [
      { key:'balance', label:'Current Balance', prefix:'$', def:15000 },
      { key:'rate', label:'APR (%)', suffix:'%', def:19.99 },
      { key:'payment', label:'Monthly Payment', prefix:'$', def:400 },
    ],
    calc: f => {
      const r = f.rate/100/12
      let bal = f.balance, months = 0, interest = 0
      while (bal > 0 && months < 600) {
        const int = bal*r; interest += int; bal = bal+int-f.payment; months++
      }
      const yrs = Math.floor(months/12), mos = months%12
      return [['Payoff Time', months>0 ? `${yrs>0?yrs+'y ':''} ${mos}m` : 'Never', true], ['Total Interest Paid', '$'+Math.round(interest).toLocaleString()], ['Total Paid', '$'+Math.round(f.payment*months).toLocaleString()]]
    }
  },
  'Tax Savings': {
    icon: Receipt, color: '#a855f7',
    fields: [
      { key:'income', label:'Annual Income', prefix:'$', def:120000 },
      { key:'contribution', label:'Pre-Tax Contribution', prefix:'$', def:23500 },
      { key:'rate', label:'Marginal Tax Rate (%)', suffix:'%', def:24 },
    ],
    calc: f => {
      const savings = f.contribution*(f.rate/100)
      return [['Tax Savings', '$'+Math.round(savings).toLocaleString(), true], ['After-Tax Cost', '$'+Math.round(f.contribution-savings).toLocaleString()], ['Effective Rate', (f.rate*(1-f.contribution/f.income)).toFixed(1)+'%']]
    }
  },
  'Auto Loan': {
    icon: Car, color: '#f59e0b',
    fields: [
      { key:'price', label:'Vehicle Price', prefix:'$', def:35000 },
      { key:'down', label:'Down Payment', prefix:'$', def:5000 },
      { key:'rate', label:'APR (%)', suffix:'%', def:6.5 },
      { key:'years', label:'Loan Term (years)', def:5 },
    ],
    calc: f => {
      const loan = f.price-f.down, r = f.rate/100/12, n = f.years*12
      const pmt = r>0 ? loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : loan/n
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Interest', '$'+Math.round(pmt*n-loan).toLocaleString()], ['Total Cost', '$'+Math.round(pmt*n+f.down).toLocaleString()]]
    }
  },
  '401(k) Calculator': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'salary', label:'Annual Salary', prefix:'$', def:100000 },
      { key:'contrib', label:'Contribution (%)', suffix:'%', def:10 },
      { key:'match', label:'Employer Match (%)', suffix:'%', def:4 },
      { key:'years', label:'Years Until Retirement', def:30 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
    ],
    calc: f => {
      const monthly = (f.salary*(f.contrib/100)/12) + (f.salary*(Math.min(f.contrib,f.match)/100)/12)
      const r = f.rate/100/12, n = f.years*12
      const fv = monthly*((Math.pow(1+r,n)-1)/r)
      return [['Projected 401(k)', '$'+Math.round(fv).toLocaleString(), true], ['Monthly Contribution', '$'+Math.round(monthly).toLocaleString()], ['Monthly Income (4%)', '$'+Math.round(fv*0.04/12).toLocaleString()]]
    }
  },
  'Roth IRA': {
    icon: Clock, color: C.teal,
    fields: [
      { key:'annual', label:'Annual Contribution', prefix:'$', def:7000 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
      { key:'years', label:'Years to Grow', def:30 },
      { key:'current', label:'Current Balance', prefix:'$', def:0 },
    ],
    calc: f => {
      const monthly = f.annual/12, r = f.rate/100/12, n = f.years*12
      const fv = f.current*Math.pow(1+r,n) + monthly*((Math.pow(1+r,n)-1)/r)
      return [['Tax-Free Balance', '$'+Math.round(fv).toLocaleString(), true], ['Contributions', '$'+Math.round(f.annual*f.years).toLocaleString()], ['Tax-Free Growth', '$'+Math.round(fv-f.annual*f.years-f.current).toLocaleString()]]
    }
  },
  'IRA Calculator': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'annual', label:'Annual Contribution', prefix:'$', def:7000 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
      { key:'years', label:'Years to Grow', def:30 },
      { key:'taxRate', label:'Tax Rate at Withdrawal (%)', suffix:'%', def:22 },
    ],
    calc: f => {
      const monthly = f.annual/12, r = f.rate/100/12, n = f.years*12
      const fv = monthly*((Math.pow(1+r,n)-1)/r)
      const afterTax = fv*(1-f.taxRate/100)
      return [['IRA Balance', '$'+Math.round(fv).toLocaleString(), true], ['After-Tax Value', '$'+Math.round(afterTax).toLocaleString()], ['Tax at Withdrawal', '$'+Math.round(fv*f.taxRate/100).toLocaleString()]]
    }
  },
  'Amortization': {
    icon: Home, color: '#3b82f6',
    fields: [
      { key:'loan', label:'Loan Amount', prefix:'$', def:320000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.82 },
      { key:'years', label:'Loan Term (years)', def:30 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const pmt = r>0 ? f.loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : f.loan/n
      const totalInterest = pmt*n-f.loan
      const yr1Principal = Array.from({length:12},(_,i) => {
        const int = f.loan*(Math.pow(1+r,i))*r
        return pmt-int
      }).reduce((a,b)=>a+b,0)
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Interest', '$'+Math.round(totalInterest).toLocaleString()], ['Year 1 Principal', '$'+Math.round(yr1Principal).toLocaleString()]]
    }
  },
  'Refinance': {
    icon: Home, color: '#3b82f6',
    fields: [
      { key:'balance', label:'Remaining Balance', prefix:'$', def:280000 },
      { key:'currentRate', label:'Current Rate (%)', suffix:'%', def:7.5 },
      { key:'newRate', label:'New Rate (%)', suffix:'%', def:6.5 },
      { key:'closingCosts', label:'Closing Costs', prefix:'$', def:5000 },
      { key:'years', label:'Years Remaining', def:25 },
    ],
    calc: f => {
      const n = f.years*12
      const r1 = f.currentRate/100/12, r2 = f.newRate/100/12
      const pmt1 = f.balance*r1*Math.pow(1+r1,n)/(Math.pow(1+r1,n)-1)
      const pmt2 = f.balance*r2*Math.pow(1+r2,n)/(Math.pow(1+r2,n)-1)
      const savings = pmt1-pmt2
      const breakeven = savings>0 ? Math.ceil(f.closingCosts/savings) : 0
      return [['Monthly Savings', '$'+Math.round(savings).toLocaleString(), true], ['Break-Even', breakeven>0?`${breakeven} months`:'N/A'], ['Total Savings', '$'+Math.round(savings*n-f.closingCosts).toLocaleString()]]
    }
  },
  'Down Payment': {
    icon: Home, color: C.gold,
    fields: [
      { key:'price', label:'Home Price', prefix:'$', def:450000 },
      { key:'down', label:'Down Payment (%)', suffix:'%', def:20 },
      { key:'savings', label:'Current Savings', prefix:'$', def:30000 },
      { key:'monthly', label:'Monthly Saving', prefix:'$', def:2000 },
      { key:'rate', label:'Savings Return (%)', suffix:'%', def:4.5 },
    ],
    calc: f => {
      const target = f.price*f.down/100
      const needed = target-f.savings
      const r = f.rate/100/12
      const months = needed>0 && f.monthly>0 ? Math.ceil(Math.log(1+needed*r/f.monthly)/Math.log(1+r)) : 0
      return [['Down Payment Target', '$'+Math.round(target).toLocaleString(), true], ['Amount Needed', '$'+Math.round(Math.max(0,needed)).toLocaleString()], ['Time to Save', months>0?`${Math.floor(months/12)}y ${months%12}m`:'Ready now']]
    }
  },
  'HELOC': {
    icon: Home, color: '#3b82f6',
    fields: [
      { key:'homeValue', label:'Home Value', prefix:'$', def:500000 },
      { key:'mortgage', label:'Mortgage Balance', prefix:'$', def:300000 },
      { key:'ltv', label:'Max LTV (%)', suffix:'%', def:85 },
      { key:'rate', label:'HELOC Rate (%)', suffix:'%', def:8.5 },
      { key:'drawAmount', label:'Draw Amount', prefix:'$', def:50000 },
    ],
    calc: f => {
      const maxLine = f.homeValue*f.ltv/100-f.mortgage
      const equity = f.homeValue-f.mortgage
      const interestOnly = f.drawAmount*(f.rate/100/12)
      return [['Available Credit', '$'+Math.round(Math.max(0,maxLine)).toLocaleString(), true], ['Home Equity', '$'+Math.round(equity).toLocaleString()], ['Interest-Only Payment', '$'+Math.round(interestOnly).toLocaleString()]]
    }
  },
  'Income Tax': {
    icon: Receipt, color: '#a855f7',
    fields: [
      { key:'income', label:'Gross Income', prefix:'$', def:120000 },
      { key:'deductions', label:'Deductions', prefix:'$', def:14600 },
      { key:'credits', label:'Tax Credits', prefix:'$', def:0 },
    ],
    calc: f => {
      const taxable = Math.max(0, f.income-f.deductions)
      const brackets = [[0.10,11925],[0.12,48475],[0.22,103350],[0.24,197300],[0.32,250525],[0.35,626350],[0.37,Infinity]]
      let tax=0, prev=0
      for (const [r,up] of brackets) {
        if (taxable<=prev) break
        tax += (Math.min(taxable,up)-prev)*r; prev=up
      }
      const finalTax = Math.max(0, tax-f.credits)
      return [['Tax Owed', '$'+Math.round(finalTax).toLocaleString(), true], ['Effective Rate', ((finalTax/f.income)*100).toFixed(1)+'%'], ['After-Tax Income', '$'+Math.round(f.income-finalTax).toLocaleString()]]
    }
  },
  'Savings Calculator': {
    icon: DollarSign, color: C.up,
    fields: [
      { key:'initial', label:'Initial Deposit', prefix:'$', def:5000 },
      { key:'monthly', label:'Monthly Deposit', prefix:'$', def:500 },
      { key:'rate', label:'Annual Rate (%)', suffix:'%', def:4.5 },
      { key:'years', label:'Years', def:10 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const fv = f.initial*Math.pow(1+r,n) + f.monthly*((Math.pow(1+r,n)-1)/r)
      const contrib = f.initial+f.monthly*n
      return [['Total Savings', '$'+Math.round(fv).toLocaleString(), true], ['Total Deposits', '$'+Math.round(contrib).toLocaleString()], ['Interest Earned', '$'+Math.round(fv-contrib).toLocaleString()]]
    }
  },
  'CD Calculator': {
    icon: DollarSign, color: C.teal,
    fields: [
      { key:'amount', label:'Deposit Amount', prefix:'$', def:10000 },
      { key:'rate', label:'APY (%)', suffix:'%', def:5.0 },
      { key:'years', label:'Term (years)', def:1 },
    ],
    calc: f => {
      const fv = f.amount*Math.pow(1+f.rate/100, f.years)
      return [['Maturity Value', '$'+Math.round(fv).toLocaleString(), true], ['Interest Earned', '$'+Math.round(fv-f.amount).toLocaleString()], ['Effective APY', f.rate.toFixed(2)+'%']]
    }
  },
  'ROI Calculator': {
    icon: TrendingUp, color: C.gold,
    fields: [
      { key:'cost', label:'Initial Cost', prefix:'$', def:10000 },
      { key:'revenue', label:'Return/Revenue', prefix:'$', def:14500 },
      { key:'years', label:'Years', def:3 },
    ],
    calc: f => {
      const roi = ((f.revenue-f.cost)/f.cost)*100
      const annualROI = Math.pow((f.revenue/f.cost),(1/f.years))-1
      return [['ROI', roi.toFixed(1)+'%', true], ['Annualized ROI', (annualROI*100).toFixed(1)+'%'], ['Net Gain', '$'+(f.revenue-f.cost).toLocaleString()]]
    }
  },
  'Credit Card Payoff': {
    icon: CreditCard, color: C.down,
    fields: [
      { key:'balance', label:'Balance', prefix:'$', def:8000 },
      { key:'apr', label:'APR (%)', suffix:'%', def:21.99 },
      { key:'payment', label:'Monthly Payment', prefix:'$', def:250 },
    ],
    calc: f => {
      const r = f.apr/100/12; let bal=f.balance, months=0, totalInt=0
      while (bal>0.01 && months<600) {
        const int=bal*r; totalInt+=int; bal=bal+int-f.payment; months++
      }
      return [['Months to Payoff', months>=600?'Never!':months+' months', true], ['Total Interest', '$'+Math.round(totalInt).toLocaleString()], ['Total Paid', '$'+Math.round(f.payment*months).toLocaleString()]]
    }
  },
  'Student Loan': {
    icon: DollarSign, color: C.indigo,
    fields: [
      { key:'balance', label:'Loan Balance', prefix:'$', def:35000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.54 },
      { key:'years', label:'Repayment Period (years)', def:10 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const pmt = r>0 ? f.balance*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : f.balance/n
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Interest', '$'+Math.round(pmt*n-f.balance).toLocaleString()], ['Total Paid', '$'+Math.round(pmt*n).toLocaleString()]]
    }
  },
  'Inflation Calculator': {
    icon: Percent, color: C.warning,
    fields: [
      { key:'amount', label:'Current Amount', prefix:'$', def:100000 },
      { key:'rate', label:'Inflation Rate (%)', suffix:'%', def:3 },
      { key:'years', label:'Years', def:20 },
    ],
    calc: f => {
      const future = f.amount*Math.pow(1+f.rate/100, f.years)
      const realVal = f.amount/Math.pow(1+f.rate/100, f.years)
      return [['Future Equivalent', '$'+Math.round(future).toLocaleString(), true], ['Real Value Today', '$'+Math.round(realVal).toLocaleString()], ['Purchasing Power Lost', '$'+Math.round(f.amount-realVal).toLocaleString()]]
    }
  },
  'Social Security Est.': {
    icon: Clock, color: C.teal,
    fields: [
      { key:'pia', label:'Estimated PIA', prefix:'$', def:2800 },
      { key:'claimAge', label:'Claiming Age', def:67 },
    ],
    calc: f => {
      const age = f.claimAge; let benefit = f.pia
      if (age < 67) { const m=(67-age)*12; benefit=f.pia*(1-(m<=36?m*5/9/100:(36*5/9+(m-36)*5/12)/100)) }
      else if (age > 67) { benefit=f.pia*(1+(age-67)*12*0.00667) }
      return [['Monthly Benefit', '$'+Math.round(benefit).toLocaleString(), true], ['Annual Benefit', '$'+Math.round(benefit*12).toLocaleString()], ['Lifetime to 90', '$'+Math.round(benefit*12*(90-age)).toLocaleString()]]
    }
  },
  'College Cost': {
    icon: DollarSign, color: C.indigo,
    fields: [
      { key:'currentCost', label:'Current Annual Cost', prefix:'$', def:28000 },
      { key:'inflation', label:'Cost Inflation (%)', suffix:'%', def:5 },
      { key:'yearsUntil', label:'Years Until College', def:10 },
      { key:'savings', label:'Current 529 Balance', prefix:'$', def:5000 },
      { key:'monthly', label:'Monthly Saving', prefix:'$', def:300 },
    ],
    calc: f => {
      const futureCost = f.currentCost*4*Math.pow(1+f.inflation/100, f.yearsUntil)
      const r=0.07/12, n=f.yearsUntil*12
      const projected = f.savings*Math.pow(1+r,n)+f.monthly*((Math.pow(1+r,n)-1)/r)
      return [['4-Year Cost', '$'+Math.round(futureCost).toLocaleString(), true], ['529 Projected', '$'+Math.round(projected).toLocaleString()], ['Funding Gap', '$'+Math.round(Math.max(0,futureCost-projected)).toLocaleString()]]
    }
  },
  'Budget Calculator': {
    icon: DollarSign, color: C.gold,
    fields: [
      { key:'income', label:'Monthly Income', prefix:'$', def:6000 },
      { key:'housing', label:'Housing (50/30/20: 30%)', prefix:'$', def:1800 },
      { key:'needs', label:'Other Needs', prefix:'$', def:1200 },
      { key:'wants', label:'Wants', prefix:'$', def:900 },
    ],
    calc: f => {
      const savings = f.income-f.housing-f.needs-f.wants
      const savingsRate = (savings/f.income*100).toFixed(1)
      return [['Monthly Savings', '$'+Math.round(savings).toLocaleString(), true], ['Savings Rate', savingsRate+'%'], ['Annual Savings', '$'+Math.round(savings*12).toLocaleString()]]
    }
  },
  'Take-Home Pay': {
    icon: Receipt, color: C.gold,
    fields: [
      { key:'salary', label:'Annual Salary', prefix:'$', def:90000 },
      { key:'federal', label:'Federal Tax Rate (%)', suffix:'%', def:22 },
      { key:'state', label:'State Tax Rate (%)', suffix:'%', def:5 },
      { key:'fica', label:'FICA (7.65%)', suffix:'%', def:7.65 },
      { key:'benefits', label:'Monthly Benefits/401k', prefix:'$', def:500 },
    ],
    calc: f => {
      const monthly = f.salary/12
      const tax = monthly*(f.federal+f.state+f.fica)/100
      const takeHome = monthly-tax-f.benefits
      return [['Monthly Take-Home', '$'+Math.round(takeHome).toLocaleString(), true], ['Monthly Tax', '$'+Math.round(tax).toLocaleString()], ['Effective Rate', ((tax/monthly)*100).toFixed(1)+'%']]
    }
  },
  'Present Value': {
    icon: TrendingUp, color: C.teal,
    fields: [
      { key:'future', label:'Future Value', prefix:'$', def:100000 },
      { key:'rate', label:'Discount Rate (%)', suffix:'%', def:7 },
      { key:'years', label:'Years', def:10 },
    ],
    calc: f => {
      const pv = f.future/Math.pow(1+f.rate/100, f.years)
      return [['Present Value', '$'+Math.round(pv).toLocaleString(), true], ['Discount Amount', '$'+Math.round(f.future-pv).toLocaleString()], ['Total Return', ((f.future/pv-1)*100).toFixed(1)+'%']]
    }
  },
  'Future Value': {
    icon: TrendingUp, color: C.gold,
    fields: [
      { key:'present', label:'Present Value', prefix:'$', def:50000 },
      { key:'rate', label:'Annual Return (%)', suffix:'%', def:7 },
      { key:'years', label:'Years', def:10 },
    ],
    calc: f => {
      const fv = f.present*Math.pow(1+f.rate/100, f.years)
      return [['Future Value', '$'+Math.round(fv).toLocaleString(), true], ['Total Growth', '$'+Math.round(fv-f.present).toLocaleString()], ['Growth Multiple', (fv/f.present).toFixed(2)+'x']]
    }
  },
  'Pension Calculator': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'years', label:'Years of Service', def:25 },
      { key:'finalSalary', label:'Final Salary', prefix:'$', def:95000 },
      { key:'multiplier', label:'Benefit Multiplier (%)', suffix:'%', def:2 },
    ],
    calc: f => {
      const annual = f.finalSalary*(f.multiplier/100)*f.years
      return [['Annual Pension', '$'+Math.round(annual).toLocaleString(), true], ['Monthly Pension', '$'+Math.round(annual/12).toLocaleString()], ['Replacement Rate', ((annual/f.finalSalary)*100).toFixed(0)+'%']]
    }
  },
  'APR Calculator': {
    icon: Percent, color: '#3b82f6',
    fields: [
      { key:'loan', label:'Loan Amount', prefix:'$', def:200000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.5 },
      { key:'fees', label:'Total Fees', prefix:'$', def:4000 },
      { key:'years', label:'Loan Term (years)', def:30 },
    ],
    calc: f => {
      const r = f.rate/100/12, n = f.years*12
      const pmt = f.loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
      const netLoan = f.loan-f.fees
      let apr=f.rate/100, step=0.01
      for (let i=0; i<100; i++) {
        const ra=apr/12; const testPmt=netLoan*ra*Math.pow(1+ra,n)/(Math.pow(1+ra,n)-1)
        if (Math.abs(testPmt-pmt)<0.01) break
        apr += testPmt>pmt ? -step : step; step*=0.5
      }
      return [['APR', (apr*100).toFixed(3)+'%', true], ['Monthly Payment', '$'+Math.round(pmt).toLocaleString()], ['Cost of Fees', '$'+Math.round(f.fees).toLocaleString()]]
    }
  },
  'Salary Converter': {
    icon: DollarSign, color: C.gold,
    fields: [
      { key:'amount', label:'Amount', prefix:'$', def:75000 },
      { key:'hours', label:'Hours/Week', def:40 },
    ],
    calc: f => {
      const annual = f.amount, hourly = annual/(52*f.hours)
      const monthly = annual/12, weekly = annual/52
      return [['Annual', '$'+Math.round(annual).toLocaleString(), true], ['Monthly', '$'+Math.round(monthly).toLocaleString()], ['Hourly', '$'+hourly.toFixed(2)]]
    }
  },
  'Simple Interest': {
    icon: Percent, color: C.teal,
    fields: [
      { key:'principal', label:'Principal', prefix:'$', def:10000 },
      { key:'rate', label:'Annual Rate (%)', suffix:'%', def:5 },
      { key:'years', label:'Years', def:5 },
    ],
    calc: f => {
      const interest = f.principal*f.rate/100*f.years
      return [['Total Interest', '$'+Math.round(interest).toLocaleString(), true], ['Final Balance', '$'+Math.round(f.principal+interest).toLocaleString()], ['Annual Interest', '$'+Math.round(interest/f.years).toLocaleString()]]
    }
  },
  'Annuity Calculator': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'payment', label:'Annual Payment', prefix:'$', def:24000 },
      { key:'rate', label:'Discount Rate (%)', suffix:'%', def:6 },
      { key:'years', label:'Years', def:20 },
    ],
    calc: f => {
      const r = f.rate/100
      const pv = f.payment*((1-Math.pow(1+r,-f.years))/r)
      return [['Present Value', '$'+Math.round(pv).toLocaleString(), true], ['Total Payments', '$'+Math.round(f.payment*f.years).toLocaleString()], ['Monthly Payment', '$'+Math.round(f.payment/12).toLocaleString()]]
    }
  },
  'Debt Consolidation': {
    icon: CreditCard, color: C.warning,
    fields: [
      { key:'totalDebt', label:'Total Debt', prefix:'$', def:35000 },
      { key:'avgRate', label:'Average Current APR (%)', suffix:'%', def:18 },
      { key:'newRate', label:'Consolidation Rate (%)', suffix:'%', def:10 },
      { key:'years', label:'Payoff Term (years)', def:5 },
    ],
    calc: f => {
      const r1=f.avgRate/100/12, r2=f.newRate/100/12, n=f.years*12
      const oldPmt=f.totalDebt*r1*Math.pow(1+r1,n)/(Math.pow(1+r1,n)-1)
      const newPmt=f.totalDebt*r2*Math.pow(1+r2,n)/(Math.pow(1+r2,n)-1)
      return [['New Monthly Payment', '$'+Math.round(newPmt).toLocaleString(), true], ['Monthly Savings', '$'+Math.round(oldPmt-newPmt).toLocaleString()], ['Total Interest Saved', '$'+Math.round((oldPmt-newPmt)*n).toLocaleString()]]
    }
  },
  'Payment Calculator': {
    icon: DollarSign, color: C.teal,
    fields: [
      { key:'principal', label:'Amount Borrowed', prefix:'$', def:20000 },
      { key:'rate', label:'Annual Rate (%)', suffix:'%', def:8 },
      { key:'years', label:'Term (years)', def:3 },
    ],
    calc: f => {
      const r=f.rate/100/12, n=f.years*12
      const pmt=r>0?f.principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):f.principal/n
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Paid', '$'+Math.round(pmt*n).toLocaleString()], ['Interest Paid', '$'+Math.round(pmt*n-f.principal).toLocaleString()]]
    }
  },
  'Discount Calculator': {
    icon: Percent, color: C.warning,
    fields: [
      { key:'original', label:'Original Price', prefix:'$', def:200 },
      { key:'discount', label:'Discount (%)', suffix:'%', def:25 },
    ],
    calc: f => {
      const savings=f.original*f.discount/100, final=f.original-savings
      return [['Final Price', '$'+final.toFixed(2), true], ['You Save', '$'+savings.toFixed(2)], ['Discount Amount', '$'+savings.toFixed(2)]]
    }
  },
  'Lease Calculator': {
    icon: Car, color: '#f59e0b',
    fields: [
      { key:'msrp', label:'Vehicle MSRP', prefix:'$', def:45000 },
      { key:'residual', label:'Residual Value (%)', suffix:'%', def:55 },
      { key:'mf', label:'Money Factor', def:0.0019 },
      { key:'months', label:'Lease Term (months)', def:36 },
      { key:'down', label:'Down Payment', prefix:'$', def:3000 },
    ],
    calc: f => {
      const residualAmt=f.msrp*f.residual/100
      const depAmt=(f.msrp-f.down-residualAmt)/f.months
      const finCharge=(f.msrp-f.down+residualAmt)*f.mf
      const monthly=depAmt+finCharge
      return [['Monthly Payment', '$'+monthly.toFixed(0), true], ['Residual Value', '$'+Math.round(residualAmt).toLocaleString()], ['Total Lease Cost', '$'+(Math.round(monthly*f.months)+f.down).toLocaleString()]]
    }
  },
  'FHA Loan': {
    icon: Home, color: '#3b82f6',
    fields: [
      { key:'price', label:'Purchase Price', prefix:'$', def:350000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.5 },
      { key:'years', label:'Loan Term (years)', def:30 },
    ],
    calc: f => {
      const down=f.price*0.035, loan=f.price-down, upfrontMIP=loan*0.0175
      const totalLoan=loan+upfrontMIP, r=f.rate/100/12, n=f.years*12
      const pmt=totalLoan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
      const monthlyMIP=loan*0.0055/12
      return [['Monthly Payment (P&I)', '$'+Math.round(pmt).toLocaleString(), true], ['Monthly MIP', '$'+Math.round(monthlyMIP).toLocaleString()], ['Minimum Down (3.5%)', '$'+Math.round(down).toLocaleString()]]
    }
  },
  'RMD Calculator': {
    icon: Clock, color: C.gold,
    fields: [
      { key:'balance', label:'IRA Balance (Jan 1)', prefix:'$', def:800000 },
      { key:'age', label:'Your Age', def:73 },
    ],
    calc: f => {
      const factors = {73:26.5,74:25.5,75:24.6,76:23.7,77:22.9,78:22.0,79:21.1,80:20.2,81:19.4,82:18.5,83:17.7,84:16.8,85:16.0}
      const factor = factors[Math.min(Math.max(f.age,73),85)] || 16.0
      const rmd = f.balance/factor
      return [['Annual RMD', '$'+Math.round(rmd).toLocaleString(), true], ['Monthly Distribution', '$'+Math.round(rmd/12).toLocaleString()], ['Distribution Period', factor+' years']]
    }
  },
  'Auto Lease': {
    icon: Car, color: '#f59e0b',
    fields: [
      { key:'vehiclePrice', label:'Vehicle Price', prefix:'$', def:38000 },
      { key:'residualPct', label:'Residual (%)', suffix:'%', def:52 },
      { key:'moneyFactor', label:'Money Factor', def:0.0022 },
      { key:'term', label:'Term (months)', def:36 },
    ],
    calc: f => {
      const res=f.vehiclePrice*f.residualPct/100
      const dep=(f.vehiclePrice-res)/f.term
      const fin=(f.vehiclePrice+res)*f.moneyFactor
      const apr=f.moneyFactor*2400
      return [['Monthly Payment', '$'+Math.round(dep+fin).toLocaleString(), true], ['Equivalent APR', apr.toFixed(2)+'%'], ['Total Lease Cost', '$'+Math.round((dep+fin)*f.term).toLocaleString()]]
    }
  },
  'Marriage Tax': {
    icon: Receipt, color: '#a855f7',
    fields: [
      { key:'income1', label:'Spouse 1 Income', prefix:'$', def:90000 },
      { key:'income2', label:'Spouse 2 Income', prefix:'$', def:75000 },
    ],
    calc: f => {
      const calcSingle = (inc) => {
        const brackets = [[0.10,11925],[0.12,48475],[0.22,103350],[0.24,197300],[0.32,250525],[0.35,626350],[0.37,Infinity]]
        const taxable = Math.max(0, inc-14600)
        let tax=0, prev=0
        for (const [r,up] of brackets) { if(taxable<=prev) break; tax+=(Math.min(taxable,up)-prev)*r; prev=up }
        return tax
      }
      const t1=calcSingle(f.income1), t2=calcSingle(f.income2)
      const combined=f.income1+f.income2
      const mfjTaxable=Math.max(0,combined-29200)
      const mfjBrackets=[[0.10,23850],[0.12,96950],[0.22,206700],[0.24,394600],[0.32,501050],[0.35,751600],[0.37,Infinity]]
      let mfjTax=0, prev=0
      for (const [r,up] of mfjBrackets) { if(mfjTaxable<=prev) break; mfjTax+=(Math.min(mfjTaxable,up)-prev)*r; prev=up }
      const penalty = mfjTax-(t1+t2)
      return [['Marriage Penalty/Bonus', (penalty>0?'+':'')+'$'+Math.round(Math.abs(penalty)).toLocaleString()+(penalty>0?' Penalty':' Bonus'), true], ['Filing Separately', '$'+Math.round(t1+t2).toLocaleString()], ['Filing Jointly', '$'+Math.round(mfjTax).toLocaleString()]]
    }
  },
  'Estate Tax': {
    icon: Receipt, color: C.gold,
    fields: [
      { key:'estate', label:'Gross Estate Value', prefix:'$', def:8000000 },
      { key:'debts', label:'Debts & Expenses', prefix:'$', def:500000 },
      { key:'charitable', label:'Charitable Deductions', prefix:'$', def:0 },
    ],
    calc: f => {
      const EXEMPTION = 15000000
      const taxable = Math.max(0, f.estate-f.debts-f.charitable-EXEMPTION)
      const tax = taxable * 0.40
      return [['Estate Tax Owed', '$'+Math.round(tax).toLocaleString(), true], ['Taxable Estate', '$'+Math.round(Math.max(0,f.estate-f.debts-f.charitable)).toLocaleString()], ['After-Tax Estate', '$'+Math.round(f.estate-f.debts-tax).toLocaleString()]]
    }
  },
  'Personal Loan': {
    icon: DollarSign, color: C.teal,
    fields: [
      { key:'amount', label:'Loan Amount', prefix:'$', def:15000 },
      { key:'rate', label:'APR (%)', suffix:'%', def:11.5 },
      { key:'years', label:'Term (years)', def:3 },
    ],
    calc: f => {
      const r=f.rate/100/12, n=f.years*12
      const pmt=f.amount*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
      return [['Monthly Payment', '$'+Math.round(pmt).toLocaleString(), true], ['Total Interest', '$'+Math.round(pmt*n-f.amount).toLocaleString()], ['Total Cost', '$'+Math.round(pmt*n).toLocaleString()]]
    }
  },
  'Annuity Payout': {
    icon: Clock, color: C.teal,
    fields: [
      { key:'balance', label:'Annuity Balance', prefix:'$', def:500000 },
      { key:'rate', label:'Growth Rate (%)', suffix:'%', def:5 },
      { key:'years', label:'Payout Period (years)', def:20 },
    ],
    calc: f => {
      const r=f.rate/100/12, n=f.years*12
      const pmt=f.balance*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1)
      return [['Monthly Payout', '$'+Math.round(pmt).toLocaleString(), true], ['Annual Payout', '$'+Math.round(pmt*12).toLocaleString()], ['Total Distributed', '$'+Math.round(pmt*n).toLocaleString()]]
    }
  },
  'Mortgage Payoff': {
    icon: Home, color: '#3b82f6',
    fields: [
      { key:'balance', label:'Remaining Balance', prefix:'$', def:280000 },
      { key:'rate', label:'Interest Rate (%)', suffix:'%', def:6.82 },
      { key:'payment', label:'Current Payment', prefix:'$', def:1850 },
      { key:'extra', label:'Extra Monthly Payment', prefix:'$', def:200 },
    ],
    calc: f => {
      const r=f.rate/100/12
      let bal=f.balance, m1=0; while(bal>0&&m1<600){const i=bal*r;bal+=i-f.payment;m1++}
      let bal2=f.balance, m2=0; while(bal2>0&&m2<600){const i=bal2*r;bal2+=i-(f.payment+f.extra);m2++}
      const saved=(f.payment*m1)-(f.payment+f.extra)*m2
      return [['Time Saved', `${Math.floor((m1-m2)/12)}y ${(m1-m2)%12}m`, true], ['Interest Saved', '$'+Math.round(Math.max(0,saved)).toLocaleString()], ['New Payoff', `${Math.floor(m2/12)}y ${m2%12}m`]]
    }
  },
  'Credit Card Calc.': {
    icon: CreditCard, color: C.down,
    fields: [
      { key:'balance', label:'Balance', prefix:'$', def:5000 },
      { key:'apr', label:'APR (%)', suffix:'%', def:22.99 },
      { key:'minPct', label:'Min Payment (%)', suffix:'%', def:2 },
    ],
    calc: f => {
      const r=f.apr/100/12; let bal=f.balance, months=0, totalInt=0
      while(bal>10&&months<600){
        const int=bal*r; totalInt+=int
        const pmt=Math.max(25,bal*f.minPct/100); bal=bal+int-pmt; months++
      }
      return [['Months (Min Only)', months>=600?'30+ years':months+' months', true], ['Total Interest', '$'+Math.round(totalInt).toLocaleString()], ['Total Paid', '$'+Math.round(f.balance+totalInt).toLocaleString()]]
    }
  },
}

const CATEGORIES = {
  'Featured': ['Compound Interest','Mortgage Payment','Retirement Savings','Loan Payment','Debt Payoff','Tax Savings'],
  'Mortgage & Real Estate': ['Mortgage Payment','Amortization','Refinance','Down Payment','HELOC','FHA Loan','Mortgage Payoff','APR Calculator'],
  'Auto': ['Auto Loan','Auto Lease','Lease Calculator'],
  'Investment': ['Compound Interest','Savings Calculator','CD Calculator','ROI Calculator','Present Value','Future Value','Simple Interest'],
  'Retirement': ['401(k) Calculator','Roth IRA','IRA Calculator','Pension Calculator','Annuity Calculator','Social Security Est.','RMD Calculator','Annuity Payout'],
  'Tax & Salary': ['Income Tax','Salary Converter','Take-Home Pay','Estate Tax','Marriage Tax'],
  'Debt & Credit': ['Debt Payoff','Credit Card Payoff','Credit Card Calc.','Debt Consolidation','Student Loan','Personal Loan'],
  'Other': ['Inflation Calculator','College Cost','Budget Calculator','Payment Calculator','Discount Calculator'],
}

function CalcDetail({ name, onBack }) {
  const def = CALCS[name]
  if (!def) return null

  const initVals = {}
  def.fields.forEach(f => { initVals[f.key] = f.def || 0 })

  const [vals, setVals] = useState(initVals)
  const set = (k, v) => setVals(prev => ({ ...prev, [k]: parseFloat(v) || 0 }))

  let results = []
  try { results = def.calc(vals) } catch {}

  const { icon: Icon, color } = def

  return (
    <div style={{ padding:'12px 16px 0' }}>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:C.t2, fontFamily:UI, fontSize:13, marginBottom:16 }}>
        <ChevronLeft size={16} /> All Calculators
      </button>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <span style={{ width:40, height:40, borderRadius:12, background:color+'18', border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={18} color={color} />
        </span>
        <div style={{ fontFamily:DISPLAY, fontSize:20, fontWeight:700, color:C.t1 }}>{name}</div>
      </div>

      {results.length > 0 && (
        <MCard style={{ marginBottom:14 }}>
          {results.map(([l, v, hi]) => <MResultRow key={l} label={l} value={v} highlight={hi} accent={color} mono />)}
        </MCard>
      )}

      <MCard>
        {def.fields.map(f => (
          <div key={f.key} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontFamily:UI, fontSize:12, color:C.t2, fontWeight:600 }}>{f.label}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', background:C.bg, border:`1px solid ${C.b2}`, borderRadius:8, padding:'0 10px' }}>
              {f.prefix && <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginRight:4 }}>{f.prefix}</span>}
              <input
                type="number"
                value={vals[f.key]}
                step={f.key.includes('mf')||f.key.includes('moneyFactor') ? 0.0001 : undefined}
                onChange={e => set(f.key, e.target.value)}
                style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:MONO, fontSize:16, color, padding:'11px 0' }}
              />
              {f.suffix && <span style={{ fontFamily:MONO, fontSize:14, color:C.t3, marginLeft:4 }}>{f.suffix}</span>}
            </div>
          </div>
        ))}
      </MCard>
    </div>
  )
}

export default function MCalculators() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [activeCategory, setActiveCategory] = useState('Featured')

  if (selected) {
    return (
      <div style={{ background:C.bg, minHeight:'100dvh' }}>
        <ScreenHeader title={selected} subtitle="Calculators" accent={C.gold} />
        <CalcDetail name={selected} onBack={() => setSelected(null)} />
        <div style={{ height:24 }} />
      </div>
    )
  }

  const calcNames = search
    ? Object.keys(CALCS).filter(n => n.toLowerCase().includes(search.toLowerCase()))
    : (CATEGORIES[activeCategory] || [])

  return (
    <div style={{ background:C.bg, minHeight:'100dvh' }}>
      <ScreenHeader title="Calculators" subtitle="35+ Financial Tools" accent={C.gold} />

      {/* Search */}
      <div style={{ padding:'12px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:C.surf, border:`1px solid ${C.b2}`, borderRadius:12, padding:'10px 14px' }}>
          <Search size={16} color={C.t3} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calculators..."
            style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:UI, fontSize:14, color:C.t1 }} />
        </div>
      </div>

      {/* Category pills */}
      {!search && (
        <div style={{ display:'flex', gap:8, padding:'10px 16px 0', overflowX:'auto', scrollbarWidth:'none' }}>
          {Object.keys(CATEGORIES).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding:'7px 14px', borderRadius:20, cursor:'pointer', flexShrink:0,
              border:`1px solid ${activeCategory===cat ? C.gold : C.b2}`,
              background: activeCategory===cat ? C.goldDim : 'transparent',
              color: activeCategory===cat ? C.gold : C.t3,
              fontFamily:UI, fontSize:12, fontWeight:600,
            }}>{cat}</button>
          ))}
        </div>
      )}

      {/* Calculator grid */}
      <div style={{ padding:'10px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {calcNames.filter(n => CALCS[n]).map(name => {
          const { icon: Icon, color } = CALCS[name]
          return (
            <button key={name} onClick={() => setSelected(name)} style={{
              background:C.surf, border:`1px solid ${C.b2}`, borderRadius:14,
              padding:'14px', cursor:'pointer', textAlign:'left',
            }}>
              <span style={{ width:32, height:32, borderRadius:8, background:color+'18', border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8 }}>
                <Icon size={14} color={color} />
              </span>
              <div style={{ fontFamily:UI, fontSize:13, fontWeight:600, color:C.t1, lineHeight:1.3 }}>{name}</div>
            </button>
          )
        })}
      </div>
      <div style={{ height:24 }} />
    </div>
  )
}
