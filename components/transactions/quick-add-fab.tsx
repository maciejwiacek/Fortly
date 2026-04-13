import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export function QuickAddFab() {
  const router = useRouter();

  const handlePress = () => {
    Haptics.selectionAsync();
    router.push('/add-transaction');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        position: 'absolute',
        width: 56,
        height: 56,
        bottom: 100,
        right: 20,
        borderRadius: 28,
        backgroundColor: '#F97316',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#F97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}
    >
      <Feather name="plus" size={28} color="#FFFFFF" />
    </Pressable>
  );
}
