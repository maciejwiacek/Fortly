import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFinanceStore } from '../../stores/finance-store';
import { usePortfolioValue } from '../../hooks/use-portfolio-value';
import { formatPLN, getTodayStr } from '../../lib/utils';
import { TICKER_PRESETS } from '../../lib/constants';

// ── Compact version for Dashboard ──

export function DashboardHoldings() {
  const portfolio = usePortfolioValue();

  if (portfolio.holdings.length === 0) return null;

  return (
    <View className="bg-card rounded-2xl p-4 mx-4 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Feather name="trending-up" size={14} color="#94A3B8" />
          <Text className="font-sans-medium text-xs text-muted-foreground ml-1.5">
            Live Holdings
          </Text>
        </View>
        {portfolio.isLoading && <ActivityIndicator size="small" color="#3B82F6" />}
      </View>

      {portfolio.holdings.map((holding) => {
        const price = holding.currentPrice;
        const isUp = price && price.change >= 0;

        return (
          <View
            key={holding.ticker}
            className="flex-row items-center py-2"
            style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}
          >
            <View className="flex-1">
              <Text className="font-sans-semibold text-sm text-foreground">
                {holding.ticker}
              </Text>
              <Text className="font-sans text-xs text-muted-foreground">
                {holding.label}
              </Text>
            </View>
            <View className="items-end">
              <Text className="font-sans-semibold text-sm text-foreground">
                {formatPLN(holding.totalInvested)}
              </Text>
              {price ? (
                <View className="flex-row items-center">
                  {isUp ? (
                    <Feather name="arrow-up-right" size={10} color="#059669" />
                  ) : (
                    <Feather name="arrow-down-right" size={10} color="#DC2626" />
                  )}
                  <Text className={`font-sans text-xs ${isUp ? 'text-success' : 'text-destructive'}`}>
                    {price.changePercent >= 0 ? '+' : ''}
                    {price.changePercent.toFixed(2)}%
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Full version for Goals tab ──

export function InvestmentSection() {
  const investmentEntries = useFinanceStore((s) => s.investmentEntries);
  const deleteInvestment = useFinanceStore((s) => s.deleteInvestment);
  const portfolio = usePortfolioValue();
  const [showAdd, setShowAdd] = useState(false);

  const totalInvested = investmentEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View className="mx-4 mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Feather name="trending-up" size={16} color="#94A3B8" />
          <Text className="font-sans-medium text-xs text-muted-foreground ml-2">
            Investments
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {portfolio.isLoading && <ActivityIndicator size="small" color="#3B82F6" />}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              portfolio.refresh();
            }}
            className="p-1.5"
            hitSlop={8}
          >
            <Feather name="refresh-cw" size={14} color="#94A3B8" />
          </Pressable>
          <Pressable
            onPress={() => setShowAdd(true)}
            className="flex-row items-center bg-card rounded-full px-3 py-1.5"
          >
            <Feather name="plus" size={14} color="#3B82F6" />
            <Text className="font-sans-medium text-xs text-secondary ml-1">Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Total */}
      <View className="bg-card rounded-2xl p-4 mb-2">
        <Text className="font-sans text-xs text-muted-foreground mb-1">Total Invested</Text>
        <Text className="font-sans-bold text-2xl text-foreground">
          {formatPLN(totalInvested)}
        </Text>

        {/* Live Holdings */}
        {portfolio.holdings.length > 0 && (
          <View className="mt-3">
            <Text className="font-sans-medium text-xs text-muted-foreground mb-2">
              Live Prices
            </Text>
            {portfolio.holdings.map((holding) => {
              const price = holding.currentPrice;
              const isUp = price && price.change >= 0;

              return (
                <View
                  key={holding.ticker}
                  className="flex-row items-center py-2.5"
                  style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}
                >
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-sans-semibold text-sm text-foreground">
                        {holding.ticker}
                      </Text>
                      {price && (
                        <Text className="font-sans text-xs text-muted-foreground ml-2">
                          {price.currency} {price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                      )}
                    </View>
                    <Text className="font-sans text-xs text-muted-foreground">
                      {holding.label} · {formatPLN(holding.totalInvested)} invested
                    </Text>
                  </View>

                  {price ? (
                    <View className="flex-row items-center">
                      {isUp ? (
                        <Feather name="arrow-up-right" size={14} color="#059669" />
                      ) : (
                        <Feather name="arrow-down-right" size={14} color="#DC2626" />
                      )}
                      <Text
                        className={`font-sans-semibold text-sm ml-0.5 ${
                          isUp ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {price.changePercent >= 0 ? '+' : ''}
                        {price.changePercent.toFixed(2)}%
                      </Text>
                    </View>
                  ) : (
                    <Text className="font-sans text-xs text-muted-foreground">...</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Entry log */}
      {investmentEntries.slice(0, 5).map((entry) => (
        <View key={entry.id} className="bg-card rounded-xl px-4 py-3 mb-1.5 flex-row items-center">
          <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(5,150,105,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Feather name="trending-up" size={16} color="#059669" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="font-sans-medium text-sm text-foreground">{entry.label}</Text>
              {entry.ticker && (
                <View className="bg-background rounded px-1.5 py-0.5 ml-2">
                  <Text className="font-sans text-xs text-secondary">{entry.ticker}</Text>
                </View>
              )}
            </View>
            <Text className="font-sans text-xs text-muted-foreground">
              {entry.date}{entry.note ? ` · ${entry.note}` : ''}
            </Text>
          </View>
          <Text className="font-sans-semibold text-sm text-success mr-2">
            {formatPLN(entry.amount)}
          </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              deleteInvestment(entry.id);
            }}
            className="p-1"
            hitSlop={8}
          >
            <Feather name="trash-2" size={14} color="#94A3B8" />
          </Pressable>
        </View>
      ))}

      {investmentEntries.length === 0 && (
        <View className="items-center py-4">
          <Text className="font-sans text-sm text-muted-foreground">
            No investments logged yet
          </Text>
        </View>
      )}

      {showAdd && <AddInvestmentModal onClose={() => setShowAdd(false)} />}
    </View>
  );
}

// ── Add Investment Modal (simplified) ──

function AddInvestmentModal({ onClose }: { onClose: () => void }) {
  const addInvestment = useFinanceStore((s) => s.addInvestment);
  const [label, setLabel] = useState('');
  const [ticker, setTicker] = useState('');
  const [amountText, setAmountText] = useState('');
  const [note, setNote] = useState('');

  const handlePresetSelect = (preset: (typeof TICKER_PRESETS)[0]) => {
    setTicker(preset.ticker);
    setLabel(preset.label);
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    const amount = parseFloat(amountText.replace(',', '.'));
    if (!label.trim() || isNaN(amount) || amount <= 0) return;

    addInvestment({
      label: label.trim(),
      amount: Math.round(amount * 100),
      date: getTodayStr(),
      note: note.trim() || undefined,
      ticker: ticker.trim().toUpperCase() || undefined,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  const isValid = label.trim().length > 0 && (() => {
    const num = parseFloat(amountText.replace(',', '.'));
    return !isNaN(num) && num > 0;
  })();

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-card rounded-t-3xl px-4 pb-10 pt-4" style={{ maxHeight: '85%' }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-sans-semibold text-lg text-foreground">Log Investment</Text>
            <Pressable onPress={onClose} className="p-2" hitSlop={8}>
              <Feather name="x" size={20} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Ticker presets */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Pick Asset
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {TICKER_PRESETS.map((preset) => (
                  <Pressable
                    key={preset.ticker}
                    onPress={() => handlePresetSelect(preset)}
                    className={`rounded-xl px-3 py-2 ${
                      ticker === preset.ticker ? 'bg-primary' : 'bg-background'
                    }`}
                  >
                    <Text className={`font-sans-semibold text-xs ${
                      ticker === preset.ticker ? 'text-white' : 'text-foreground'
                    }`}>
                      {preset.ticker}
                    </Text>
                    <Text className={`font-sans text-xs ${
                      ticker === preset.ticker ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {preset.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Custom ticker */}
            <TextInput
              value={ticker}
              onChangeText={setTicker}
              placeholder="Or type ticker (VOO, BTC-USD...)"
              placeholderTextColor="#64748B"
              autoCapitalize="characters"
              className="bg-background rounded-xl px-4 py-3 font-sans-medium text-base text-foreground mb-3"
              selectionColor="#3B82F6"
            />

            {/* Label */}
            <TextInput
              value={label}
              onChangeText={setLabel}
              placeholder="Name (e.g. S&P 500 via XTB)"
              placeholderTextColor="#64748B"
              className="bg-background rounded-xl px-4 py-3 font-sans-medium text-base text-foreground mb-3"
              selectionColor="#3B82F6"
            />

            {/* How much do you own */}
            <Text className="font-sans-medium text-sm text-muted-foreground mb-2">
              Current value you hold (PLN)
            </Text>
            <View className="bg-background rounded-xl px-4 py-3 flex-row items-center mb-3">
              <TextInput
                value={amountText}
                onChangeText={setAmountText}
                keyboardType="decimal-pad"
                placeholder="e.g. 2500"
                placeholderTextColor="#64748B"
                className="flex-1 font-sans-medium text-xl text-foreground"
                selectionColor="#3B82F6"
              />
              <Text className="font-sans text-lg text-muted-foreground">zl</Text>
            </View>

            {/* Note */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Note (optional)"
              placeholderTextColor="#64748B"
              className="bg-background rounded-xl px-4 py-3 font-sans text-sm text-foreground mb-2"
              selectionColor="#3B82F6"
            />
          </ScrollView>

          <Pressable
            onPress={handleSubmit}
            disabled={!isValid}
            className={`rounded-xl py-4 items-center mt-2 ${isValid ? 'bg-primary' : 'bg-background'}`}
            style={{ opacity: isValid ? 1 : 0.5 }}
          >
            <Text className={`font-sans-semibold text-base ${isValid ? 'text-white' : 'text-muted-foreground'}`}>
              Log Investment
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
