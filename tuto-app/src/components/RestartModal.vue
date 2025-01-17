<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="modal-overlay">
                <div class="modal-content">
                    <slot name="header" v-once></slot>
                    <slot v-once></slot>
                    <slot name="footer" v-once></slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
  
<script>
export default {
    name: 'BaseModal',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        }
    },
    emits: ['update:modelValue'],
    watch: {
        modelValue(newVal) {
            if (newVal) {
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        }
    },
    unmounted() {
        document.body.classList.remove('modal-open');
    }
}
</script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  transform: none !important;
  pointer-events: all;
  user-select: none;
}

:global(body.modal-open) {
    pointer-events: none;
}

:global(.modal-overlay *) {
    pointer-events: auto;
}

.modal-content {
  background-color: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 400px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
  
/* Animation de transition */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.1s ease;
}
  
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>