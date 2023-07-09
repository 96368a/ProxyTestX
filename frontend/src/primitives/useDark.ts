import { usePrefersDark } from '@solid-primitives/media'
import { createStorageSignal } from '@solid-primitives/storage'

export default function useDark() {
  const prefersDark = usePrefersDark()
  const [value, setValue] = createStorageSignal<string>('dark-mode', 'auto', { api: localStorage })
  const isDark = createMemo(() => value() === 'auto' ? prefersDark() : value() === 'dark')

  createEffect(() => document.documentElement.classList.toggle('dark', isDark()))
  const toggleDark = () => setValue(isDark() ? 'light' : 'dark')

  return {
    isDark,
    toggleDark,
  }
}
