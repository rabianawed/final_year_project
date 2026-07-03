# PhishGuard AI — Project Folder Structure

```
phishguard/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                        # Static assets (images, SVGs, fonts)
│   │   └── logo.svg
│   │
│   ├── components/                    # Reusable UI components
│   │   ├── ui/                        # Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── RiskMeter.tsx
│   │   │
│   │   ├── layout/                    # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── charts/                    # Chart components (Recharts)
│   │   │   ├── ThreatLineChart.tsx
│   │   │   ├── ScanDonutChart.tsx
│   │   │   ├── ThreatHeatMap.tsx
│   │   │   └── AttackTrendChart.tsx
│   │   │
│   │   └── animations/                # Framer Motion wrappers
│   │       ├── PageTransition.tsx
│   │       ├── FadeIn.tsx
│   │       └── GlowPulse.tsx
│   │
│   ├── pages/                         # Route-level page components
│   │   ├── LandingPage.tsx            # Public landing page
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx      # Overview & stats
│   │   │   ├── URLScannerPage.tsx
│   │   │   ├── EmailScannerPage.tsx
│   │   │   ├── WebsiteScannerPage.tsx
│   │   │   ├── ThreatIntelPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── admin/
│   │   │   └── AdminPanelPage.tsx
│   │   │
│   │   └── extension/
│   │       └── ExtensionPopup.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useAuth.ts
│   │   ├── useScan.ts
│   │   ├── useNotifications.ts
│   │   └── useDebounce.ts
│   │
│   ├── services/                      # API service layer
│   │   ├── api.ts                     # Axios instance & interceptors
│   │   ├── authService.ts
│   │   ├── scanService.ts
│   │   ├── threatService.ts
│   │   └── reportService.ts
│   │
│   ├── types/                         # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── scan.types.ts
│   │   ├── threat.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                         # Helper functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── cn.ts                      # className utility (clsx + twMerge)
│   │
│   ├── routes/                        # React Router config
│   │   ├── AppRouter.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routes.ts                  # Route constants
│   │
│   ├── contexts/                      # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── data/                          # Mock/dummy data for development
│   │   ├── mockScans.ts
│   │   ├── mockThreats.ts
│   │   └── mockDashboard.ts
│   │
│   ├── App.tsx                        # Root component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles + Tailwind directives
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```
