import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Используем корневой путь
  publicDir: 'public', // Убеждаемся что public папка копируется
})
