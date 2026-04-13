# AI Financial Companion — Design Spec

## Context

The finance tracker app currently has no AI features. Users manually track expenses, goals, and investments but receive no automated insights or personalized advice. Integrating AI will provide a personal financial advisor experience — helping users save money, optimize budgets, and reach goals faster through both interactive chat and proactive insights.

## Overview

Integrate Google Gemini API (free tier) into the React Native/Expo finance tracker as an "AI Financial Companion" with two surfaces:

1. **Chat tab** ("AI Doradca") — interactive conversation with personalized financial context
2. **Dashboard insights** — proactive daily AI-generated tips and alerts

## API Choice: Google Gemini

- **Model:** `gemini-2.0-flash`
- **Free tier:** 10 req/min, 250K tokens/min, no monthly limit, no credit card
- **Auth:** API key via `EXPO_PUBLIC_GEMINI_API_KEY` environment variable
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Pattern:** Direct `fetch` calls (same pattern as existing `lib/stock-api.ts`)

## Architecture

### 1. Gemini API Client (`lib/gemini-api.ts`)

Functions:
- `chatWithAI(messages: ChatMessage[], financialContext: string): Promise<string>` — sends conversation with financial context as system instruction, returns AI response text
- `generateInsight(insightType: string, financialData: object): Promise<string>` — generates a single insight for the dashboard
- Response cache: 15-minute TTL for identical insight requests (prevents duplicate API calls)
- Error handling: returns `null` on failure, caller handles fallback

### 2. Financial Context Builder (`lib/ai-context.ts`)

Reads current data from `useFinanceStore` and builds a Polish-language system prompt:

```
Jestes osobistym doradca finansowym uzytkownika. Oto jego aktualne dane:
- Dochod miesięczny: {income} zl
- Strategia budzetowa: {strategy} (Potrzeby {needs}% / Przyjemnosci {wants}% / Oszczednosci {savings}%)
- Wydatki w tym miesiacu: {totalSpent} zl
  - Potrzeby: {needsSpent} zl z {needsBudget} zl
  - Przyjemnosci: {wantsSpent} zl z {wantsBudget} zl
  - Oszczednosci: {savingsContributed} zl z {savingsBudget} zl
- Top kategorie: {topCategories}
- Cele oszczednosciowe: {goals with progress %}
- Inwestycje: {holdings with current values}
- Dzien miesiaca: {dayOfMonth}/{daysInMonth}

Odpowiadaj krotko (max 3-4 zdania), konkretnie, po polsku. Podawaj kwoty w zlotych.
Skup sie na praktycznych poradach oszczedzania.
```

Function: `buildFinancialContext(store: FinanceStore): string`

### 3. Chat Store Extension (`stores/finance-store.ts`)

New type:
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // ISO datetime
}
```

New store fields and actions:
- `chatMessages: ChatMessage[]` — persisted chat history
- `addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void`
- `clearChat(): void`

### 4. Chat Screen (`app/(tabs)/advisor.tsx`)

New tab in bottom navigation:
- Icon: `Sparkles` from Lucide React Native
- Label: "AI Doradca"
- Position: 4th tab (after Goals, before Settings). Tab order: Dashboard, Transactions, Goals, AI Doradca, Settings

Screen layout (top to bottom):
1. **Header**: "AI Doradca" with Sparkles icon
2. **Chat messages**: `FlashList` of message bubbles, auto-scrolls to bottom
3. **Suggested prompts** (shown when chat is empty): 4 tappable chips
4. **Input bar**: TextInput + Send button, fixed at bottom

Suggested prompts:
- "Jak moge zaoszczedzic wiecej w tym miesiacu?"
- "Przeanalizuj moje wydatki"
- "Jak przyspieszyc cel oszczednosciowy?"
- "Czy moj budzet jest optymalny?"

Components:
- `components/advisor/ChatMessage.tsx` — message bubble (user: blue `#1E40AF` right-aligned, AI: dark `#192134` left-aligned with Sparkles icon)
- `components/advisor/ChatInput.tsx` — text input with send button
- `components/advisor/SuggestedPrompts.tsx` — grid of 4 prompt chips

States:
- Loading: 3 pulsing dots animation in AI bubble while waiting for response
- Error: "Nie udalo sie polaczyc z AI. Sprobuj ponownie." with retry button
- Empty: Suggested prompts shown

### 5. Dashboard AI Insight (`components/dashboard/AIInsightCard.tsx`)

Single card on dashboard, positioned between SpendingSummaryCard and BudgetAllocation.

Insight types (AI chooses based on data):
1. **Spending Alert** — approaching budget limit warning
2. **Saving Tip** — personalized suggestion to cut spending in specific category
3. **Goal Motivation** — progress encouragement and time estimate
4. **Budget Optimization** — suggestion to adjust budget strategy
5. **Investment Insight** — portfolio performance note

Hook: `hooks/use-ai-insights.ts`
- `useAIInsights(): { insight: string | null, isLoading: boolean, refresh: () => void }`
- Generates 1 insight on first dashboard open each day
- Caches in AsyncStorage with key `ai-insight-YYYY-MM-DD`
- Fallback: predefined tips array (no AI) if offline or API error

Card design:
- Subtle gradient border (blue to purple)
- Sparkles icon top-left
- 2-3 lines of insight text
- "Nowa podpowiedz" button to regenerate

## New Files Summary

```
lib/
  gemini-api.ts          — Gemini API client (fetch-based)
  ai-context.ts          — Financial context builder

hooks/
  use-ai-insights.ts     — Dashboard insight generation + caching

app/(tabs)/
  advisor.tsx            — AI Doradca chat screen

components/advisor/
  ChatMessage.tsx        — Chat bubble component
  ChatInput.tsx          — Text input + send button
  SuggestedPrompts.tsx   — Suggested prompt chips
  
components/dashboard/
  AIInsightCard.tsx      — Dashboard insight card
```

## Modified Files

- `app/(tabs)/_layout.tsx` — add Advisor tab (Sparkles icon, between Goals and Settings)
- `stores/finance-store.ts` — add `chatMessages`, `addChatMessage()`, `clearChat()`
- `lib/types.ts` (if exists, or in store) — add `ChatMessage` type
- `app/(tabs)/index.tsx` — add `AIInsightCard` to dashboard
- `.gitignore` — ensure `.env.local` is ignored

## Environment Setup

New file `.env.local`:
```
EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

No new npm packages required — uses native `fetch`.

## Verification Plan

1. **API connectivity**: Add Gemini API key, call `chatWithAI()` with test message, verify response
2. **Context builder**: Log the generated system prompt, verify it contains correct financial data from store
3. **Chat screen**: Open AI Doradca tab, send a message, verify AI responds with financial context
4. **Suggested prompts**: Tap a suggested prompt, verify it sends to AI and shows response
5. **Chat persistence**: Send messages, close app, reopen — verify chat history persists
6. **Dashboard insight**: Open dashboard, verify AIInsightCard appears with generated insight
7. **Insight caching**: Close and reopen dashboard same day — verify cached insight shown (no API call)
8. **Insight refresh**: Tap "Nowa podpowiedz" — verify new insight generated
9. **Offline fallback**: Disable network, open dashboard — verify predefined fallback tip shown
10. **Error handling**: Use invalid API key, verify chat shows error message with retry
11. **Tab navigation**: Verify AI Doradca tab appears correctly between Goals and Settings
