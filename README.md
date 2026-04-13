# Fortly

A mobile personal finance app built with React Native & Expo. Track expenses, manage envelope budgets, set savings goals, monitor investments, and get AI-powered financial advice — all in one place.

## Features

### Dashboard
Central hub with monthly spending summary, budget allocation gauges (needs/wants/savings), investment holdings overview, goal progress cards, and daily AI-generated financial insights.

### Transactions
Log expenses with 11 categorized spending types. View transactions in a calendar or list layout with month-by-month navigation. Each transaction can be tagged as "wants" spending for envelope budget tracking.

### Envelope Budgeting
Built-in budget strategy system with presets (50/30/20, 60/20/20, 70/20/10) or fully custom allocation via percentages or fixed amounts. Animated circular gauges show real-time budget vs. actual spending per category. A dedicated envelope detail screen breaks down discretionary spending by category.

### Goals
Create savings goals or debt payoff targets with custom colors and icons. Track progress with animated circular gauges, milestone badges, and contribution history. Add contributions anytime and watch progress update in real-time.

### Investments
Log investments across stocks, ETFs, and crypto with 12 quick-select ticker presets (VOO, SPY, BTC-USD, AAPL, etc.) or custom tickers. Live price tracking with real-time change indicators. Portfolio aggregation by ticker on the dashboard.

### AI Financial Advisor
Chat-based financial advisor powered by Google Gemini. The AI has full context of your income, budget strategy, spending patterns, goals, and investments to provide personalized advice. Includes suggested prompts for first-time users and persistent chat history.

### Settings
Configure monthly net income, select or customize budget strategies, and manage app data. Supports percentage-based and fixed-amount budget allocation modes.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) / React Native |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Styling | [NativeWind](https://www.nativewind.dev) (Tailwind CSS) |
| State | [Zustand](https://zustand-demo.pmnd.rs) + AsyncStorage persistence |
| AI | Google Gemini API |
| Animations | React Native Reanimated |
| Icons | Feather, Lucide |
| Typography | Inter (400–700) |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
git clone https://github.com/maciejwiacek/Fortly.git
cd Fortly
npm install
```

### Environment

Create a `.env` file in the project root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Run

```bash
npx expo start
```

Then press `i` for iOS simulator or `a` for Android emulator.

## Project Structure

```
app/
  (tabs)/
    index.tsx          # Dashboard
    transactions.tsx   # Transaction list & calendar
    goals.tsx          # Goals & investments
    advisor.tsx        # AI financial advisor
    settings.tsx       # App settings
  add-transaction.tsx  # Add expense / goal contribution / investment
  envelope.tsx         # Envelope budget detail
components/
  advisor/             # Chat UI components
  dashboard/           # Dashboard cards & gauges
  envelope/            # Envelope gauge & breakdown
  goals/               # Goal cards & creation sheets
  investments/         # Portfolio tracking
  transactions/        # Transaction list, calendar, FAB
  ui/                  # Shared UI primitives
hooks/                 # Custom React hooks
lib/                   # Utilities, AI integration, types
stores/                # Zustand store with persistence
```

## Screenshots

*Coming soon*

## License

This project is for personal/educational use.
