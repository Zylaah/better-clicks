import { ref } from 'vue'

export function useDebounce() {
  const timeoutIds = ref(new Map())

  const debounce = (fn, delay = 150) => {
    const key = fn.toString()
    return (...args) => {
      if (timeoutIds.value.has(key)) {
        clearTimeout(timeoutIds.value.get(key))
      }
      
      const timeoutId = setTimeout(() => {
        fn(...args)
        timeoutIds.value.delete(key)
      }, delay)
      
      timeoutIds.value.set(key, timeoutId)
    }
  }

  const clearDebounces = () => {
    timeoutIds.value.forEach(timeoutId => clearTimeout(timeoutId))
    timeoutIds.value.clear()
  }

  return {
    debounce,
    clearDebounces
  }
} 