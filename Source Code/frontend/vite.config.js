export default {
  optimizeDeps: {
    exclude: ['core-js']
  },
  build: {
    rollupOptions: {
      external: [
        /^core-js/
      ]
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
};
