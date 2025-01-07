<template>
  <div class="keyboard-3d-container" ref="container"></div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { markRaw } from 'vue'

export default {
  name: 'Keyboard3D',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      model: null,
      controls: null,
      animationFrameId: null
    }
  },
  mounted() {
    this.initScene()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    if (this.renderer) {
      this.renderer.dispose()
    }
  },
  methods: {
    initScene() {
      // Création de la scène
      this.scene = markRaw(new THREE.Scene())
      this.scene.background = new THREE.Color(0x1a1a1a)

      // Création de la caméra
      this.camera = markRaw(new THREE.PerspectiveCamera(
        75,
        this.$refs.container.clientWidth / this.$refs.container.clientHeight,
        0.1,
        1000
      ))
      this.camera.position.z = 5
      this.camera.position.y = 2

      // Création du renderer
      this.renderer = markRaw(new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
      }))
      this.renderer.setSize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.shadowMap.enabled = true
      this.renderer.outputEncoding = THREE.sRGBEncoding
      this.$refs.container.appendChild(this.renderer.domElement)

      // Ajout des contrôles
      this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement))
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.maxPolarAngle = Math.PI / 2
      this.controls.minDistance = 3
      this.controls.maxDistance = 10

      // Éclairage
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      directionalLight.castShadow = true
      this.scene.add(directionalLight)

      // Chargement du modèle
      const loader = new GLTFLoader()
      loader.load(
        '/models/keyboard.glb',
        (gltf) => {
          this.model = markRaw(gltf.scene)
          this.model.scale.set(1, 1, 1)
          this.model.position.set(0, 0, 0)
          this.model.rotation.x = -Math.PI / 6
          
          // Parcourir tous les matériaux pour activer la transparence si nécessaire
          this.model.traverse((child) => {
            if (child.isMesh) {
              child.material.transparent = true
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          
          this.scene.add(this.model)
        },
        (progress) => {
          console.log('Chargement:', (progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
          console.error('Erreur de chargement:', error)
        }
      )

      this.animate()
    },
    animate() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
      }
      
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate)
        if (this.controls) this.controls.update()
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera)
        }
      }
      
      animate()
    },
    onWindowResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = this.$refs.container.clientWidth / this.$refs.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.$refs.container.clientWidth, this.$refs.container.clientHeight)
      }
    }
  }
}
</script>

<style scoped>
.keyboard-3d-container {
  width: 100%;
  height: 400px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow: hidden;
  margin: 2rem auto;
  position: relative;
}

.keyboard-3d-container canvas {
  outline: none;
}
</style> 