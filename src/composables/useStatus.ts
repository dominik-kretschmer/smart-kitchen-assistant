import { ref } from 'vue';

export function useStatus() {
  const isLoading = ref(false);
  const error = ref('');
  return { isLoading, error };
}
