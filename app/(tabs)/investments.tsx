import { Redirect } from 'expo-router';

// Investments are now part of the Goals tab
export default function InvestmentsRedirect() {
  return <Redirect href="/(tabs)/goals" />;
}
