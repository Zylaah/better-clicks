<template>
    <div class="progress-info">
      <span v-if="showLabel">{{ currentValue }} sur {{ totalValue }}</span>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${(currentValue / totalValue) * 100}%` }"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProgressBar',
    props: {
      currentValue: {
        type: Number,
        required: true
      },
      totalValue: {
        type: Number,
        required: true
      },
      showLabel: {
        type: Boolean,
        default: true
      }
    }
  }
  </script>
  
  <style scoped>
  .progress-info {
    margin-top: clamp(0.5rem, 1vh, 1rem);
    text-align: center;
    color: var(--text-color);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .progress-bar {
    margin-top: clamp(0.25rem, 0.5vh, 0.5rem);
    width: 100%;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    width: 300px;
  }
  
  .progress-fill {
    height: 100%;
    background-color: var(--accent-color);
    transition: width 0.3s ease;
  }
  </style>