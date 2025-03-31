# FinInsight_Platform


A sophisticated financial analysis platform that combines machine learning with user-friendly interfaces to provide loan eligibility predictions and customer segmentation insights.

## Features

### 1. Loan Eligibility Checker
- Advanced ML-powered loan eligibility assessment
- Real-time prediction with comprehensive input parameters
- Detailed financial profile analysis
- User-friendly form interface with input validation

### 2. Customer Segmentation Analysis
- Interactive 3D visualization of financial segments
- K-means clustering for customer categorization
- Multiple segment profiles:
  - Mid Income/Loan
  - High Value
  - Dense Core
  - Special Cases
- Detailed segment descriptions and insights

### 3. Authentication System
- Secure user authentication with Firebase
- Multiple sign-in options:
  - Email/Password authentication
  - Google Sign-in integration
- Protected routes for authenticated users

## Technology Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (for icons)
- Plotly.js (for 3D visualizations)
- React Router DOM (for routing)

### Backend Integration
- RESTful API integration
- Firebase Authentication
- Real-time data processing

### Development Tools
- Vite
- ESLint
- PostCSS
- TypeScript configuration

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
```
project/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/      # React context providers
│   ├── firebase/     # Firebase configuration
│   ├── pages/        # Main application pages
│   └── App.tsx       # Root component
├── public/           # Static assets
└── config files      # Various configuration files
```
