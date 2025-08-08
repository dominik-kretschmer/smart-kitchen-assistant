import { ref } from 'vue';

export function useStatus() {
  const isLoading = ref(false);
  const error = ref('');
  const user = {
    id: 0,
    username: '',
  };
  return { isLoading, error , user};
}
