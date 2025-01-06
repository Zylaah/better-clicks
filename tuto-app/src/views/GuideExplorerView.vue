<template>
  <div class="guide-container">
    <!-- Menu latéral -->
    <div class="sidebar">
      <h2>Les Chapitres</h2>
      <nav class="chapters-nav">
        <div 
          v-for="(chapter, index) in chapters" 
          :key="index"
          class="chapter-item"
          :class="{ active: currentChapter === index }"
          @click="currentChapter = index"
        >
          <span class="chapter-number">{{ index + 1 }}</span>
          <span class="chapter-title">{{ chapter.title }}</span>
        </div>
      </nav>
    </div>

    <!-- Contenu modifié -->
    <div class="content">
      <h1>{{ chapters[currentChapter].title }}</h1>
      <component 
        :is="chapters[currentChapter].component"
        :chapter-data="chapters[currentChapter]"
      />
    </div>
  </div>
</template>

<script>
import ExplorerChapterOne from '@/components/explorer-chapters/Chapter1.vue'
import ExplorerChapterTwo from '@/components/explorer-chapters/Chapter2.vue'

export default {
  name: 'GuideView',
  components: {
    ExplorerChapterOne,
    ExplorerChapterTwo
  },
  data() {
    return {
      currentChapter: 0,
      chapters: [
        {
          title: "Introduction aux fichiers",
          component: 'ExplorerChapterOne',
          // données spécifiques au chapitre 1
        },
        {
          title: "Gestion des fichiers",
          component: 'ExplorerChapterTwo',
          // données spécifiques au chapitre 2
        }
      ]
    }
  },
  methods: {
    getImageUrl(name) {
      return require(`@/assets/images/${name}`)
    }
  },
  mounted() {
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = 'none';
    }
  },
  beforeUnmount() {
    const mobileMessage = document.querySelector('.mobile-message');
    if (mobileMessage) {
      mobileMessage.style.display = '';
    }
  }
}
</script>

<style scoped>
.guide-container {
  min-height: 100vh;
  display: flex;
}

.sidebar {
  min-width: 280px;
  background: var(--navbar-bg);
  margin-top: max(5vh, 4rem);
  padding: 1em;
  border-right: 1px solid var(--accent-color);
  position: fixed;
  height: 100dvh;
}

.sidebar h2 {
  color: var(--accent-color);
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 5vh;
  margin-bottom: 2rem;
}


.chapters-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color);
}

.chapter-item:hover {
  background: var(--hover-color);
}

.chapter-item.active {
  background: var(--hover-color);
  color: #42b883;
}

.chapter-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--accent-color);
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-color);
}

.content {
  background: var(--color-background-soft);
  margin-left: 320px;
  flex-grow: 1;
}

h1 {
  margin-bottom: 2rem;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  color: var(--accent-color);
}

.chapter-content {
  line-height: 1.6;
  font-size: 1.1rem;
  color: var(--text-color);
}

/* Nouveaux styles pour le contenu enrichi */
:deep(.chapter-section) {
  margin-bottom: 2rem;
}

:deep(h2) {
  color: var(--accent-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

:deep(h3) {
  color: var(--text-color);
  margin: 1rem 0;
  font-size: 1.2rem;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}

:deep(.info-box), :deep(.example-box) {
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid var(--accent-color);
}

:deep(.image-container) {
  margin: 2rem 0;
  text-align: center;
}

:deep(.image-container img) {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
}

:deep(.caption) {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

:deep(ul) {
  list-style-type: none;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(li) {
  margin-bottom: 0.5rem;
  position: relative;
}

:deep(li)::before {
  content: "•";
  color: var(--accent-color);
  position: absolute;
  left: -1.5rem;
}

:deep(code) {
  background: var(--code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>

