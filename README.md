# Minnesota Dual Enrollment Dashboard

A comprehensive policy dashboard for analyzing dual enrollment participation, equity gaps, and postsecondary outcomes across Minnesota.

## Overview

This interactive dashboard demonstrates the potential of connected data systems to inform dual enrollment policy decisions. It simulates insights that would be available through integrated SLEDS (Statewide Longitudinal Education Data System) data, showing participation patterns, equity gaps, and predictive indicators across Minnesota counties and demographic groups.

## Features

### Dashboard Modules

1. **Equity Gaps** - Demographic analysis of dual enrollment participation and postsecondary attainment by race/ethnicity
2. **Pipeline Analysis** - Longitudinal tracking of student progression from high school through college to career
3. **Geographic Analysis** - County and regional DE participation rates
4. **Geographic DE** - Interactive county-level map showing dual enrollment participation patterns
5. **Attainment Goal** - Progress toward Minnesota's 70% postsecondary attainment goal
6. **Early Warning** - Predictive indicators showing how DE participation correlates with postsecondary success
7. **Cost & Savings** - Analysis of DE program economics and family cost savings
8. **Employer Signals** - Workforce demand and credential value analysis
9. **PSEO vs Concurrent** - Comparison of dual enrollment program models
10. **Data Architecture** - Proposed integration layer for P-20W data systems

### Key Visualizations

- Interactive county maps with hover tooltips
- Demographic participation gap analysis
- Longitudinal cohort tracking
- Predictive success indicators
- Regional equity comparisons

## Technology Stack

- **React 19** - UI framework
- **Vite 8** - Build tool and dev server
- **Recharts 3.8** - Data visualization library
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

### Project Structure

```
mn-dashboard/
├── src/
│   ├── App.jsx          # Main dashboard component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel dashboard
3. Vercel will automatically detect the Vite configuration
4. Deploy with default settings (build command: `npm run build`, output directory: `dist`)

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

### Manual Deployment

Build and deploy the `dist` folder to any static hosting service:

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## Data Notes

**Important:** All data in this dashboard is simulated or estimated for illustrative purposes. This represents what **could** be available through integrated SLEDS data systems, not actual published Minnesota data.

### Data Sources (Simulated/Estimated)

- County-level DE participation rates - Not published by MDE
- Demographic breakdowns - Estimated from survey data
- Early warning indicators - Modeled from national research
- Regional attainment gaps - Derived from ACS 5-year estimates

### Integration Opportunity

The dashboard demonstrates the policy value of:
- Real-time DE participation tracking by county/region
- Connected K-12 and postsecondary data
- Predictive analytics for student support
- Verified demographic breakdowns

## Policy Context

Created to support Minnesota P-20 Education Partnership discussions on:
- SLEDS data integration opportunities
- Dual enrollment equity and access
- Regional participation gaps
- Postsecondary attainment goals

## Contributing

This is a demonstration/prototype dashboard. For policy questions or data integration inquiries, contact the Minnesota P-20 Education Partnership.

## License

Private - Minnesota P-20 Initiative

---

**Built with React + Vite** | **Powered by Recharts**
