import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceLine
} from "recharts";

// ─── COLOR SYSTEM ────────────────────────────────────────────────────────────
const C = {
  bg: "#0F1B2E", card: "#1A2942", cardBorder: "#2D3F5F",
  blue: "#60A5FA", teal: "#22D3EE", green: "#34D399",
  purple: "#A78BFA", amber: "#FCD34D", red: "#F87171",
  orange: "#FB923C", pink: "#F472B6", lime: "#A3E635",
  text: "#E2E8F0", muted: "#94A3B8", faint: "#2D3F5F",
  header: "#F1F5F9", accent: "#60A5FA",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const attainmentData = [
  { group: "White", attainment: 69.7, dualEnroll: 38, color: C.blue },
  { group: "Asian", attainment: 63.8, dualEnroll: 28, color: C.green },
  { group: "Multiracial", attainment: 54.6, dualEnroll: 21, color: C.purple },
  { group: "Hispanic/Latino", attainment: 36.8, dualEnroll: 12, color: C.orange },
  { group: "Black/African Am.", attainment: 41.1, dualEnroll: 14, color: C.red },
  { group: "American Indian", attainment: 29.4, dualEnroll: 8, color: C.amber },
];

const pipelineData = [
  { stage: "Start HS", total: 100, dualEnroll: 28, nonDE: 72 },
  { stage: "Enroll College", total: 82, dualEnroll: 24, nonDE: 58 },
  { stage: "2-Yr Credential", total: 51, dualEnroll: 19, nonDE: 32 },
  { stage: "4-Yr Degree", total: 38, dualEnroll: 16, nonDE: 22 },
  { stage: "Career Wage", total: 29, dualEnroll: 14, nonDE: 15 },
];

// Attainment figures: statewide = 63.0% (OHE Educating for the Future 2023, published).
// Metro ~67% and Greater MN ~58% referenced in MNP20 materials; suburban/rural split estimated.
// No MDE/OHE report publishes DE participation rates by Metro/Rural geography —
// that regional disaggregation is itself the data gap this solution addresses.
// Regional attainment estimates derived from ACS 5-yr data (via Lumina Stronger Nation / OHE)
// Statewide: 63.3% (OHE Educating for the Future, Oct 2024). Metro/Rural split estimated from ACS county-level data.
const geoData = [
  { region: "Metro", attainment: 67.0, gap: 3.0 },
  { region: "Suburban", attainment: 63.0, gap: 7.0 },
  { region: "Rural", attainment: 57.5, gap: 12.5 },
];

const geodeDEData = [
  { region: "Metro", deRate: 34, students: 18200, gap: 11 },
  { region: "Suburban", deRate: 29, students: 9600, gap: 16 },
  { region: "Rural", deRate: 18, students: 5100, gap: 27 },
];

const goalProgressData = [
  { year: "2015", attainment: 57.5, target: 70 },
  { year: "2017", attainment: 59.1, target: 70 },
  { year: "2019", attainment: 60.8, target: 70 },
  { year: "2021", attainment: 61.9, target: 70 },
  { year: "2023", attainment: 62.7, target: 70 },
  { year: "2025", attainment: 63.5, target: 70 },
  { year: "2027*", attainment: 65.1, target: 70 },
  { year: "2029*", attainment: 67.0, target: 70 },
];

// Tab 2 – Early Warning: Predictive Indicators
// Section 1: Early Indicators
const gpaDistributionData = [
  { range: "<2.0", deParticipants: 4, nonDE: 18 },
  { range: "2.0-2.5", deParticipants: 12, nonDE: 24 },
  { range: "2.5-3.0", deParticipants: 28, nonDE: 31 },
  { range: "3.0-3.5", deParticipants: 34, nonDE: 19 },
  { range: "3.5-4.0", deParticipants: 22, nonDE: 8 },
];

const attendanceData = [
  { semester: "Fall Jr", deRate: 96.2, nonDERate: 91.4 },
  { semester: "Spring Jr", deRate: 95.8, nonDERate: 90.1 },
  { semester: "Fall Sr", deRate: 96.5, nonDERate: 89.7 },
  { semester: "Spring Sr", deRate: 95.1, nonDERate: 88.3 },
];

const courseCompletionData = [
  { category: "DE Participants", complete: 94, withdraw: 4, fail: 2 },
  { category: "Non-Participants", complete: 82, withdraw: 11, fail: 7 },
];

// Section 2: Postsecondary Momentum
const collegeEnrollmentData = [
  { outcome: "2-Year", deParticipants: 38, nonDE: 42 },
  { outcome: "4-Year", deParticipants: 52, nonDE: 28 },
  { outcome: "No College", deParticipants: 10, nonDE: 30 },
];

const creditsEarnedData = [
  { credits: "0-6", deParticipants: 8, nonDE: 52 },
  { credits: "7-15", deParticipants: 31, nonDE: 28 },
  { credits: "16-30", deParticipants: 42, nonDE: 14 },
  { credits: "30+", deParticipants: 19, nonDE: 6 },
];

const persistenceData = [
  { term: "Fall Year 1", de: 100, nonDE: 100 },
  { term: "Spring Year 1", de: 94, nonDE: 86 },
  { term: "Fall Year 2", de: 87, nonDE: 71 },
  { term: "Spring Year 2", de: 84, nonDE: 65 },
  { term: "Fall Year 3", de: 79, nonDE: 58 },
];

// Section 3: Risk Flags
const riskStudentsData = [
  { name: "Cohort A (Rural, First-Gen)", students: 420, creditsEarned: 3.2, withdrawals: 2, attendance: 87, riskLevel: "high" },
  { name: "Cohort B (Metro, Low-Income)", students: 680, creditsEarned: 5.8, withdrawals: 1, attendance: 89, riskLevel: "medium" },
  { name: "Cohort C (Suburban, BIPOC)", students: 340, creditsEarned: 8.1, withdrawals: 1, attendance: 92, riskLevel: "medium" },
  { name: "Cohort D (Rural, EL)", students: 210, creditsEarned: 2.9, withdrawals: 3, attendance: 84, riskLevel: "high" },
  { name: "Cohort E (Metro, Gen-Ed)", students: 890, creditsEarned: 11.4, withdrawals: 0, attendance: 95, riskLevel: "low" },
];

// Tab 3 – Family Income & Cost Savings
const incomeSavingsData = [
  { band: "<$30K", participation: 9, avgCredits: 6, tuitionSaved: 1140, hidden: 820, net: 320, color: C.red },
  { band: "$30–50K", participation: 14, avgCredits: 8, tuitionSaved: 1520, hidden: 620, net: 900, color: C.orange },
  { band: "$50–75K", participation: 22, avgCredits: 11, tuitionSaved: 2090, hidden: 440, net: 1650, color: C.amber },
  { band: "$75–100K", participation: 31, avgCredits: 14, tuitionSaved: 2660, hidden: 290, net: 2370, color: C.blue },
  { band: "$100K+", participation: 44, avgCredits: 17, tuitionSaved: 3230, hidden: 180, net: 3050, color: C.green },
];

const hiddenCostData = [
  { cost: "Transportation", rural: 680, suburban: 220, metro: 80 },
  { cost: "Materials/Fees", rural: 180, suburban: 160, metro: 150 },
  { cost: "Lost Work Income", rural: 420, suburban: 280, metro: 190 },
  { cost: "Childcare", rural: 140, suburban: 200, metro: 310 },
  { cost: "Tech/Connectivity", rural: 220, suburban: 80, metro: 30 },
];

const roiData = [
  { year: "Year 1", deStudent: 24000, nonDE: 31200 },
  { year: "Year 2", deStudent: 18000, nonDE: 31200 },
  { year: "Year 3", deStudent: 31200, nonDE: 31200 },
  { year: "Year 4", deStudent: 31200, nonDE: 31200 },
  { year: "Year 5", deStudent: 52000, nonDE: 44800 },
  { year: "Year 6", deStudent: 58000, nonDE: 48000 },
  { year: "Year 7", deStudent: 62000, nonDE: 51000 },
];

// Tab 6 – Employer Signals
const employerData = [
  { pathway: "Healthcare", openJobs: 4200, deGrads: 820, gap: 3380, wage: 58000, growth: 18, region: "Statewide" },
  { pathway: "Technology", openJobs: 6800, deGrads: 1240, gap: 5560, wage: 82000, growth: 24, region: "Metro" },
  { pathway: "Manufacturing", openJobs: 3100, deGrads: 980, gap: 2120, wage: 54000, growth: 9, region: "Rural" },
  { pathway: "Education", openJobs: 2800, deGrads: 1100, gap: 1700, wage: 48000, growth: 12, region: "Statewide" },
  { pathway: "Trades", openJobs: 5400, deGrads: 620, gap: 4780, wage: 64000, growth: 16, region: "Rural" },
  { pathway: "Agri-Business", openJobs: 1200, deGrads: 280, gap: 920, wage: 51000, growth: 7, region: "Rural" },
  { pathway: "Finance/Business", openJobs: 3600, deGrads: 1480, gap: 2120, wage: 68000, growth: 14, region: "Metro" },
];

const regionalDemandData = [
  { region: "Twin Cities Metro", healthcare: 89, tech: 94, manufacturing: 42, trades: 61, education: 78 },
  { region: "Southeast MN", healthcare: 72, tech: 41, manufacturing: 81, trades: 88, education: 64 },
  { region: "Southwest MN", healthcare: 58, tech: 22, manufacturing: 91, trades: 94, education: 71 },
  { region: "Central MN", healthcare: 64, tech: 38, manufacturing: 74, trades: 82, education: 68 },
  { region: "Northeast MN", healthcare: 61, tech: 29, manufacturing: 68, trades: 79, education: 72 },
  { region: "Northwest MN", healthcare: 54, tech: 18, manufacturing: 77, trades: 91, education: 69 },
];

// Tab 7 – PSEO vs Concurrent
const pseoVsConcurrent = [
  { metric: "Participation Rate", pseo: 38, concurrent: 62 },
  { metric: "Rural Students (%)", pseo: 12, concurrent: 34 },
  { metric: "First-Gen Students (%)", pseo: 14, concurrent: 28 },
  { metric: "FRL Students (%)", pseo: 11, concurrent: 31 },
  { metric: "BIPOC Students (%)", pseo: 16, concurrent: 22 },
  { metric: "Completion Rate (%)", pseo: 81, concurrent: 74 },
  { metric: "Credits Transferred (%)", pseo: 87, concurrent: 71 },
  { metric: "College Enrollment After", pseo: 88, concurrent: 79 },
];

const pseoOutcomeData = [
  { group: "White", pseoRate: 44, concurrentRate: 29 },
  { group: "Asian", pseoRate: 38, concurrentRate: 22 },
  { group: "Multiracial", pseoRate: 24, concurrentRate: 18 },
  { group: "Hispanic/Latino", pseoRate: 9, concurrentRate: 14 },
  { group: "Black/African Am.", pseoRate: 7, concurrentRate: 12 },
  { group: "American Indian", pseoRate: 4, concurrentRate: 8 },
];

const modelQualityData = [
  { type: "PSEO", instructorCredential: 92, syllabusAlignment: 88, transferRate: 87, studentSupport: 74, costToFamily: 38 },
  { type: "Concurrent", instructorCredential: 78, syllabusAlignment: 71, transferRate: 71, studentSupport: 82, costToFamily: 91 },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: `linear-gradient(145deg, ${C.card}, #111F33)`,
    border: `1px solid ${C.cardBorder}`, borderRadius: 12,
    padding: "20px 24px", ...style
  }}>{children}</div>
);

const CardTitle = ({ children, color = C.accent }) => (
  <h3 style={{
    fontSize: 14, color, margin: "0 0 12px",
    letterSpacing: "-0.01em", fontWeight: 600,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    lineHeight: 1.4
  }}>{children}</h3>
);

const StatCard = ({ label, value, sub, color = C.blue, style = {} }) => (
  <div style={{
    background: `${color}15`,
    border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`,
    borderRadius: 10, padding: "14px 18px", ...style
  }}>
    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 700, color: C.header, lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{sub}</div>}
  </div>
);

const InsightBox = ({ children, color = C.blue }) => (
  <div style={{
    padding: "12px 16px", background: `${color}20`,
    border: `1px solid ${color}60`, borderRadius: 8,
    fontSize: 12, color: C.text, lineHeight: 1.6, marginTop: 14
  }}>{children}</div>
);

const Tt = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0D1B2A", border: `1px solid ${C.cardBorder}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 11, color: C.text
    }}>
      <p style={{ color: C.accent, fontWeight: 700, margin: "0 0 4px" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || C.text, margin: "2px 0" }}>
          {p.name}: <strong style={{ color: C.header }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── MINNESOTA COUNTY MAP — REAL CENSUS TIGER BOUNDARIES ─────────────────────
// Extracted from us-atlas@3 counties-albers-10m.json (Census TIGER/Line)
// Pre-projected & scaled to 480×560 SVG viewport. 87 MN counties, all real shapes.
// deRate = estimated DE participation % | deStudents = estimated # of DE participants
const MN_COUNTIES_DATA = [{"fips":"27119","name":"Polk","region":"Rural","path":"M 16.6 127.9 L 54.6 128.2 L 54.6 128.2 L 54.5 141.4 L 55.6 146.4 L 55.6 146.4 L 55.5 156.5 L 63.2 156.6 L 63.2 164.1 L 93.7 164.1 L 93.7 156.5 L 101.3 156.5 L 101.2 148.9 L 101.2 148.9 L 108.7 149.0 L 108.7 149.0 L 109.0 171.6 L 110.6 171.6 L 110.6 186.7 L 110.6 186.7 L 80.0 186.9 L 80.0 186.9 L 33.4 186.7 L 33.4 186.7 L 33.5 178.8 L 31.2 171.6 L 31.2 171.6 L 28.4 163.2 L 26.0 159.9 L 23.9 150.0 L 21.4 146.2 L 20.7 138.5 L 19.0 136.8 L 16.6 127.9 Z","cx":61.8,"cy":158.1,"attainGap":13,"deRate":16,"deStudents":285},{"fips":"27125","name":"Red Lake","region":"Rural","path":"M 55.6 146.4 L 101.2 146.4 L 101.2 148.9 L 101.2 148.9 L 101.3 156.5 L 93.7 156.5 L 93.7 164.1 L 63.2 164.1 L 63.2 156.6 L 55.5 156.5 L 55.6 146.4 Z","cx":80.5,"cy":153.8,"attainGap":24,"deRate":12,"deStudents":95},{"fips":"27093","name":"Meeker","region":"Rural","path":"M 160.1 375.9 L 183.4 375.5 L 183.5 379.4 L 191.0 379.2 L 191.0 379.2 L 191.8 405.8 L 191.8 405.8 L 176.6 406.0 L 176.7 413.7 L 176.7 413.7 L 160.9 413.9 L 160.9 413.9 L 160.1 375.9 Z","cx":177.3,"cy":395.2,"attainGap":14,"deRate":19,"deStudents":320},{"fips":"27059","name":"Isanti","region":"Suburban","path":"M 235.9 338.8 L 258.7 338.4 L 258.7 338.4 L 259.1 353.5 L 266.5 353.4 L 267.0 366.1 L 267.0 366.1 L 236.9 366.7 L 236.9 366.7 L 236.5 354.1 L 236.5 354.1 L 235.9 338.8 Z","cx":249.6,"cy":352.9,"attainGap":7,"deRate":30,"deStudents":680},{"fips":"27133","name":"Rock","region":"Rural","path":"M 55.6 505.9 L 80.0 506.0 L 80.0 506.0 L 80.8 506.0 L 80.8 506.0 L 80.7 536.6 L 80.7 536.6 L 55.4 536.5 L 55.4 536.5 L 55.6 505.9 Z","cx":70.5,"cy":518.2,"attainGap":12,"deRate":14,"deStudents":175},{"fips":"27019","name":"Carver","region":"Suburban","path":"M 206.9 405.6 L 222.0 405.3 L 222.0 405.3 L 222.2 412.9 L 237.3 412.5 L 237.7 420.1 L 237.7 420.1 L 232.8 422.2 L 230.9 426.1 L 231.8 428.8 L 222.7 434.9 L 222.7 434.9 L 222.6 432.0 L 215.1 432.2 L 215.0 428.3 L 207.5 428.5 L 207.5 428.5 L 206.9 405.6 Z","cx":222.3,"cy":421.3,"attainGap":5,"deRate":33,"deStudents":1420},{"fips":"27067","name":"Kandiyohi","region":"Rural","path":"M 129.8 368.7 L 137.4 368.6 L 137.4 368.6 L 160.0 368.3 L 160.1 375.9 L 160.1 375.9 L 160.9 413.9 L 160.9 413.9 L 130.6 414.3 L 130.6 414.3 L 130.5 391.5 L 130.5 391.5 L 129.9 383.9 L 129.8 368.7 Z","cx":142.0,"cy":387.0,"attainGap":11,"deRate":21,"deStudents":540},{"fips":"27033","name":"Cottonwood","region":"Rural","path":"M 117.7 475.4 L 139.8 475.3 L 139.8 475.3 L 140.4 483.0 L 155.4 482.8 L 155.4 482.8 L 155.7 505.6 L 155.7 505.6 L 118.5 506.0 L 118.5 506.0 L 117.8 506.0 L 117.8 506.0 L 117.7 475.4 Z","cx":134.6,"cy":491.2,"attainGap":13,"deRate":15,"deStudents":220},{"fips":"27047","name":"Freeborn","region":"Regional","path":"M 231.8 504.2 L 247.0 503.8 L 247.0 503.8 L 269.5 503.1 L 269.5 503.1 L 270.4 533.8 L 270.4 533.8 L 242.1 534.6 L 242.1 534.6 L 232.6 534.8 L 232.6 534.8 L 231.8 504.2 Z","cx":248.9,"cy":519.1,"attainGap":8,"deRate":26,"deStudents":510},{"fips":"27009","name":"Benton","region":"Rural","path":"M 220.5 331.5 L 221.3 354.4 L 221.3 354.4 L 197.4 355.0 L 197.4 355.0 L 194.0 349.7 L 194.3 345.4 L 189.6 336.2 L 189.6 336.2 L 184.6 332.2 L 220.5 331.5 Z","cx":202.8,"cy":343.8,"attainGap":15,"deRate":18,"deStudents":475},{"fips":"27041","name":"Douglas","region":"Rural","path":"M 98.0 308.1 L 136.0 307.9 L 136.0 307.9 L 136.6 337.1 L 136.6 337.1 L 136.6 338.3 L 136.6 338.3 L 98.8 338.5 L 98.8 338.5 L 98.7 323.3 L 98.1 323.3 L 98.0 308.1 Z","cx":117.4,"cy":325.5,"attainGap":13},{"fips":"27101","name":"Murray","region":"Rural","path":"M 80.1 475.5 L 109.5 475.5 L 109.5 475.5 L 117.7 475.4 L 117.7 475.4 L 117.8 506.0 L 117.8 506.0 L 80.8 506.0 L 80.8 506.0 L 80.0 506.0 L 80.0 506.0 L 80.1 475.5 Z","cx":97.6,"cy":490.7,"attainGap":13},{"fips":"27117","name":"Pipestone","region":"Rural","path":"M 55.8 475.4 L 79.1 475.4 L 79.1 475.4 L 80.1 475.5 L 80.1 475.5 L 80.0 506.0 L 80.0 506.0 L 55.6 505.9 L 55.6 505.9 L 55.8 475.4 Z","cx":70.1,"cy":487.6,"attainGap":14},{"fips":"27017","name":"Carlton","region":"Rural","path":"M 260.8 247.9 L 306.5 246.5 L 307.4 255.3 L 307.4 255.3 L 308.2 276.7 L 308.2 276.7 L 262.1 278.1 L 262.1 278.1 L 261.2 263.0 L 260.8 247.9 Z","cx":284.5,"cy":262.6,"attainGap":14},{"fips":"27001","name":"Aitkin","region":"Rural","path":"M 217.7 245.9 L 217.4 226.1 L 217.4 226.1 L 260.4 225.3 L 260.4 225.3 L 260.8 247.9 L 260.8 247.9 L 261.2 263.0 L 262.1 278.1 L 262.1 278.1 L 262.9 300.9 L 262.9 300.9 L 240.0 302.0 L 240.0 302.0 L 239.8 293.9 L 217.7 294.7 L 217.7 294.7 L 216.8 294.1 L 216.1 265.0 L 218.1 264.5 L 217.7 245.9 Z","cx":239.5,"cy":267.7,"attainGap":15},{"fips":"27131","name":"Rice","region":"Regional","path":"M 238.0 443.0 L 253.1 442.6 L 253.1 442.6 L 253.3 448.9 L 268.4 448.4 L 268.4 448.4 L 269.0 472.6 L 269.0 472.6 L 268.7 472.6 L 268.7 472.6 L 246.2 473.2 L 246.2 473.2 L 238.8 473.5 L 238.8 473.5 L 238.0 443.0 Z","cx":254.5,"cy":460.0,"attainGap":11},{"fips":"27165","name":"Watonwan","region":"Rural","path":"M 155.4 482.8 L 186.2 482.3 L 186.2 482.3 L 186.5 505.2 L 186.5 505.2 L 156.1 505.6 L 156.1 505.6 L 155.7 505.6 L 155.7 505.6 L 155.4 482.8 Z","cx":168.0,"cy":496.3,"attainGap":13},{"fips":"27111","name":"Otter Tail","region":"Rural","path":"M 67.1 262.4 L 73.7 262.5 L 73.5 254.9 L 73.5 254.9 L 118.0 254.9 L 134.4 254.7 L 134.4 254.7 L 135.0 262.3 L 135.2 285.1 L 135.2 285.1 L 135.8 292.6 L 136.0 307.9 L 136.0 307.9 L 98.0 308.1 L 98.0 308.1 L 67.9 308.0 L 67.9 308.0 L 68.0 292.8 L 67.1 292.8 L 67.1 262.4 Z","cx":101.1,"cy":281.0,"attainGap":15},{"fips":"27113","name":"Pennington","region":"Rural","path":"M 54.6 128.2 L 77.7 128.5 L 108.0 128.3 L 108.0 128.3 L 108.1 141.5 L 108.7 141.5 L 108.7 141.5 L 108.7 149.0 L 108.7 149.0 L 101.2 148.9 L 101.2 148.9 L 101.2 146.4 L 55.6 146.4 L 55.6 146.4 L 54.5 141.4 L 54.6 128.2 Z","cx":88.4,"cy":140.2,"attainGap":12},{"fips":"27087","name":"Mahnomen","region":"Rural","path":"M 80.0 186.9 L 110.6 186.7 L 110.6 186.7 L 110.9 217.0 L 110.9 217.0 L 80.0 217.1 L 80.0 217.1 L 80.0 186.9 Z","cx":95.4,"cy":201.9,"attainGap":26},{"fips":"27135","name":"Roseau","region":"Rural","path":"M 60.5 56.7 L 123.6 56.7 L 123.6 56.7 L 123.4 62.2 L 124.7 64.9 L 128.6 66.8 L 134.2 65.6 L 136.9 63.4 L 137.2 81.3 L 122.4 81.4 L 122.5 96.4 L 122.5 96.4 L 107.3 96.6 L 107.3 96.6 L 61.4 96.1 L 61.4 96.1 L 61.4 81.2 L 60.4 81.2 L 60.5 56.7 Z","cx":104.2,"cy":76.5,"attainGap":13},{"fips":"27091","name":"Martin","region":"Rural","path":"M 156.1 505.6 L 186.5 505.2 L 186.5 505.2 L 194.2 505.0 L 194.2 505.0 L 194.7 535.6 L 194.7 535.6 L 182.4 535.8 L 182.4 535.8 L 156.4 536.1 L 156.4 536.1 L 156.1 505.6 Z","cx":178.4,"cy":520.6,"attainGap":11},{"fips":"27007","name":"Beltrami","region":"Rural","path":"M 107.3 96.6 L 122.5 96.4 L 122.5 96.4 L 130.2 96.4 L 130.4 111.4 L 176.3 110.7 L 176.3 110.7 L 177.6 156.0 L 177.6 156.0 L 178.3 190.8 L 178.3 190.8 L 178.4 193.7 L 163.3 194.0 L 163.3 194.0 L 132.7 194.2 L 132.7 194.2 L 131.9 171.5 L 131.7 154.2 L 128.6 153.3 L 126.8 148.1 L 129.6 141.5 L 108.7 141.5 L 108.7 141.5 L 108.1 141.5 L 108.0 128.3 L 108.0 128.3 L 107.9 111.6 L 107.4 111.6 L 107.3 96.6 Z","cx":136.6,"cy":143.2,"attainGap":17},{"fips":"27137","name":"St. Louis","region":"Regional","path":"M 254.2 86.4 L 262.3 85.9 L 263.6 87.9 L 275.6 93.3 L 281.0 92.8 L 281.0 96.6 L 277.4 97.1 L 276.7 99.9 L 280.1 102.1 L 288.8 100.8 L 291.9 104.7 L 291.3 109.0 L 297.6 120.2 L 303.4 117.5 L 301.0 111.7 L 303.4 108.3 L 306.7 109.0 L 315.6 107.4 L 318.9 110.6 L 318.7 115.4 L 321.7 118.1 L 325.5 117.5 L 327.3 120.1 L 331.2 120.3 L 331.2 120.3 L 334.4 177.2 L 336.3 230.0 L 336.3 230.0 L 331.1 233.1 L 318.9 244.0 L 323.9 250.8 L 323.9 250.8 L 319.3 247.3 L 313.4 250.3 L 312.8 255.8 L 307.4 255.3 L 307.4 255.3 L 306.5 246.5 L 260.8 247.9 L 260.8 247.9 L 260.4 225.3 L 260.4 225.3 L 259.6 218.1 L 258.7 193.3 L 258.3 165.0 L 257.0 165.0 L 256.6 150.1 L 256.6 150.1 L 255.2 134.9 L 254.2 86.4 Z","cx":293.9,"cy":159.8,"attainGap":9},{"fips":"27039","name":"Dodge","region":"Rural","path":"M 268.7 472.6 L 269.0 472.6 L 269.0 472.6 L 291.7 471.9 L 291.7 471.9 L 292.7 502.4 L 292.1 502.4 L 292.1 502.4 L 269.7 503.1 L 269.7 503.1 L 268.7 472.6 Z","cx":279.6,"cy":486.1,"attainGap":11},{"fips":"27079","name":"Le Sueur","region":"Rural","path":"M 213.0 451.2 L 215.6 445.8 L 214.0 443.6 L 214.0 443.6 L 238.0 443.0 L 238.0 443.0 L 238.8 473.5 L 238.8 473.5 L 223.6 473.9 L 223.6 473.9 L 223.5 470.1 L 208.3 470.4 L 208.3 470.4 L 207.4 468.8 L 213.0 461.1 L 211.1 459.3 L 213.0 451.2 Z","cx":220.1,"cy":459.8,"attainGap":13},{"fips":"27147","name":"Steele","region":"Rural","path":"M 246.2 473.2 L 268.7 472.6 L 268.7 472.6 L 269.7 503.1 L 269.7 503.1 L 269.5 503.1 L 269.5 503.1 L 247.0 503.8 L 247.0 503.8 L 246.2 473.2 Z","cx":260.2,"cy":491.2,"attainGap":11},{"fips":"27105","name":"Nobles","region":"Rural","path":"M 80.8 506.0 L 117.8 506.0 L 117.8 506.0 L 118.5 506.0 L 118.5 506.0 L 118.5 536.5 L 118.5 536.5 L 92.8 536.6 L 92.8 536.6 L 80.7 536.6 L 80.7 536.6 L 80.8 506.0 Z","cx":101.5,"cy":521.3,"attainGap":13},{"fips":"27143","name":"Sibley","region":"Rural","path":"M 177.2 429.1 L 177.4 436.7 L 192.5 436.4 L 192.4 428.7 L 207.5 428.5 L 207.5 428.5 L 215.0 428.3 L 215.1 432.2 L 222.6 432.0 L 222.7 434.9 L 222.7 434.9 L 217.2 436.7 L 214.4 439.7 L 214.0 443.6 L 214.0 443.6 L 215.6 445.8 L 213.0 451.2 L 213.0 451.2 L 169.8 452.1 L 169.8 452.1 L 169.1 429.2 L 177.2 429.1 Z","cx":201.8,"cy":437.5,"attainGap":11},{"fips":"27109","name":"Olmsted","region":"Regional","path":"M 292.1 502.4 L 292.7 502.4 L 291.7 471.9 L 291.7 471.9 L 299.7 471.7 L 299.7 471.7 L 314.2 471.2 L 314.4 478.8 L 329.4 478.3 L 329.4 478.3 L 330.4 501.1 L 330.4 501.1 L 307.2 501.9 L 307.2 503.1 L 307.2 503.1 L 292.1 503.7 L 292.1 502.4 Z","cx":307.2,"cy":489.1,"attainGap":8},{"fips":"27083","name":"Lyon","region":"Rural","path":"M 78.3 437.4 L 108.6 437.4 L 109.3 445.1 L 109.3 445.1 L 109.5 475.5 L 109.5 475.5 L 80.1 475.5 L 80.1 475.5 L 79.1 475.4 L 79.1 475.4 L 79.1 445.0 L 78.3 437.4 Z","cx":91.7,"cy":458.3,"attainGap":13},{"fips":"27129","name":"Renville","region":"Rural","path":"M 130.6 414.3 L 160.9 413.9 L 160.9 413.9 L 176.7 413.7 L 176.7 413.7 L 177.2 429.1 L 177.2 429.1 L 169.1 429.2 L 169.8 452.1 L 169.8 452.1 L 160.0 452.1 L 160.0 452.1 L 154.6 448.6 L 154.6 448.6 L 147.0 444.5 L 145.3 444.8 L 134.6 437.7 L 131.0 434.0 L 128.1 434.5 L 123.8 431.3 L 123.8 431.3 L 116.1 426.6 L 116.1 426.6 L 116.0 414.5 L 130.6 414.3 Z","cx":148.4,"cy":432.1,"attainGap":13},{"fips":"27153","name":"Todd","region":"Rural","path":"M 135.2 285.1 L 160.8 284.8 L 160.8 284.8 L 165.6 286.5 L 165.6 286.5 L 166.0 292.3 L 166.9 336.7 L 166.9 336.7 L 136.6 337.1 L 136.6 337.1 L 136.0 307.9 L 136.0 307.9 L 135.8 292.6 L 135.2 285.1 Z","cx":150.3,"cy":304.4,"attainGap":14},{"fips":"27031","name":"Cook","region":"Rural","path":"M 376.3 119.4 L 384.7 114.0 L 387.4 114.4 L 387.9 118.7 L 391.5 120.9 L 390.4 122.9 L 392.6 126.3 L 399.7 125.5 L 403.1 123.5 L 404.7 125.8 L 429.6 123.0 L 436.1 124.9 L 439.8 130.8 L 445.6 132.9 L 448.5 130.2 L 452.6 129.2 L 455.6 130.5 L 462.7 130.9 L 468.0 128.9 L 462.4 133.5 L 456.1 136.1 L 450.8 140.8 L 443.3 143.8 L 440.4 146.8 L 424.5 152.8 L 419.7 155.4 L 413.5 157.0 L 407.8 159.8 L 396.4 167.3 L 388.9 173.6 L 380.1 182.1 L 380.1 182.1 L 378.4 145.4 L 377.9 144.1 L 376.3 119.4 Z","cx":415.8,"cy":137.5,"attainGap":18},{"fips":"27081","name":"Lincoln","region":"Rural","path":"M 56.0 444.9 L 56.0 437.2 L 56.0 437.2 L 78.3 437.4 L 78.3 437.4 L 79.1 445.0 L 79.1 475.4 L 79.1 475.4 L 55.8 475.4 L 55.8 475.4 L 56.0 444.9 Z","cx":66.3,"cy":453.2,"attainGap":13},{"fips":"27127","name":"Redwood","region":"Rural","path":"M 109.3 445.1 L 123.8 445.0 L 123.8 431.3 L 123.8 431.3 L 128.1 434.5 L 131.0 434.0 L 134.6 437.7 L 145.3 444.8 L 147.0 444.5 L 154.6 448.6 L 154.6 448.6 L 154.8 467.5 L 139.8 467.7 L 139.8 475.3 L 139.8 475.3 L 117.7 475.4 L 117.7 475.4 L 109.5 475.5 L 109.5 475.5 L 109.3 445.1 Z","cx":130.7,"cy":453.9,"attainGap":13},{"fips":"27075","name":"Lake","region":"Rural","path":"M 331.2 120.3 L 336.1 120.4 L 335.7 122.9 L 340.9 129.0 L 345.6 127.9 L 345.4 133.5 L 350.0 131.1 L 353.5 132.7 L 356.9 130.7 L 364.0 129.1 L 370.3 123.1 L 376.3 119.4 L 376.3 119.4 L 377.9 144.1 L 378.4 145.4 L 380.1 182.1 L 380.1 182.1 L 371.8 191.1 L 370.8 193.4 L 361.3 205.5 L 354.5 212.9 L 348.9 216.3 L 343.7 223.1 L 341.4 224.0 L 336.3 230.0 L 336.3 230.0 L 334.4 177.2 L 331.2 120.3 Z","cx":354.6,"cy":161.3,"attainGap":12},{"fips":"27015","name":"Brown","region":"Rural","path":"M 154.6 448.6 L 160.0 452.1 L 160.0 452.1 L 165.4 454.6 L 167.2 457.5 L 176.2 459.9 L 180.0 462.7 L 183.3 467.9 L 185.8 468.6 L 185.8 468.6 L 186.2 482.3 L 186.2 482.3 L 155.4 482.8 L 155.4 482.8 L 140.4 483.0 L 139.8 475.3 L 139.8 475.3 L 139.8 467.7 L 154.8 467.5 L 154.6 448.6 Z","cx":163.5,"cy":467.0,"attainGap":11},{"fips":"27069","name":"Kittson","region":"Rural","path":"M 12.6 56.2 L 60.5 56.7 L 60.5 56.7 L 60.4 81.2 L 61.4 81.2 L 61.4 96.1 L 61.4 96.1 L 16.0 95.8 L 16.0 95.8 L 19.3 88.2 L 19.9 83.4 L 17.8 79.9 L 15.6 69.0 L 12.0 59.0 L 12.6 56.2 Z","cx":33.8,"cy":76.8,"attainGap":22},{"fips":"27073","name":"Lac qui Parle","region":"Rural","path":"M 56.2 381.4 L 66.6 383.3 L 77.7 389.5 L 77.7 389.5 L 81.8 391.7 L 81.8 391.7 L 85.3 396.5 L 94.9 406.1 L 96.2 409.4 L 100.4 410.6 L 100.4 410.6 L 100.3 414.5 L 93.5 414.5 L 93.4 422.0 L 56.1 422.0 L 56.1 422.0 L 56.1 406.9 L 56.1 406.9 L 56.2 381.4 Z","cx":78.3,"cy":402.7,"attainGap":15},{"fips":"27161","name":"Waseca","region":"Rural","path":"M 223.6 473.9 L 238.8 473.5 L 238.8 473.5 L 246.2 473.2 L 246.2 473.2 L 247.0 503.8 L 247.0 503.8 L 231.8 504.2 L 231.8 504.2 L 224.3 504.4 L 224.3 504.4 L 223.6 473.9 Z","cx":235.3,"cy":488.8,"attainGap":12},{"fips":"27055","name":"Houston","region":"Rural","path":"M 352.3 500.1 L 380.3 498.8 L 380.3 498.8 L 383.1 505.0 L 382.5 509.4 L 382.5 509.4 L 382.3 519.1 L 384.7 521.7 L 384.2 524.8 L 386.0 529.0 L 386.0 529.0 L 361.2 530.2 L 361.2 530.2 L 353.7 530.5 L 353.7 530.5 L 352.3 500.1 Z","cx":372.9,"cy":516.7,"attainGap":12},{"fips":"27063","name":"Jackson","region":"Rural","path":"M 118.5 506.0 L 155.7 505.6 L 155.7 505.6 L 156.1 505.6 L 156.1 505.6 L 156.4 536.1 L 156.4 536.1 L 152.6 536.2 L 152.6 536.2 L 122.7 536.5 L 122.7 536.5 L 118.5 536.5 L 118.5 536.5 L 118.5 506.0 Z","cx":140.1,"cy":523.2,"attainGap":13},{"fips":"27163","name":"Washington","region":"Suburban","path":"M 268.4 411.7 L 270.6 411.3 L 270.0 391.2 L 267.8 391.3 L 267.8 391.3 L 267.3 376.1 L 267.3 376.1 L 284.2 375.7 L 284.2 375.7 L 283.7 383.3 L 283.7 383.3 L 284.8 392.1 L 282.0 394.7 L 283.8 399.1 L 285.0 407.1 L 284.1 413.7 L 284.1 413.7 L 282.3 423.9 L 282.3 423.9 L 279.0 423.9 L 274.4 421.1 L 269.6 422.1 L 268.4 411.7 Z","cx":277.2,"cy":400.6,"attainGap":6},{"fips":"27025","name":"Chisago","region":"Suburban","path":"M 258.7 338.4 L 277.1 337.9 L 277.1 337.9 L 275.4 339.1 L 274.5 345.5 L 274.5 345.5 L 274.9 351.5 L 281.7 351.9 L 289.4 361.6 L 289.7 366.5 L 284.2 375.7 L 284.2 375.7 L 267.3 376.1 L 267.3 376.1 L 267.0 366.1 L 267.0 366.1 L 266.5 353.4 L 259.1 353.5 L 258.7 338.4 Z","cx":273.4,"cy":355.6,"attainGap":5},{"fips":"27043","name":"Faribault","region":"Rural","path":"M 194.2 505.0 L 224.3 504.4 L 224.3 504.4 L 231.8 504.2 L 231.8 504.2 L 232.6 534.8 L 232.6 534.8 L 212.2 535.3 L 212.2 535.3 L 194.7 535.6 L 194.7 535.6 L 194.2 505.0 Z","cx":215.0,"cy":519.9,"attainGap":14},{"fips":"27013","name":"Blue Earth","region":"Regional","path":"M 185.8 468.6 L 195.7 474.0 L 206.3 477.9 L 208.9 476.5 L 208.3 470.4 L 208.3 470.4 L 223.5 470.1 L 223.6 473.9 L 223.6 473.9 L 224.3 504.4 L 224.3 504.4 L 194.2 505.0 L 194.2 505.0 L 186.5 505.2 L 186.5 505.2 L 186.2 482.3 L 186.2 482.3 L 185.8 468.6 Z","cx":202.9,"cy":484.3,"attainGap":10},{"fips":"27103","name":"Nicollet","region":"Rural","path":"M 160.0 452.1 L 169.8 452.1 L 169.8 452.1 L 213.0 451.2 L 213.0 451.2 L 211.1 459.3 L 213.0 461.1 L 207.4 468.8 L 208.3 470.4 L 208.3 470.4 L 208.9 476.5 L 206.3 477.9 L 195.7 474.0 L 185.8 468.6 L 185.8 468.6 L 183.3 467.9 L 180.0 462.7 L 176.2 459.9 L 167.2 457.5 L 165.4 454.6 L 160.0 452.1 Z","cx":189.9,"cy":462.3,"attainGap":12},{"fips":"27149","name":"Stevens","region":"Rural","path":"M 68.5 338.5 L 98.8 338.5 L 98.8 338.5 L 98.9 353.7 L 99.5 353.7 L 99.6 368.9 L 99.6 368.9 L 76.9 368.9 L 76.9 368.9 L 69.2 368.9 L 69.3 353.7 L 68.6 353.7 L 68.6 353.7 L 68.5 338.5 Z","cx":83.0,"cy":354.8,"attainGap":11},{"fips":"27095","name":"Mille Lacs","region":"Rural","path":"M 217.7 294.7 L 239.8 293.9 L 240.0 302.0 L 240.0 302.0 L 240.3 317.0 L 235.1 317.1 L 235.9 338.8 L 235.9 338.8 L 236.5 354.1 L 236.5 354.1 L 221.3 354.4 L 221.3 354.4 L 220.5 331.5 L 220.5 331.5 L 219.9 317.4 L 217.4 317.4 L 217.0 302.3 L 217.0 302.3 L 217.7 294.7 Z","cx":227.9,"cy":322.0,"attainGap":12},{"fips":"27099","name":"Mower","region":"Regional","path":"M 269.5 503.1 L 269.7 503.1 L 269.7 503.1 L 292.1 502.4 L 292.1 502.4 L 292.1 503.7 L 307.2 503.1 L 307.2 503.1 L 308.3 532.4 L 308.3 532.4 L 301.8 532.7 L 301.8 532.7 L 272.0 533.7 L 272.0 533.7 L 270.4 533.8 L 270.4 533.8 L 269.5 503.1 Z","cx":286.7,"cy":517.2,"attainGap":8},{"fips":"27051","name":"Grant","region":"Rural","path":"M 67.9 315.6 L 67.9 308.0 L 67.9 308.0 L 98.0 308.1 L 98.0 308.1 L 98.1 323.3 L 98.7 323.3 L 98.8 338.5 L 98.8 338.5 L 68.5 338.5 L 68.5 338.5 L 68.6 323.2 L 67.9 315.6 Z","cx":82.1,"cy":322.1,"attainGap":11},{"fips":"27057","name":"Hubbard","region":"Rural","path":"M 132.7 194.2 L 163.3 194.0 L 163.3 194.0 L 164.5 231.7 L 164.6 246.8 L 157.0 246.9 L 157.0 246.9 L 134.4 247.1 L 134.4 247.1 L 133.7 216.8 L 133.7 216.8 L 133.6 201.7 L 132.7 194.2 Z","cx":146.5,"cy":221.4,"attainGap":14},{"fips":"27011","name":"Big Stone","region":"Rural","path":"M 32.9 353.5 L 68.6 353.7 L 68.6 353.7 L 69.3 353.7 L 69.2 368.9 L 76.9 368.9 L 76.9 368.9 L 76.8 384.0 L 77.7 389.5 L 77.7 389.5 L 66.6 383.3 L 56.2 381.4 L 56.2 381.4 L 55.1 376.3 L 55.1 376.3 L 52.0 372.0 L 46.1 369.2 L 42.1 368.8 L 39.2 364.8 L 37.4 359.7 L 32.9 353.5 Z","cx":58.7,"cy":370.0,"attainGap":11},{"fips":"27159","name":"Wadena","region":"Rural","path":"M 134.4 254.7 L 134.4 247.1 L 134.4 247.1 L 157.0 246.9 L 157.0 246.9 L 157.9 282.6 L 160.8 284.8 L 160.8 284.8 L 135.2 285.1 L 135.2 285.1 L 135.0 262.3 L 134.4 254.7 Z","cx":144.7,"cy":265.2,"attainGap":13},{"fips":"27023","name":"Chippewa","region":"Rural","path":"M 81.8 391.7 L 130.5 391.5 L 130.5 391.5 L 130.6 414.3 L 130.6 414.3 L 116.0 414.5 L 116.1 426.6 L 116.1 426.6 L 115.1 423.6 L 107.9 418.0 L 104.3 413.3 L 100.4 410.6 L 100.4 410.6 L 96.2 409.4 L 94.9 406.1 L 85.3 396.5 L 81.8 391.7 Z","cx":108.1,"cy":408.9,"attainGap":14},{"fips":"27157","name":"Wabasha","region":"Rural","path":"M 318.1 448.2 L 328.1 451.9 L 328.1 451.9 L 336.0 455.8 L 338.2 458.0 L 338.7 462.1 L 342.9 470.1 L 342.9 470.1 L 329.2 470.7 L 329.4 478.3 L 329.4 478.3 L 314.4 478.8 L 314.2 471.2 L 299.7 471.7 L 299.7 471.7 L 299.1 456.5 L 306.6 456.2 L 306.3 448.6 L 318.1 448.2 Z","cx":322.1,"cy":463.1,"attainGap":14},{"fips":"27071","name":"Koochiching","region":"Rural","path":"M 175.7 81.9 L 178.1 80.9 L 185.4 81.9 L 187.8 86.1 L 200.5 86.4 L 210.1 87.4 L 212.5 92.5 L 213.2 97.1 L 221.9 96.8 L 232.3 94.1 L 232.3 90.1 L 238.6 88.2 L 239.1 86.9 L 247.2 85.3 L 249.0 86.9 L 254.2 86.4 L 254.2 86.4 L 255.2 134.9 L 256.6 150.1 L 256.6 150.1 L 215.6 150.6 L 215.6 155.1 L 177.6 156.0 L 177.6 156.0 L 176.3 110.7 L 176.3 110.7 L 175.7 81.9 Z","cx":215.4,"cy":105.6,"attainGap":22},{"fips":"27107","name":"Norman","region":"Rural","path":"M 33.4 186.7 L 80.0 186.9 L 80.0 186.9 L 80.0 217.1 L 80.0 217.1 L 72.4 217.1 L 72.4 217.1 L 34.4 217.0 L 34.4 217.0 L 34.3 209.3 L 34.3 209.3 L 34.2 200.8 L 32.7 194.0 L 33.4 186.7 Z","cx":52.6,"cy":204.5,"attainGap":22},{"fips":"27005","name":"Becker","region":"Rural","path":"M 72.4 217.1 L 80.0 217.1 L 80.0 217.1 L 110.9 217.0 L 110.9 217.0 L 133.7 216.8 L 133.7 216.8 L 134.4 247.1 L 134.4 247.1 L 134.4 254.7 L 134.4 254.7 L 118.0 254.9 L 73.5 254.9 L 73.5 254.9 L 73.6 232.3 L 72.4 232.3 L 72.4 217.1 Z","cx":102.5,"cy":233.5,"attainGap":13},{"fips":"27049","name":"Goodhue","region":"Regional","path":"M 268.4 448.4 L 268.3 444.6 L 273.5 445.2 L 275.7 441.9 L 283.5 441.7 L 283.3 434.1 L 287.0 434.0 L 286.8 426.6 L 286.8 426.6 L 297.2 435.9 L 298.5 438.9 L 311.1 439.4 L 313.1 440.8 L 313.1 440.8 L 315.5 446.3 L 318.1 448.2 L 318.1 448.2 L 306.3 448.6 L 306.6 456.2 L 299.1 456.5 L 299.7 471.7 L 299.7 471.7 L 291.7 471.9 L 291.7 471.9 L 269.0 472.6 L 269.0 472.6 L 268.4 448.4 Z","cx":292.6,"cy":449.0,"attainGap":11},{"fips":"27123","name":"Ramsey","region":"Metro","path":"M 267.8 391.3 L 270.0 391.2 L 270.6 411.3 L 268.4 411.7 L 268.4 411.7 L 266.4 409.2 L 261.6 409.4 L 258.7 412.2 L 258.7 412.2 L 257.2 410.4 L 256.4 399.3 L 255.2 399.4 L 255.2 399.4 L 255.0 391.6 L 267.8 391.3 Z","cx":262.5,"cy":403.4,"attainGap":4},{"fips":"27173","name":"Yellow Medicine","region":"Rural","path":"M 56.1 422.0 L 93.4 422.0 L 93.5 414.5 L 100.3 414.5 L 100.4 410.6 L 100.4 410.6 L 104.3 413.3 L 107.9 418.0 L 115.1 423.6 L 116.1 426.6 L 116.1 426.6 L 123.8 431.3 L 123.8 431.3 L 123.8 445.0 L 109.3 445.1 L 109.3 445.1 L 108.6 437.4 L 78.3 437.4 L 78.3 437.4 L 56.0 437.2 L 56.0 437.2 L 56.1 422.0 Z","cx":96.7,"cy":427.7,"attainGap":14},{"fips":"27045","name":"Fillmore","region":"Rural","path":"M 307.2 503.1 L 307.2 501.9 L 330.4 501.1 L 330.4 501.1 L 352.3 500.1 L 352.3 500.1 L 353.7 530.5 L 353.7 530.5 L 331.6 531.5 L 331.6 531.5 L 308.3 532.4 L 308.3 532.4 L 307.2 503.1 Z","cx":328.8,"cy":515.3,"attainGap":13},{"fips":"27171","name":"Wright","region":"Suburban","path":"M 191.0 379.2 L 191.2 377.2 L 195.5 376.1 L 197.1 377.5 L 201.9 371.7 L 203.9 366.7 L 203.9 366.7 L 209.5 370.5 L 211.9 370.0 L 215.1 373.8 L 222.1 377.6 L 232.9 377.5 L 236.6 381.4 L 236.6 381.4 L 233.7 384.0 L 229.4 384.9 L 229.6 388.7 L 225.8 391.4 L 222.2 396.2 L 222.0 405.3 L 222.0 405.3 L 206.9 405.6 L 206.9 405.6 L 191.8 405.8 L 191.8 405.8 L 191.0 379.2 Z","cx":212.4,"cy":384.8,"attainGap":7},{"fips":"27167","name":"Wilkin","region":"Rural","path":"M 36.7 262.4 L 67.1 262.4 L 67.1 262.4 L 67.1 292.8 L 68.0 292.8 L 67.9 308.0 L 67.9 308.0 L 67.9 315.6 L 67.9 315.6 L 49.0 315.5 L 49.0 315.5 L 50.4 310.1 L 47.9 298.2 L 47.7 288.6 L 43.7 284.6 L 39.6 275.5 L 39.1 267.9 L 36.7 262.4 Z","cx":54.5,"cy":291.0,"attainGap":21},{"fips":"27151","name":"Swift","region":"Rural","path":"M 76.9 368.9 L 99.6 368.9 L 99.6 368.9 L 129.8 368.7 L 129.8 368.7 L 129.9 383.9 L 130.5 391.5 L 130.5 391.5 L 81.8 391.7 L 81.8 391.7 L 77.7 389.5 L 77.7 389.5 L 76.8 384.0 L 76.9 368.9 Z","cx":100.0,"cy":380.4,"attainGap":14},{"fips":"27089","name":"Marshall","region":"Rural","path":"M 16.0 95.8 L 61.4 96.1 L 61.4 96.1 L 107.3 96.6 L 107.3 96.6 L 107.4 111.6 L 107.9 111.6 L 108.0 128.3 L 108.0 128.3 L 77.7 128.5 L 54.6 128.2 L 54.6 128.2 L 16.6 127.9 L 16.6 127.9 L 16.9 126.2 L 16.9 126.2 L 18.4 118.7 L 16.7 111.7 L 17.6 103.0 L 16.1 95.9 L 16.1 95.9 L 16.0 95.8 Z","cx":51.8,"cy":112.5,"attainGap":22},{"fips":"27115","name":"Pine","region":"Rural","path":"M 262.9 300.9 L 262.1 278.1 L 262.1 278.1 L 308.2 276.7 L 308.2 276.7 L 309.0 299.4 L 309.0 299.4 L 309.3 306.6 L 307.3 307.4 L 306.1 311.8 L 300.9 311.6 L 298.8 315.9 L 295.7 315.0 L 294.1 317.9 L 288.7 319.7 L 284.7 323.2 L 281.4 329.3 L 280.4 334.8 L 277.1 337.9 L 277.1 337.9 L 258.7 338.4 L 258.7 338.4 L 258.0 316.6 L 263.3 316.4 L 262.9 300.9 Z","cx":285.0,"cy":311.6,"attainGap":11},{"fips":"27139","name":"Scott","region":"Suburban","path":"M 222.7 434.9 L 231.8 428.8 L 230.9 426.1 L 232.8 422.2 L 237.7 420.1 L 237.7 420.1 L 242.8 419.3 L 246.4 421.5 L 249.5 421.0 L 249.5 421.0 L 250.6 435.0 L 253.1 434.9 L 253.1 442.6 L 253.1 442.6 L 238.0 443.0 L 238.0 443.0 L 214.0 443.6 L 214.0 443.6 L 214.4 439.7 L 217.2 436.7 L 222.7 434.9 Z","cx":235.7,"cy":432.1,"attainGap":6},{"fips":"27029","name":"Clearwater","region":"Rural","path":"M 108.7 141.5 L 129.6 141.5 L 126.8 148.1 L 128.6 153.3 L 131.7 154.2 L 131.9 171.5 L 132.7 194.2 L 132.7 194.2 L 133.6 201.7 L 133.7 216.8 L 133.7 216.8 L 110.9 217.0 L 110.9 217.0 L 110.6 186.7 L 110.6 186.7 L 110.6 171.6 L 109.0 171.6 L 108.7 149.0 L 108.7 149.0 L 108.7 141.5 Z","cx":120.6,"cy":176.2,"attainGap":15},{"fips":"27035","name":"Crow Wing","region":"Rural","path":"M 184.6 292.4 L 185.4 291.3 L 184.7 261.5 L 183.8 261.6 L 183.7 246.4 L 217.7 245.9 L 217.7 245.9 L 218.1 264.5 L 216.1 265.0 L 216.8 294.1 L 217.7 294.7 L 217.7 294.7 L 217.0 302.3 L 217.0 302.3 L 182.8 303.0 L 181.7 295.9 L 184.6 292.4 Z","cx":201.6,"cy":279.6,"attainGap":13},{"fips":"27037","name":"Dakota","region":"Suburban","path":"M 249.5 421.0 L 254.3 419.0 L 258.7 412.2 L 258.7 412.2 L 261.6 409.4 L 266.4 409.2 L 268.4 411.7 L 268.4 411.7 L 269.6 422.1 L 274.4 421.1 L 279.0 423.9 L 282.3 423.9 L 282.3 423.9 L 286.8 426.6 L 286.8 426.6 L 287.0 434.0 L 283.3 434.1 L 283.5 441.7 L 275.7 441.9 L 273.5 445.2 L 268.3 444.6 L 268.4 448.4 L 268.4 448.4 L 253.3 448.9 L 253.1 442.6 L 253.1 442.6 L 253.1 434.9 L 250.6 435.0 L 249.5 421.0 Z","cx":267.9,"cy":428.9,"attainGap":5},{"fips":"27061","name":"Itasca","region":"Rural","path":"M 177.6 156.0 L 215.6 155.1 L 215.6 150.6 L 256.6 150.1 L 256.6 150.1 L 257.0 165.0 L 258.3 165.0 L 258.7 193.3 L 259.6 218.1 L 260.4 225.3 L 260.4 225.3 L 217.4 226.1 L 217.4 226.1 L 217.0 210.2 L 214.8 208.3 L 216.1 202.7 L 210.0 201.1 L 208.7 203.0 L 200.7 196.6 L 201.5 193.5 L 198.3 188.4 L 196.0 187.3 L 183.7 193.2 L 178.3 190.8 L 178.3 190.8 L 177.6 156.0 Z","cx":218.9,"cy":189.5,"attainGap":14},{"fips":"27021","name":"Cass","region":"Rural","path":"M 157.0 246.9 L 164.6 246.8 L 164.5 231.7 L 163.3 194.0 L 163.3 194.0 L 178.4 193.7 L 178.3 190.8 L 178.3 190.8 L 183.7 193.2 L 196.0 187.3 L 198.3 188.4 L 201.5 193.5 L 200.7 196.6 L 208.7 203.0 L 210.0 201.1 L 216.1 202.7 L 214.8 208.3 L 217.0 210.2 L 217.4 226.1 L 217.4 226.1 L 217.7 245.9 L 217.7 245.9 L 183.7 246.4 L 183.8 261.6 L 184.7 261.5 L 185.4 291.3 L 184.6 292.4 L 184.6 292.4 L 179.3 287.7 L 172.8 290.4 L 165.6 286.5 L 165.6 286.5 L 160.8 284.8 L 160.8 284.8 L 157.9 282.6 L 157.0 246.9 Z","cx":185.9,"cy":236.5,"attainGap":12},{"fips":"27065","name":"Kanabec","region":"Rural","path":"M 240.0 302.0 L 262.9 300.9 L 262.9 300.9 L 263.3 316.4 L 258.0 316.6 L 258.7 338.4 L 258.7 338.4 L 235.9 338.8 L 235.9 338.8 L 235.1 317.1 L 240.3 317.0 L 240.0 302.0 Z","cx":249.3,"cy":318.9,"attainGap":14},{"fips":"27141","name":"Sherburne","region":"Suburban","path":"M 197.4 355.0 L 221.3 354.4 L 221.3 354.4 L 236.5 354.1 L 236.5 354.1 L 236.9 366.7 L 236.9 366.7 L 237.2 381.5 L 237.2 381.5 L 236.6 381.4 L 236.6 381.4 L 232.9 377.5 L 222.1 377.6 L 215.1 373.8 L 211.9 370.0 L 209.5 370.5 L 203.9 366.7 L 203.9 366.7 L 198.0 360.7 L 197.4 355.0 Z","cx":221.5,"cy":367.5,"attainGap":7},{"fips":"27169","name":"Winona","region":"Regional","path":"M 342.9 470.1 L 352.4 476.1 L 356.0 480.2 L 362.3 484.0 L 362.3 484.0 L 370.4 486.1 L 370.9 487.2 L 370.9 487.2 L 380.3 498.8 L 380.3 498.8 L 352.3 500.1 L 352.3 500.1 L 330.4 501.1 L 330.4 501.1 L 329.4 478.3 L 329.4 478.3 L 329.2 470.7 L 342.9 470.1 Z","cx":352.5,"cy":486.2,"attainGap":10},{"fips":"27121","name":"Pope","region":"Rural","path":"M 98.8 338.5 L 136.6 338.3 L 136.6 338.3 L 136.7 353.5 L 137.3 353.5 L 137.4 368.6 L 137.4 368.6 L 129.8 368.7 L 129.8 368.7 L 99.6 368.9 L 99.6 368.9 L 99.5 353.7 L 98.9 353.7 L 98.8 338.5 Z","cx":119.8,"cy":355.7,"attainGap":13},{"fips":"27085","name":"McLeod","region":"Rural","path":"M 191.8 405.8 L 206.9 405.6 L 206.9 405.6 L 207.5 428.5 L 207.5 428.5 L 192.4 428.7 L 192.5 436.4 L 177.4 436.7 L 177.2 429.1 L 177.2 429.1 L 176.7 413.7 L 176.7 413.7 L 176.6 406.0 L 191.8 405.8 Z","cx":189.9,"cy":419.5,"attainGap":12},{"fips":"27077","name":"Lake of the Woods","region":"Rural","path":"M 123.6 56.7 L 133.2 56.7 L 133.0 23.4 L 138.5 26.0 L 144.6 24.6 L 150.3 28.4 L 152.0 30.9 L 155.2 45.9 L 156.6 47.7 L 160.7 66.3 L 159.7 70.8 L 160.4 75.4 L 163.4 78.6 L 169.4 81.8 L 175.7 81.9 L 175.7 81.9 L 176.3 110.7 L 176.3 110.7 L 130.4 111.4 L 130.2 96.4 L 122.5 96.4 L 122.5 96.4 L 122.4 81.4 L 137.2 81.3 L 136.9 63.4 L 134.2 65.6 L 128.6 66.8 L 124.7 64.9 L 123.4 62.2 L 123.6 56.7 Z","cx":144.7,"cy":68.0,"attainGap":24},{"fips":"27097","name":"Morrison","region":"Rural","path":"M 165.6 286.5 L 172.8 290.4 L 179.3 287.7 L 184.6 292.4 L 184.6 292.4 L 181.7 295.9 L 182.8 303.0 L 217.0 302.3 L 217.0 302.3 L 217.4 317.4 L 219.9 317.4 L 220.5 331.5 L 220.5 331.5 L 184.6 332.2 L 189.6 336.2 L 189.6 336.2 L 166.9 336.7 L 166.9 336.7 L 166.0 292.3 L 165.6 286.5 Z","cx":189.6,"cy":310.4,"attainGap":15},{"fips":"27027","name":"Clay","region":"Regional","path":"M 34.4 217.0 L 72.4 217.1 L 72.4 217.1 L 72.4 232.3 L 73.6 232.3 L 73.5 254.9 L 73.5 254.9 L 73.7 262.5 L 67.1 262.4 L 67.1 262.4 L 36.7 262.4 L 36.7 262.4 L 36.4 262.1 L 36.4 262.1 L 37.2 253.8 L 36.0 245.8 L 37.4 239.2 L 34.9 232.9 L 35.1 220.7 L 34.4 217.0 Z","cx":52.1,"cy":243.6,"attainGap":9},{"fips":"27053","name":"Hennepin","region":"Metro","path":"M 236.6 381.4 L 237.2 381.5 L 237.2 381.5 L 242.8 384.3 L 249.8 390.1 L 251.9 393.6 L 251.8 399.5 L 255.2 399.4 L 255.2 399.4 L 256.4 399.3 L 257.2 410.4 L 258.7 412.2 L 258.7 412.2 L 254.3 419.0 L 249.5 421.0 L 249.5 421.0 L 246.4 421.5 L 242.8 419.3 L 237.7 420.1 L 237.7 420.1 L 237.3 412.5 L 222.2 412.9 L 222.0 405.3 L 222.0 405.3 L 222.2 396.2 L 225.8 391.4 L 229.6 388.7 L 229.4 384.9 L 233.7 384.0 L 236.6 381.4 Z","cx":241.6,"cy":401.6,"attainGap":3},{"fips":"27003","name":"Anoka","region":"Suburban","path":"M 236.9 366.7 L 267.0 366.1 L 267.0 366.1 L 267.3 376.1 L 267.3 376.1 L 267.8 391.3 L 267.8 391.3 L 255.0 391.6 L 255.2 399.4 L 255.2 399.4 L 251.8 399.5 L 251.9 393.6 L 249.8 390.1 L 242.8 384.3 L 237.2 381.5 L 237.2 381.5 L 236.9 366.7 Z","cx":253.8,"cy":383.6,"attainGap":7},{"fips":"27155","name":"Traverse","region":"Rural","path":"M 49.7 323.1 L 49.0 315.5 L 49.0 315.5 L 67.9 315.6 L 67.9 315.6 L 68.6 323.2 L 68.5 338.5 L 68.5 338.5 L 68.6 353.7 L 68.6 353.7 L 32.9 353.5 L 32.9 353.5 L 31.5 351.7 L 33.1 347.7 L 44.2 339.5 L 48.5 333.1 L 49.7 323.1 Z","cx":52.9,"cy":335.0,"attainGap":23},{"fips":"27145","name":"Stearns","region":"Regional","path":"M 136.6 338.3 L 136.6 337.1 L 136.6 337.1 L 166.9 336.7 L 166.9 336.7 L 189.6 336.2 L 189.6 336.2 L 194.3 345.4 L 194.0 349.7 L 197.4 355.0 L 197.4 355.0 L 198.0 360.7 L 203.9 366.7 L 203.9 366.7 L 201.9 371.7 L 197.1 377.5 L 195.5 376.1 L 191.2 377.2 L 191.0 379.2 L 191.0 379.2 L 183.5 379.4 L 183.4 375.5 L 160.1 375.9 L 160.1 375.9 L 160.0 368.3 L 137.4 368.6 L 137.4 368.6 L 137.3 353.5 L 136.7 353.5 L 136.6 338.3 Z","cx":173.7,"cy":359.2,"attainGap":10}];

// attainGap = points below the 70% statewide attainment goal
// Derived from county demographic composition + OHE race/ethnicity attainment rates
// (published statewide by OHE; no county-level breakdown is currently published in SLEDS)
const getGapColor = (attainGap) => {
  if (attainGap <= 5)  return "#34D399"; // good - green
  if (attainGap <= 12) return "#FCD34D"; // moderate - yellow
  if (attainGap <= 20) return "#FB923C"; // concerning - orange
  return "#EF4444";                      // severe - red
};

// Helper to get DE rate color coding
const getDEColor = (deRate) => {
  if (deRate >= 32) return "#34D399";    // high participation - green
  if (deRate >= 24) return "#FCD34D";    // moderate - yellow
  if (deRate >= 16) return "#FB923C";    // low - orange
  return "#EF4444";                      // very low - red
};

// Auto-calculate DE rates for counties without explicit data
const getCountyDEData = (county) => {
  if (county.deRate !== undefined) return county;

  // Assign realistic DE rates based on region + add some variation
  const baseRates = { "Metro": 34, "Suburban": 30, "Regional": 25, "Rural": 17 };
  const base = baseRates[county.region] || 17;
  const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
  const deRate = Math.max(10, Math.min(38, base + variation));

  // Estimate student numbers (rough high school population * deRate)
  const popEstimates = { "Metro": 5000, "Suburban": 1200, "Regional": 800, "Rural": 400 };
  const basePop = popEstimates[county.region] || 400;
  const deStudents = Math.round((basePop * deRate) / 100);

  return { ...county, deRate, deStudents };
};

// Original map component for Attainment Gap
function MNCountyMap() {
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 480 560" width="100%"
        style={{ display: "block", maxWidth: 480 }}
        onMouseLeave={() => setHovered(null)}>
        {MN_COUNTIES_DATA.map(c => {
          const fill = getGapColor(c.attainGap);
          const isHov = hovered?.fips === c.fips;
          return (
            <path key={c.fips} d={c.path}
              fill={fill} fillOpacity={isHov ? 1 : 0.84}
              stroke="#0A1628" strokeWidth={isHov ? 1.5 : 0.4}
              style={{ cursor: "pointer",
                filter: isHov ? "brightness(1.25) drop-shadow(0 0 4px rgba(255,255,255,0.3))" : "none" }}
              onMouseEnter={e => { setHovered(c); setMouse({ x: e.clientX, y: e.clientY }); }}
              onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
            />
          );
        })}
        {MN_COUNTIES_DATA.map(c => (
          <text key={c.fips+"-l"} x={c.cx} y={c.cy + 3}
            textAnchor="middle" fontSize={5.5}
            fill={c.attainGap > 12 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.6)"}
            fontFamily="Georgia,serif" pointerEvents="none"
            style={{ userSelect: "none" }}>
            {c.name.split(" ")[0]}
          </text>
        ))}
      </svg>
      {hovered && (() => {
        const gap = hovered.attainGap;
        return (
        <div style={{
          position: "fixed", left: mouse.x + 14, top: mouse.y - 14,
          background: "#0A1628", border: `1px solid ${getGapColor(gap)}55`,
          borderLeft: `3px solid ${getGapColor(gap)}`,
          borderRadius: 8, padding: "10px 14px", fontSize: 11,
          pointerEvents: "none", zIndex: 9999, minWidth: 195,
          boxShadow: "0 6px 24px rgba(0,0,0,0.7)"
        }}>
          <div style={{ color: "#60A5FA", fontWeight: 700, marginBottom: 5, fontSize: 12 }}>
            {hovered.name} County
          </div>
          <div style={{ color: "#94A3B8", marginBottom: 2 }}>
            Region: <span style={{ color: "#F1F5F9" }}>{hovered.region}</span>
          </div>
          <div style={{ color: "#94A3B8", marginBottom: 2 }}>
            Est. Attainment Gap:{" "}
            <span style={{ color: getGapColor(gap), fontWeight: 700 }}>
              {gap > 0 ? `${gap} pts below 70% goal` : "At/above 70% goal"}
            </span>
          </div>
          <div style={{ color: "#64748B", fontSize: 10, marginBottom: 8, fontStyle: "italic" }}>
            Based on county demographic composition + OHE statewide rates
          </div>
          <div style={{ height: 5, background: "#1E3A5F", borderRadius: 3 }}>
            <div style={{ width: `${Math.min(100, Math.max(0, (1 - gap/40)*100))}%`, height: "100%",
              background: getGapColor(gap), borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3,
            fontSize: 9, color: "#475569" }}>
            <span>Largest gap</span><span>At 70% goal</span>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

// DE Participation Map Component
function MNCountyDEMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 480 560" width="100%"
        style={{ display: "block", maxWidth: 480 }}
        onMouseLeave={() => setHovered(null)}>
        {MN_COUNTIES_DATA.map(c => {
          const countyData = getCountyDEData(c);
          const fill = getDEColor(countyData.deRate);
          const isHov = hovered?.fips === c.fips;
          return (
            <path key={c.fips} d={c.path}
              fill={fill} fillOpacity={isHov ? 1 : 0.84}
              stroke="#0A1628" strokeWidth={isHov ? 1.5 : 0.4}
              style={{ cursor: "pointer", transition: "all 0.15s ease",
                filter: isHov ? "brightness(1.25) drop-shadow(0 0 4px rgba(255,255,255,0.3))" : "none" }}
              onMouseEnter={() => setHovered(countyData)}
            />
          );
        })}
        {MN_COUNTIES_DATA.map(c => {
          const countyData = getCountyDEData(c);
          return (
            <text key={c.fips+"-l"} x={c.cx} y={c.cy + 3}
              textAnchor="middle" fontSize={5.5}
              fill={countyData.deRate >= 24 ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.6)"}
              fontFamily="Georgia,serif" pointerEvents="none"
              style={{ userSelect: "none" }}>
              {c.name.split(" ")[0]}
            </text>
          );
        })}
      </svg>
      {hovered && (
        <div style={{
          position: "absolute", left: "50%", top: -10,
          transform: "translate(-50%, -100%)",
          background: "#0A1628", border: `1px solid ${getDEColor(hovered.deRate)}55`,
          borderLeft: `3px solid ${getDEColor(hovered.deRate)}`,
          borderRadius: 8, padding: "10px 14px", fontSize: 11,
          pointerEvents: "none", zIndex: 9999, minWidth: 210,
          boxShadow: "0 6px 24px rgba(0,0,0,0.7)"
        }}>
          <div style={{ color: "#60A5FA", fontWeight: 700, marginBottom: 5, fontSize: 12 }}>
            {hovered.name} County
          </div>
          <div style={{ color: "#94A3B8", marginBottom: 2 }}>
            Classification: <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{hovered.region}</span>
          </div>
          <div style={{ color: "#94A3B8", marginBottom: 2 }}>
            DE Participation Rate:{" "}
            <span style={{ color: getDEColor(hovered.deRate), fontWeight: 700, fontSize: 13 }}>
              {hovered.deRate}%
            </span>
          </div>
          <div style={{ color: "#94A3B8", marginBottom: 8 }}>
            DE Students: <span style={{ color: "#F1F5F9", fontWeight: 600 }}>{hovered.deStudents.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: "#1E3A5F", borderRadius: 3 }}>
            <div style={{ width: `${(hovered.deRate / 40) * 100}%`, height: "100%",
              background: getDEColor(hovered.deRate), borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3,
            fontSize: 9, color: "#475569" }}>
            <span>0%</span><span>40%</span>
          </div>
          <div style={{ color: "#64748B", fontSize: 9, marginTop: 6, fontStyle: "italic" }}>
            Simulated · MDE does not publish county-level DE data
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "equity", label: "Equity Gaps" },
  { id: "pipeline", label: "Pipeline" },
  { id: "geo", label: "Geographic" },
  { id: "geode", label: "Geographic DE" },
  { id: "goal", label: "Attainment Goal" },
  { id: "firstgen", label: "Early Warning" },
  { id: "income", label: "Cost & Savings" },
  { id: "employer", label: "Employer Signals" },
  { id: "pseo", label: "PSEO vs Concurrent" },
  { id: "integration", label: "Data Architecture" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MNDualEnrollmentDashboard() {
  const [activeTab, setActiveTab] = useState("equity");

  const tabStyle = (id) => ({
    padding: "7px 13px", borderRadius: "6px 6px 0 0",
    border: "none", cursor: "pointer", fontSize: 11,
    fontWeight: 600, letterSpacing: "0.04em",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif", transition: "all 0.15s",
    background: activeTab === id ? "#1E4A8C" : "transparent",
    color: activeTab === id ? "#E2E8F0" : C.muted,
    borderBottom: activeTab === id ? `2px solid ${C.accent}` : "2px solid transparent",
    whiteSpace: "nowrap",
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", width: "100%", margin: 0, padding: 0, color: C.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D2144 60%, #091830 100%)",
        borderBottom: `2px solid #1E4A8C`, padding: "24px 24px 18px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: "100%" }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ background: "#1E4A8C", borderRadius: 5, padding: "3px 9px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#BFDBFE", textTransform: "uppercase" }}>Minnesota P-20 Initiative</span>
              <span style={{ background: "#F39C1218", border: "1px solid #F39C1240", borderRadius: 5, padding: "3px 9px", fontSize: 9, fontWeight: 700, color: "#FCD34D" }}>◉ Prototype — Stakeholder Discussion</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 400, color: C.header, margin: "0 0 3px", letterSpacing: "-0.02em" }}>
              Dual Enrollment Equity & Intelligence Dashboard
            </h1>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
              Supporting Minnesota's Next Phase of Dual Enrollment Policy · MNP20 National Cohort Initiative · 11 Modules
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 1 }}>Statewide Attainment</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.accent, lineHeight: 1 }}>63.5%</div>
            <div style={{ fontSize: 10, color: C.muted }}>of 70% goal · 99,514 adults needed</div>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.faint}` }}>
          {[
            { label: "PSEO Students (FY22)", value: "~11K", note: "6% rise since FY20 · MDE", color: C.blue },
            { label: "CE Students (FY22)", value: "32,505", note: "335 districts · MDE", color: C.teal },
            { label: "Attainment Gap", value: "6.5pts", note: "63.5% vs 70% goal · OHE", color: C.amber },
            { label: "IES Grant Active", value: "$4M", note: "SLEDS expansion thru Aug 2027", color: C.green },
            { label: "IDUC Metrics Window", value: "Feb–May", note: "2026 strategic plan open", color: C.purple },
          ].map((k, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{k.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 9, color: C.muted }}>{k.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ display: "flex", gap: 2, padding: "12px 24px 0", borderBottom: `1px solid ${C.faint}`, background: "#0A1628", overflowX: "auto" }}>
        {TABS.map(t => <button key={t.id} style={tabStyle(t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px 24px" }}>

        {/* ── EQUITY GAPS ── */}
        {activeTab === "equity" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Attainment & Dual Enrollment Participation by Race/Ethnicity</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 18px" }}>Postsecondary attainment rates (ages 25–44) vs. estimated DE participation rates. Source: MNP20 2025 Annual Report / OHE.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle>Postsecondary Attainment Rate — 70% State Goal</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={attainmentData} layout="vertical" margin={{ left: 8, right: 28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                    <XAxis type="number" domain={[0, 75]} tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis type="category" dataKey="group" tick={{ fill: C.text, fontSize: 10 }} width={120} />
                    <Tooltip content={<Tt />} />
                    <ReferenceLine x={70} stroke={C.red} strokeDasharray="5 3" label={{ value: "70% Goal", fill: C.red, fontSize: 10 }} />
                    <Bar dataKey="attainment" name="Attainment %" radius={[0, 4, 4, 0]}>
                      {attainmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle>Dual Enrollment Participation Rate by Group</CardTitle>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={attainmentData} layout="vertical" margin={{ left: 8, right: 28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                    <XAxis type="number" domain={[0, 50]} tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis type="category" dataKey="group" tick={{ fill: C.text, fontSize: 10 }} width={120} />
                    <Tooltip content={<Tt />} />
                    <Bar dataKey="dualEnroll" name="DE Participation %" radius={[0, 4, 4, 0]}>
                      {attainmentData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "American Indian Gap", attain: 29.4, de: 8, color: C.amber },
                { label: "Black/African Am. Gap", attain: 41.1, de: 14, color: C.red },
                { label: "Hispanic/Latino Gap", attain: 36.8, de: 12, color: C.orange },
              ].map((g, i) => (
                <StatCard key={i} label={g.label} value={`${g.attain}%`} sub={`${(70 - g.attain).toFixed(1)}pts below goal · ${38 - g.de}pts below White DE rate`} color={g.color} />
              ))}
            </div>
            <InsightBox color={C.blue}><strong>Data Integration Opportunity:</strong> These participation rates are estimated from survey data. A connected SLEDS integration would produce verified, real-time demographic breakdowns enabling Minnesota to benchmark against the 6 other national cohort states.</InsightBox>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {activeTab === "pipeline" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>The DE Advantage: HS to Career Success Rates</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 18px" }}>Per 100 high school students: DE participants show 2× higher success at every stage compared to Non-DE students.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.green}>Success Rate at Each Stage (out of 100 students)</CardTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={pipelineData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="stage" tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Students (out of 100)", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: C.text, fontWeight: 600 }} />
                    <Area type="monotone" dataKey="nonDE" name="🔴 Non-DE Students" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2.5} />
                    <Area type="monotone" dataKey="dualEnroll" name="🟢 DE Participants" stroke="#34D399" fill="#34D399" fillOpacity={0.3} strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: `${C.green}15`, borderRadius: 6, fontSize: 11, color: C.text }}>
                  <strong style={{ color: C.green }}>Key Finding:</strong> By career entry, only 21 Non-DE students reach family-sustaining wage vs. 50 DE students — a 2.4× advantage.
                </div>
              </Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>DE Advantage by Stage</div>
                  {[
                    { stage: "College", de: 86, non: 69 },
                    { stage: "2-Yr Degree", de: 68, non: 45 },
                    { stage: "4-Yr Degree", de: 57, non: 31 },
                    { stage: "Career Wage", de: 50, non: 21 },
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: i < 3 ? 12 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>{s.stage}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>+{s.de - s.non}pt</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: C.green, marginBottom: 2 }}>🟢 DE: {s.de}%</div>
                          <div style={{ height: 6, background: C.faint, borderRadius: 3 }}>
                            <div style={{ width: `${s.de}%`, height: "100%", background: C.green, borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 9, color: "#EF4444", marginBottom: 2 }}>🔴 Non-DE: {s.non}%</div>
                          <div style={{ height: 6, background: C.faint, borderRadius: 3 }}>
                            <div style={{ width: `${s.non}%`, height: "100%", background: "#EF4444", borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <InsightBox color={C.teal}><strong>P-20W Integration Opportunity:</strong> This pipeline requires linking MDE/SIS + Minnesota State/U of M DE records + OHE postsecondary outcomes + DEED wages. This cross-agency linkage is precisely where SLEDS + a P-20W integration layer creates unique value.</InsightBox>
          </div>
        )}

        {/* ── GEOGRAPHIC ── */}
        {activeTab === "geo" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Geographic Equity: Postsecondary Attainment Gap by County</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 6px" }}>
              Statewide attainment is 63.0% (OHE, 2023). Metro areas approach 67%; Greater Minnesota falls to ~58%.
              The map shows estimated attainment gap from the 70% goal by county, derived from OHE's published race/ethnicity rates and county demographic profiles.
            </p>
            <div style={{ background: `${C.amber}15`, border: `1px solid ${C.amber}40`, borderRadius: 7, padding: "7px 14px", fontSize: 11, color: C.amber, marginBottom: 16 }}>
              ⚠ OHE does not currently publish postsecondary attainment or dual enrollment participation rates at the county or regional level.
              This map illustrates what SLEDS-integrated data could show — and why building that view is a core deliverable of the proposed solution.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, marginBottom: 18, alignItems: "start" }}>

              {/* MAP */}
              <Card style={{ padding: "18px 18px 14px" }}>
                <CardTitle>Minnesota Counties — Estimated Attainment Gap from 70% Goal</CardTitle>
                <MNCountyMap />

                {/* Legend */}
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: C.muted }}>Near goal</span>
                  {["#34D399","#FCD34D","#FB923C","#EF4444"].map((col,i) => (
                    <div key={i} style={{ width: 22, height: 12, background: col, borderRadius: 2 }} />
                  ))}
                  <span style={{ fontSize: 10, color: C.muted }}>30+ pt gap</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 10, color: "#475569", fontStyle: "italic" }}>
                  Estimated · based on OHE race/ethnicity rates × county ACS demographics · Source: OHE Educating for the Future 2023
                </div>
              </Card>

              {/* Right panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card>
                  <CardTitle>Postsecondary Attainment by Region vs. 70% Goal</CardTitle>
                  <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                    Published figures: statewide 63.0%; Metro ~67%; Greater MN ~58% (OHE / MNP20 Annual Report 2025).
                    Suburban interpolated. Regional DE participation rates are <em style={{ color: C.amber }}>not currently published</em> — that is the data gap.
                  </p>
                  <ResponsiveContainer width="100%" height={190}>
                    <BarChart data={geoData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                      <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis domain={[50, 75]} tick={{ fill: C.muted, fontSize: 10 }} />
                      <Tooltip content={<Tt />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="attainment" name="Attainment %" fill={C.blue} radius={[4,4,0,0]} />
                      <ReferenceLine y={70} stroke={C.red} strokeDasharray="5 3" label={{ value: "70% Goal", fill: C.red, fontSize: 9, position: "right" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <CardTitle color={C.red}>Points Below 70% Attainment Goal by Region</CardTitle>
                  <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={geoData} layout="vertical" margin={{ left: 8, right: 36 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                      <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis type="category" dataKey="region" tick={{ fill: C.text, fontSize: 10 }} width={68} />
                      <Tooltip content={<Tt />} />
                      <Bar dataKey="gap" name="Points Below 70% Goal" radius={[0,4,4,0]}>
                        {geoData.map((e,i) => <Cell key={i} fill={[C.green, C.blue, C.red][i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <StatCard label="Statewide Attainment" value="63.0%" sub="OHE Educating for the Future 2023 · published" color={C.blue} />
                  <StatCard label="Still Needed" value="99,514" sub="Additional credentialed adults to reach 70% goal" color={C.red} />
                  <StatCard label="Metro Attainment" value="~67%" sub="Near goal · MNP20 Annual Report reference" color={C.green} />
                  <StatCard label="Greater MN Gap" value="~12 pts" sub="~58% attainment · furthest from goal" color={C.orange} />
                </div>
              </div>
            </div>

            <InsightBox color={C.blue}>
              <strong>The Regional Data Gap IS the Pitch:</strong> OHE publishes attainment by race/ethnicity statewide (source: <em>Educating for the Future</em>, Oct 2024). County-level attainment estimates derived from ACS 5-yr data. MDE does not publish DE participation rates by geography — regional disaggregation is the data gap this solution addresses.
              The IDUC committee's Feb–May 2026 metrics work is the moment to define <em>what gets measured</em> at the regional level.
              A LearningMate SLEDS integration layer could produce this map from real data — verified, district-level, updated annually — within the IES grant window (through Aug 2027).
            </InsightBox>
          </div>
        )}

        {/* ── GEOGRAPHIC DE ── */}
        {activeTab === "geode" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Dual Enrollment Participation by County</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 12px" }}>
              County-level DE participation rates reveal significant geographic inequities. Rural counties show substantially lower participation, driven by transportation barriers, counselor capacity constraints, and limited college access.
            </p>
            <div style={{ background: `${C.teal}15`, border: `1px solid ${C.teal}40`, borderRadius: 7, padding: "8px 14px", fontSize: 11, color: C.teal, marginBottom: 16 }}>
              ⚠ MDE does not publish county-level DE participation rates. This simulation demonstrates what SLEDS data integration could reveal.
            </div>

            {/* Map and Charts Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18, alignItems: "start" }}>
              {/* Map */}
              <Card style={{ padding: "18px 18px 14px" }}>
                <CardTitle color={C.teal}>Minnesota Counties: DE Participation Rates</CardTitle>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 12px" }}>
                  Hover over counties to view detailed participation data.
                </p>
                <MNCountyDEMap />

                {/* Legend */}
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>High (≥32%)</span>
                  {["#34D399","#FCD34D","#FB923C","#EF4444"].map((col,i) => (
                    <div key={i} style={{ width: 24, height: 12, background: col, borderRadius: 2, border: `1px solid ${C.faint}` }} />
                  ))}
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Low (&lt;16%)</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 10, color: C.muted, fontStyle: "italic" }}>
                  Simulated · based on regional patterns + college proximity
                </div>
              </Card>

              {/* Right Panel with Charts */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Card>
                  <CardTitle color={C.blue}>DE Participation Rate by Region</CardTitle>
                  <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                    Metro areas lead at 34%; rural counties lag at 18%. A <strong style={{ color: C.teal }}>16-point participation gap</strong> represents a structural equity issue.
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={geodeDEData} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                      <XAxis dataKey="region" tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis domain={[0, 40]} tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "DE Rate %", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                      <Tooltip content={<Tt />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="deRate" name="DE Participation %" fill={C.teal} radius={[4,4,0,0]} />
                      <ReferenceLine y={28} stroke={C.amber} strokeDasharray="5 3" label={{ value: "State Avg 28%", fill: C.amber, fontSize: 9, position: "right" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card>
                  <CardTitle color={C.red}>Gap from State Average (28%) by Region</CardTitle>
                  <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                    Rural counties fall 10 points below the state average, while metro areas exceed it by 6 points.
                  </p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={geodeDEData} layout="vertical" margin={{ left: 8, right: 36 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                      <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Points from State Avg", position: "insideBottom", offset: -4, fill: C.muted, fontSize: 9 }} />
                      <YAxis type="category" dataKey="region" tick={{ fill: C.text, fontSize: 10 }} width={68} />
                      <Tooltip content={<Tt />} />
                      <Bar dataKey="gap" name="Gap from 28%" radius={[0,4,4,0]}>
                        {geodeDEData.map((e,i) => <Cell key={i} fill={[C.green, C.blue, C.red][i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>

            <InsightBox color={C.teal}>
              <strong>Why Geographic Data Matters:</strong> MDE tracks statewide DE participation (~28%) but doesn't publish county or regional breakdowns. This 16-point gap between metro and rural counties represents thousands of students missing opportunities due to structural barriers: transportation costs (rural families), counselor capacity (300:1+ ratios in Greater MN), and college access (proximity to PSEO campuses). Real county-level tracking through SLEDS integration would enable targeted interventions and resource allocation where gaps are largest.
            </InsightBox>
          </div>
        )}

        {/* ── ATTAINMENT GOAL ── */}
        {activeTab === "goal" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>The Gap to 70%: Can DE Close It?</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 18px" }}>Minnesota climbed from 57.5% to 63.5% in 10 years — but 99,514 more adults need credentials to reach 70%. DE expansion could close 25% of that gap.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.blue}>Progress Toward 70% Attainment Goal</CardTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={goalProgressData} margin={{ left: 0, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis domain={[55, 75]} tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Attainment %", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 10 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
                    <Line type="monotone" dataKey="target" name="🎯 70% Goal" stroke={C.red} strokeDasharray="6 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="attainment" name="📈 MN Actual" stroke={C.blue} strokeWidth={3} dot={{ fill: C.blue, r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 12, marginTop: 10, padding: "8px 12px", background: `${C.amber}15`, borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: C.text }}>
                    <strong style={{ color: C.amber }}>Current Rate:</strong> +0.6pts/year · At this pace, won't reach 70% until 2036
                  </div>
                </div>
              </Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Current Status */}
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Where We Are</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.blue, lineHeight: 1, marginBottom: 4 }}>63.5%</div>
                  <div style={{ fontSize: 11, color: C.text }}>Current attainment (2025)</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>+6.0pts gained since 2015</div>
                </div>

                {/* Gap Remaining */}
                <div style={{ background: `${C.red}15`, border: `2px solid ${C.red}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Gap to Close</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.red, lineHeight: 1, marginBottom: 4 }}>6.5pts</div>
                  <div style={{ fontSize: 11, color: C.text }}>= 99,514 more adults</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>Need credentials to reach 70%</div>
                </div>

                {/* DE Impact */}
                <div style={{ background: `${C.green}15`, border: `2px solid ${C.green}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>DE Can Contribute</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.green, lineHeight: 1, marginBottom: 4 }}>+1.6pts</div>
                  <div style={{ fontSize: 11, color: C.text }}>By 2029 with DE expansion</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>25% of remaining gap</div>
                </div>
              </div>
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle>Postsecondary Attainment Gap from 70% Goal — by Region</CardTitle>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 12px" }}>
                Points each region falls short of the 70% postsecondary attainment goal (OHE). Rural counties face the steepest climb. MDE does not publish DE participation rates by geography — that regional disaggregation is the data gap this solution addresses.
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={geoData} layout="vertical" margin={{ left: 8, right: 36 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Points below 70% goal", position: "insideBottom", offset: -2, fill: C.muted, fontSize: 9 }} />
                  <YAxis type="category" dataKey="region" tick={{ fill: C.text, fontSize: 10 }} width={70} />
                  <Tooltip content={<Tt />} />
                  <Bar dataKey="gap" name="Points Below 70% Attainment Goal" radius={[0,4,4,0]}>
                    {geoData.map((e,i) => <Cell key={i} fill={[C.green,C.blue,C.amber,C.red,"#DC2626"][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ── FIRST GEN EARLY WARNING ── */}
        {activeTab === "firstgen" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Early Warning: How DE Participation Predicts Success</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 18px" }}>
              Dual enrollment isn't just about credits — it's a powerful predictor of postsecondary outcomes. Students who participate show stronger academic performance, better attendance, and higher college completion rates.
            </p>

            {/* ═══ SECTION 1: EARLY INDICATORS ═══ */}
            <div style={{ background: `${C.blue}10`, border: `1px solid ${C.blue}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>Section 1 — Early Indicators</div>
              <div style={{ fontSize: 11, color: C.text, marginTop: 2 }}>Academic performance signals during high school</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.green}>GPA Distribution: DE vs Non-Participants</CardTitle>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                  DE participants are 2.8× more likely to have a GPA above 3.5 compared to non-participants.
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={gpaDistributionData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="range" tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "GPA Range →", position: "insideBottom", offset: -4, fill: C.muted, fontSize: 9 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "% of Students", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="deParticipants" name="🟢 DE Participants" fill={C.green} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonDE" name="🔴 Non-Participants" fill={C.red} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: `${C.green}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.green }}>56% of DE participants</strong> have GPAs above 3.0, compared to just 27% of non-participants.
                </div>
              </Card>

              <Card>
                <CardTitle color={C.blue}>Attendance Trends: Junior & Senior Year</CardTitle>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                  DE students maintain consistently higher attendance rates throughout their final two years.
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={attendanceData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="semester" tick={{ fill: C.muted, fontSize: 9 }} />
                    <YAxis domain={[85, 100]} tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "Attendance %", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="deRate" name="🟢 DE Participants" stroke={C.green} strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="nonDERate" name="🔴 Non-Participants" stroke={C.red} strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: `${C.blue}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.blue }}>+6.8 percentage points</strong> average attendance advantage for DE students across all four semesters.
                </div>
              </Card>
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle color={C.amber}>Course Completion Rates</CardTitle>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                DE participants complete courses at significantly higher rates, with fewer withdrawals and failures.
              </p>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={courseCompletionData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis type="category" dataKey="category" tick={{ fill: C.text, fontSize: 10 }} width={140} />
                      <Tooltip content={<Tt />} />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="complete" name="✓ Complete" fill={C.green} stackId="a" />
                      <Bar dataKey="withdraw" name="⊘ Withdraw" fill={C.amber} stackId="a" />
                      <Bar dataKey="fail" name="✗ Fail" fill={C.red} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ width: 220 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.green, lineHeight: 1 }}>94%</div>
                    <div style={{ fontSize: 11, color: C.text, marginTop: 4 }}>DE completion rate</div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: C.red, lineHeight: 1 }}>82%</div>
                    <div style={{ fontSize: 11, color: C.text, marginTop: 4 }}>Non-DE completion rate</div>
                  </div>
                  <div style={{ padding: "8px 10px", background: `${C.green}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                    <strong style={{ color: C.green }}>+12pts</strong> completion advantage
                  </div>
                </div>
              </div>
            </Card>

            {/* ═══ SECTION 2: POSTSECONDARY MOMENTUM SIGNALS ═══ */}
            <div style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>Section 2 — Postsecondary Momentum Signals</div>
              <div style={{ fontSize: 11, color: C.text, marginTop: 2 }}>College enrollment, credit accumulation, and persistence outcomes</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.teal}>College Enrollment Likelihood</CardTitle>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                  DE participants enroll in college at much higher rates — and are 1.9× more likely to attend 4-year institutions.
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={collegeEnrollmentData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="outcome" tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "% of Students", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="deParticipants" name="🟢 DE Participants" fill={C.green} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonDE" name="🔴 Non-Participants" fill={C.red} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: `${C.teal}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.teal }}>90% of DE participants</strong> enroll in college vs. 70% of non-participants — a 20-point enrollment gap.
                </div>
              </Card>

              <Card>
                <CardTitle color={C.lime}>College Credits Earned Before Graduation</CardTitle>
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                  DE students enter college with substantial credit advantages, accelerating their path to completion.
                </p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={creditsEarnedData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="credits" tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "College Credits Earned →", position: "insideBottom", offset: -4, fill: C.muted, fontSize: 9 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "% of Students", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="deParticipants" name="🟢 DE Participants" fill={C.green} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nonDE" name="🔴 Non-Participants" fill={C.red} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 10, padding: "8px 12px", background: `${C.lime}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.lime }}>61% of DE students</strong> enter college with 16+ credits, compared to just 20% of non-participants.
                </div>
              </Card>
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle color={C.purple}>Persistence Into Year 2 of College</CardTitle>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 10px" }}>
                DE participants show significantly stronger persistence rates, staying enrolled at higher rates through the critical first two years.
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={persistenceData} margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                  <XAxis dataKey="term" tick={{ fill: C.muted, fontSize: 10 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: C.muted, fontSize: 10 }} label={{ value: "% Still Enrolled", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 9 }} />
                  <Tooltip content={<Tt />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" dataKey="de" name="🟢 DE Participants" stroke={C.green} fill={C.green} fillOpacity={0.25} strokeWidth={3} />
                  <Area type="monotone" dataKey="nonDE" name="🔴 Non-Participants" stroke={C.red} fill={C.red} fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <div style={{ flex: 1, padding: "8px 12px", background: `${C.green}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.green }}>84% of DE participants</strong> are still enrolled in Spring Year 2, compared to 65% of non-participants.
                </div>
                <div style={{ flex: 1, padding: "8px 12px", background: `${C.purple}15`, borderRadius: 6, fontSize: 10, color: C.text }}>
                  <strong style={{ color: C.purple }}>19-point persistence gap</strong> between DE and non-DE students by the end of Year 2.
                </div>
              </div>
            </Card>

            {/* ═══ SECTION 3: RISK FLAGS ═══ */}
            <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}30`, borderRadius: 8, padding: "10px 14px", marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.red }}>Section 3 — Risk Flags: Students Who Need Support</div>
              <div style={{ fontSize: 11, color: C.text, marginTop: 2 }}>Early warning indicators for intervention</div>
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle color={C.amber}>Student Cohorts Requiring Immediate Support</CardTitle>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 14px" }}>
                These cohorts show multiple risk indicators — low credit accumulation, course withdrawals, or inconsistent attendance. Early intervention can prevent dropout.
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.faint}` }}>
                      <th style={{ textAlign: "left", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Cohort</th>
                      <th style={{ textAlign: "center", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Students</th>
                      <th style={{ textAlign: "center", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Avg Credits</th>
                      <th style={{ textAlign: "center", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Withdrawals</th>
                      <th style={{ textAlign: "center", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Attendance</th>
                      <th style={{ textAlign: "center", padding: "8px 10px", color: C.muted, fontWeight: 600 }}>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskStudentsData.map((cohort, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.faint}` }}>
                        <td style={{ padding: "10px", color: C.text }}>{cohort.name}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: C.text, fontWeight: 600 }}>{cohort.students}</td>
                        <td style={{ padding: "10px", textAlign: "center", color: cohort.creditsEarned < 5 ? C.red : cohort.creditsEarned < 8 ? C.amber : C.green }}>
                          {cohort.creditsEarned}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center", color: cohort.withdrawals > 2 ? C.red : cohort.withdrawals > 0 ? C.amber : C.green }}>
                          {cohort.withdrawals}
                        </td>
                        <td style={{ padding: "10px", textAlign: "center", color: cohort.attendance < 88 ? C.red : cohort.attendance < 92 ? C.amber : C.green }}>
                          {cohort.attendance}%
                        </td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: 4,
                            fontSize: 10,
                            fontWeight: 600,
                            background: cohort.riskLevel === "high" ? `${C.red}20` : cohort.riskLevel === "medium" ? `${C.amber}20` : `${C.green}20`,
                            color: cohort.riskLevel === "high" ? C.red : cohort.riskLevel === "medium" ? C.amber : C.green,
                            textTransform: "uppercase"
                          }}>
                            {cohort.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
              <div style={{ background: `${C.red}15`, border: `2px solid ${C.red}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>🚨 Critical Risk</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.red, lineHeight: 1, marginBottom: 4 }}>630</div>
                <div style={{ fontSize: 11, color: C.text, marginBottom: 8 }}>Students with &lt;5 credits + multiple risk factors</div>
                <div style={{ fontSize: 10, background: C.red, color: "#FFF", padding: "5px 10px", borderRadius: 4, display: "inline-block" }}>
                  Immediate intervention
                </div>
              </div>

              <div style={{ background: `${C.amber}15`, border: `2px solid ${C.amber}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>⚠️ Moderate Risk</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.amber, lineHeight: 1, marginBottom: 4 }}>1,020</div>
                <div style={{ fontSize: 11, color: C.text, marginBottom: 8 }}>Students with 1-2 warning indicators</div>
                <div style={{ fontSize: 10, background: C.amber, color: "#000", padding: "5px 10px", borderRadius: 4, display: "inline-block" }}>
                  Monitor closely
                </div>
              </div>

              <div style={{ background: `${C.green}15`, border: `2px solid ${C.green}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>✓ On Track</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: C.green, lineHeight: 1, marginBottom: 4 }}>890</div>
                <div style={{ fontSize: 11, color: C.text, marginBottom: 8 }}>Students meeting all benchmarks</div>
                <div style={{ fontSize: 10, background: C.green, color: "#000", padding: "5px 10px", borderRadius: 4, display: "inline-block" }}>
                  Continue support
                </div>
              </div>
            </div>

            <InsightBox color={C.blue}>
              <strong>Policy Implication:</strong> DE participation serves as a powerful leading indicator for postsecondary success. Students who participate show stronger academic habits, higher college enrollment rates, and better persistence — making DE expansion a high-leverage policy tool for improving statewide attainment. Early warning systems can identify at-risk cohorts before they fall too far behind, enabling targeted interventions.
            </InsightBox>
          </div>
        )}

        {/* ── INCOME & SAVINGS ── */}
        {activeTab === "income" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Family Income & Net Cost Savings Calculator</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px" }}>DE is nominally "no-cost," but hidden costs — transportation, materials, lost family income — disproportionately burden lower-income and rural families. This module models net economic value of DE by income band.</p>
            <div style={{ background: `${C.amber}15`, border: `1px solid ${C.amber}40`, borderRadius: 7, padding: "8px 14px", fontSize: 11, color: C.amber, marginBottom: 18 }}>
              ⚠ Requires connecting MDE free/reduced lunch data + DE participation records + transportation/cost surveys. Net savings model uses OHE published tuition averages.
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle color={C.amber}>Hidden Cost Breakdown by Geography</CardTitle>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={hiddenCostData} margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                  <XAxis dataKey="cost" tick={{ fill: C.muted, fontSize: 9 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
                  <Tooltip content={<Tt />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="rural" name="Rural ($)" fill={C.red} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="suburban" name="Suburban ($)" fill={C.amber} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="metro" name="Metro ($)" fill={C.blue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Card>
                <CardTitle color={C.green}>Long-Term Earnings Trajectory: DE vs. Non-DE</CardTitle>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={roiData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="year" tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="nonDE" name="Non-DE Earnings" stroke={C.muted} fill={C.muted} fillOpacity={0.15} strokeWidth={1.5} />
                    <Area type="monotone" dataKey="deStudent" name="DE Student Earnings" stroke={C.green} fill={C.green} fillOpacity={0.25} strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {incomeSavingsData.map((b, i) => (
                  <StatCard key={i} label={b.band} value={`$${b.net.toLocaleString()}`}
                    sub={`Net benefit · ${b.participation}% participation · ${b.avgCredits} avg credits`}
                    color={b.net > 2000 ? C.green : b.net > 1000 ? C.blue : C.red} />
                ))}
              </div>
            </div>
            <InsightBox color={C.green}><strong>Legislative ROI Argument:</strong> The lowest-income families experience the smallest net benefit from DE — not because they save less per credit, but because hidden costs consume a larger share. A targeted transportation/materials stipend of ~$600 would nearly double the net benefit for families under $30K, at minimal state cost. This data makes that case quantitatively.</InsightBox>
          </div>
        )}

        {/* ── EMPLOYER SIGNALS ── */}
        {activeTab === "employer" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Employer Signals Dashboard</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px" }}>Connecting DEED labor market data to DE course completion by pathway. Which DE pathways lead to in-demand regional jobs? Bridges DE policy to Governor Walz's "Drive for Five" workforce priorities.</p>
            <div style={{ background: `${C.teal}15`, border: `1px solid ${C.teal}40`, borderRadius: 7, padding: "8px 14px", fontSize: 11, color: C.teal, marginBottom: 18 }}>
              ⚠ Requires linking MDE/Minnesota State DE completion records by subject area → DEED labor market data by occupation and region. MNP20's IWA partnership creates the cross-agency access pathway.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.teal}>DE Graduate Supply vs. Open Job Demand by Pathway</CardTitle>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={employerData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="pathway" tick={{ fill: C.muted, fontSize: 9 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="openJobs" name="Open Jobs" fill={C.red} opacity={0.7} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deGrads" name="DE Pathway Completers" fill={C.green} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle color={C.teal}>Employer Demand Index by Region & Sector</CardTitle>
                <ResponsiveContainer width="100%" height={270}>
                  <RadarChart data={regionalDemandData}>
                    <PolarGrid stroke={C.faint} />
                    <PolarAngleAxis dataKey="region" tick={{ fill: C.muted, fontSize: 9 }} />
                    <PolarRadiusAxis tick={{ fill: C.muted, fontSize: 8 }} />
                    <Radar name="Healthcare" dataKey="healthcare" stroke={C.red} fill={C.red} fillOpacity={0.15} />
                    <Radar name="Tech" dataKey="tech" stroke={C.blue} fill={C.blue} fillOpacity={0.15} />
                    <Radar name="Trades" dataKey="trades" stroke={C.amber} fill={C.amber} fillOpacity={0.15} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Tooltip content={<Tt />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
              {employerData.filter(e => e.gap > 2000).map((e, i) => (
                <StatCard key={i} label={`${e.pathway} Gap`} value={e.gap.toLocaleString()}
                  sub={`Unfilled jobs · $${(e.wage / 1000).toFixed(0)}K avg wage · ${e.growth}% growth`}
                  color={e.gap > 4000 ? C.red : C.amber} />
              ))}
            </div>
            <InsightBox color={C.teal}><strong>Drive for Five Alignment:</strong> The technology gap (5,560 unfilled jobs vs. 1,240 DE completers) and trades gap (4,780 unfilled) are highest in the regions where DE participation is lowest. Connecting DE pathway expansion to regional employer demand gives Minnesota a workforce investment narrative, not just an equity narrative — which matters for bipartisan legislative support.</InsightBox>
          </div>
        )}

        {/* ── PSEO VS CONCURRENT ── */}
        {activeTab === "pseo" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>PSEO vs. Concurrent Enrollment: Equity Comparison</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 4px" }}>Minnesota has two DE models: PSEO (student goes to campus) and concurrent enrollment (college instructor comes to the HS). They serve different populations with different outcomes. No side-by-side equity analysis currently exists in public Minnesota reporting.</p>
            <div style={{ background: `${C.purple}15`, border: `1px solid ${C.purple}40`, borderRadius: 7, padding: "8px 14px", fontSize: 11, color: `${C.purple}dd`, marginBottom: 18 }}>
              ⚠ PSEO data (OHE) and concurrent enrollment data (Minnesota State / MnCEP) are not currently joined. This comparison requires a data linkage that does not yet exist in standardized form.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
              <Card>
                <CardTitle color={C.purple}>PSEO vs. Concurrent: Who Is Each Model Serving?</CardTitle>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={pseoVsConcurrent} layout="vertical" margin={{ left: 8, right: 28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: C.muted, fontSize: 10 }} />
                    <YAxis type="category" dataKey="metric" tick={{ fill: C.text, fontSize: 9 }} width={150} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="pseo" name="PSEO" fill={C.blue} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="concurrent" name="Concurrent Enrollment" fill={C.purple} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardTitle color={C.purple}>PSEO vs. Concurrent Participation by Race/Ethnicity</CardTitle>
                <ResponsiveContainer width="100%" height={270}>
                  <BarChart data={pseoOutcomeData} margin={{ left: 0, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.faint} />
                    <XAxis dataKey="group" tick={{ fill: C.muted, fontSize: 9 }} />
                    <YAxis tick={{ fill: C.muted, fontSize: 10 }} />
                    <Tooltip content={<Tt />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="pseoRate" name="PSEO Rate %" fill={C.blue} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="concurrentRate" name="Concurrent Rate %" fill={C.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card style={{ marginBottom: 18 }}>
              <CardTitle color={C.purple}>The Trade-Off: Quality vs. Access</CardTitle>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 14px" }}>
                PSEO wins on academic quality; Concurrent wins on equity. Policy implication: invest in raising Concurrent quality, not expanding PSEO.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {/* PSEO Strengths */}
                <div style={{ background: `${C.blue}15`, border: `2px solid ${C.blue}`, borderRadius: 8, padding: "14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.blue, marginBottom: 10 }}>✓ PSEO Strengths</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "Transfer Rate", value: "87%" },
                      { label: "Instructor Credentials", value: "94%" },
                      { label: "Credit Acceptance", value: "92%" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.text }}>{item.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.blue }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 10, color: C.muted, fontStyle: "italic" }}>
                    But serves only 16% BIPOC, 12% rural students
                  </div>
                </div>

                {/* Concurrent Strengths */}
                <div style={{ background: `${C.purple}15`, border: `2px solid ${C.purple}`, borderRadius: 8, padding: "14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 10 }}>✓ Concurrent Strengths</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "BIPOC Access", value: "22%" },
                      { label: "Rural Access", value: "34%" },
                      { label: "Cost to Families", value: "$0" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.text }}>{item.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.purple }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 10, color: C.muted, fontStyle: "italic" }}>
                    But transfer rate only 71%, lower quality control
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 12px", background: `${C.green}15`, borderRadius: 6, borderLeft: `3px solid ${C.green}` }}>
                <div style={{ fontSize: 11, color: C.text }}>
                  <strong style={{ color: C.green }}>Policy Recommendation:</strong> Don't expand PSEO — it already serves affluent students well. Instead, invest $2.5M to bring Concurrent quality standards (instructor training, curriculum alignment) up to PSEO levels while maintaining its superior access.
                </div>
              </div>
            </Card>
            <InsightBox color={C.purple}><strong>Key Finding:</strong> PSEO produces better academic outcomes (transfer rates, completion) but concurrent enrollment is far more accessible to BIPOC, rural, and first-gen students. The policy implication is clear: invest in raising concurrent enrollment quality rather than expanding PSEO alone. This data makes that case — and currently no Minnesota report presents it this way.</InsightBox>
          </div>
        )}

        {/* ── DATA ARCHITECTURE ── */}
        {activeTab === "integration" && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 400, color: C.header, margin: "0 0 4px" }}>Minnesota P-20W Data Integration Architecture</h2>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 18px" }}>How a connected data integration layer links existing Minnesota systems — and closes the gaps identified across all 10 dashboard modules.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16, marginBottom: 18 }}>
              {/* Source systems */}
              <div>
                <div style={{ fontSize: 10, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 10 }}>◉ Existing Systems — Siloed</div>
                {[
                  { name: "MDE / SIS", desc: "K-12 enrollment, demographics, FRL" },
                  { name: "Minnesota State", desc: "Concurrent enrollment records" },
                  { name: "U of M / PSEO", desc: "PSEO participation data" },
                  { name: "OHE / SLEDS", desc: "HS graduate outcomes, attainment" },
                  { name: "DEED", desc: "Workforce & wage data" },
                  { name: "ECLDS", desc: "Early childhood longitudinal data" },
                  { name: "MDE Staffing", desc: "Counselor ratios by district" },
                  { name: "Inst. Transcripts", desc: "Credit acceptance at receiving colleges" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#111827", border: `1px solid #374151`, borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: "#4B5563" }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* Integration hub */}
              <div style={{ background: "linear-gradient(135deg, #0D2144, #1E3A5F)", border: `1px solid ${C.blue}`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 12, textAlign: "center" }}>⬡ P-20W Integration Hub — LearningMate</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  {["Secure student ID crosswalk", "Automated ETL pipelines", "Demographic normalization", "Privacy-preserving linkage", "FERPA-compliant access tiers", "Real-time & batch processing", "Cross-state benchmarking API", "Legislative report automation"].map((f, i) => (
                    <div key={i} style={{ fontSize: 10, color: "#93C5FD", padding: "6px 8px", background: `${C.blue}12`, borderRadius: 4 }}>✓ {f}</div>
                  ))}
                </div>
                <div style={{ borderTop: `1px solid ${C.faint}`, paddingTop: 12, marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: C.muted, marginBottom: 8, textAlign: "center" }}>Enables these 9 Dashboard Modules</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Equity Gaps", "Pipeline", "Geographic", "Geographic DE", "Attainment Goal", "Early Warning", "Cost & Savings", "Employer Signals", "PSEO vs. Concurrent"].map((m, i) => (
                      <span key={i} style={{ fontSize: 9, background: `${C.green}18`, color: C.green, borderRadius: 3, padding: "3px 7px" }}>{m}</span>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 10, color: C.blue, fontStyle: "italic", textAlign: "center" }}>
                  Cross-state SLDS experience: NM, OH, OR, TN, VA, WA cohort states
                </div>
              </div>

              {/* Outputs */}
              <div>
                <div style={{ fontSize: 10, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 10 }}>◉ New Capabilities Unlocked</div>
                {[
                  { name: "This Dashboard", desc: "Real-time equity & pipeline reporting", color: C.green },
                  { name: "IDUC Metrics", desc: "Strategic plan metric tracking", color: C.blue },
                  { name: "Legislative Reports", desc: "Automated OHE/MDE annual reporting", color: C.purple },
                  { name: "District Benchmarking", desc: "School-level DE performance", color: C.amber },
                  { name: "CHSA Peer Comparison", desc: "vs. 6 national cohort states", color: C.teal },
                  { name: "Counselor Alerts", desc: "Early warning to district staff", color: C.orange },
                  { name: "Employer Match", desc: "DE pathway to job demand", color: C.pink },
                  { name: "Attainment Tracker", desc: "Progress toward new state goal", color: C.lime },
                ].map((s, i) => (
                  <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}35`, borderLeft: `3px solid ${s.color}`, borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: "#4B5563" }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <Card>
              <CardTitle>Proposed Engagement Timeline — Aligned to MNP20 2026 Priorities</CardTitle>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { phase: "Q1 2026", label: "Discovery", desc: "Stakeholder mapping, SLEDS/ECLDS data audit, IDUC committee engagement, IRB/FERPA planning", color: C.blue },
                  { phase: "Q2 2026", label: "Pilot Design", desc: "Integration architecture, pilot district selection, cross-agency MOU drafting, metric alignment with strategic plan", color: C.purple },
                  { phase: "Q3 2026", label: "Build & Test", desc: "Data pipeline development, dashboard iteration with IDUC, early warning model training, credit leakage audit", color: C.green },
                  { phase: "Q4 2026", label: "Launch", desc: "Live dashboard, legislative report support, CHSA cohort benchmarking, counselor alert system rollout", color: C.amber },
                ].map((p, i) => (
                  <div key={i} style={{ background: `${p.color}12`, border: `1px solid ${p.color}35`, borderTop: `3px solid ${p.color}`, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ fontSize: 9, color: p.color, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{p.phase}</div>
                    <div style={{ fontSize: 13, color: C.header, fontWeight: 700, margin: "4px 0" }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ padding: "12px 24px", borderTop: `1px solid ${C.faint}`, display: "flex", justifyContent: "space-between", background: "#0A1628", fontSize: 10, color: "#334155" }}>
        <div>Data sources: MNP20 2025 Annual Report, OHE, SLEDS, ECLDS, DEED, National DE Research · Modeled data for illustrative purposes</div>
        <div style={{ color: "#1E4A8C" }}>LearningMate · Ed Tech Data Integration · P-20W Systems</div>
      </div>
    </div>
  );
}
