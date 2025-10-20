class AvatarViewer {
  constructor(canvasId, modelPath = 'glb/bc_avatar3.gltf') {
    this.canvas = document.getElementById(canvasId);
    this.fallback = document.getElementById('avatarFallback');
    this.animationSelect = document.getElementById('animationSelect');
    this.toggleAnimationBtn = document.getElementById('toggleAnimationBtn');

    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    // Wait for Three.js to load
    if (!window.THREE) {
      console.error('Three.js not loaded. Please ensure CDN scripts are loaded before this script.');
      return;
    }

    const THREE = window.THREE;

    // Core scene objects
    this.THREE = THREE;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
    this.mixer = null;
    this.clock = new THREE.Clock();
    this.animations = [];
    this.currentAction = null;
    this.isAnimationPlaying = false;
    this.modelPath = modelPath;
    this.animationFrameId = null;

    // Initialize
    this.init();
    this.loadModel();
    this.setupEventListeners();
    this.animate();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Pause animation on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimation();
      }
    });
  }

  init() {
    const THREE = this.THREE;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);
    this.scene.fog = new THREE.Fog(0xf8f9fa, 50, 100);

    // Camera
    const width = this.canvas.clientWidth || 600;
    const height = this.canvas.clientHeight || 500;
    console.log('Canvas size:', { width, height });

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 2.5);

    // Renderer with performance optimization
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      precision: 'highp',
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    console.log('Renderer initialized');

    // Lighting (optimized)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);
    console.log('Lighting setup complete');

    // Controls
    const OrbitControls = window.OrbitControls;
    if (OrbitControls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 4;
      this.controls.enableZoom = true;
      this.controls.enablePan = true;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 5;
      console.log('OrbitControls initialized');
    } else {
      console.warn('OrbitControls not available');
    }
  }

  loadModel() {
    const THREE = this.THREE;
    const GLTFLoader = window.GLTFLoader;
    
    if (!GLTFLoader) {
      console.error('GLTFLoader not available. Check CDN loading.');
      return;
    }

    const loader = new GLTFLoader();

    console.log('Loading model from:', this.modelPath);

    loader.load(
      this.modelPath,
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        this.model = gltf.scene;

        // Optimize geometry
        this.model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Optimize materials
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((mat) => {
                  this.optimizeMaterial(mat);
                });
              } else {
                this.optimizeMaterial(child.material);
              }
            }

            // Cleanup unused geometry
            if (child.geometry) {
              child.geometry.computeBoundingBox();
            }
          }
        });

        // Scale and position
        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        this.model.scale.multiplyScalar(scale);

        const center = box.getCenter(new THREE.Vector3());
        this.model.position.x -= center.x * scale;
        this.model.position.y -= center.y * scale;
        this.model.position.z -= center.z * scale;

        this.scene.add(this.model);
        console.log('Model added to scene');

        // Setup animations
        if (gltf.animations.length > 0) {
          console.log('Found animations:', gltf.animations.map(a => a.name));
          this.animations = gltf.animations;
          this.mixer = new THREE.AnimationMixer(this.model);
          this.populateAnimationSelect();
        } else {
          console.warn('No animations found in model');
        }

        // Hide fallback
        if (this.fallback) {
          this.fallback.style.display = 'none';
        }

        // Make controls responsive after model loads
        this.controls.target.copy(this.model.position);
        this.controls.update();
      },
      (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        console.log(`Loading: ${percent}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        if (this.fallback) {
          this.fallback.style.display = 'block';
        }
      }
    );
  }

  optimizeMaterial(material) {
    // Use basic materials for better performance if needed
    if (material.map) material.map.generateMipmaps = true;
    if (material.normalMap) material.normalMap.generateMipmaps = true;
    if (material.roughnessMap) material.roughnessMap.generateMipmaps = true;
    if (material.metalnessMap) material.metalnessMap.generateMipmaps = true;

    // Set mipmap filter
    if (material.map) {
      material.map.minFilter = this.THREE.LinearMipmapLinearFilter;
      material.map.magFilter = this.THREE.LinearFilter;
    }

    material.side = this.THREE.FrontSide;
  }

  populateAnimationSelect() {
    this.animations.forEach((clip, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = clip.name;
      this.animationSelect.appendChild(option);
    });
  }

  setupEventListeners() {
    if (this.animationSelect) {
      this.animationSelect.addEventListener('change', (e) => {
        this.selectAnimation(parseInt(e.target.value));
      });
    }

    if (this.toggleAnimationBtn) {
      this.toggleAnimationBtn.addEventListener('click', () => {
        this.toggleAnimation();
      });
    }
  }

  selectAnimation(index) {
    if (index === '' || !this.mixer || !this.animations[index]) {
      return;
    }

    // Stop previous action
    if (this.currentAction) {
      this.currentAction.stop();
    }

    // Play new animation
    const clip = this.animations[index];
    this.currentAction = this.mixer.clipAction(clip);
    this.currentAction.play();
    this.isAnimationPlaying = true;
    this.updateButtonState();
  }

  toggleAnimation() {
    if (!this.mixer || !this.currentAction) {
      return;
    }

    if (this.isAnimationPlaying) {
      this.pauseAnimation();
    } else {
      this.currentAction.play();
      this.isAnimationPlaying = true;
      this.updateButtonState();
    }
  }

  pauseAnimation() {
    if (this.currentAction) {
      this.currentAction.stop();
      this.isAnimationPlaying = false;
      this.updateButtonState();
    }
  }

  updateButtonState() {
    if (!this.toggleAnimationBtn) return;

    const icon = this.toggleAnimationBtn.querySelector('i');
    if (this.isAnimationPlaying) {
      this.toggleAnimationBtn.innerHTML = '<i class="icon ion-pause"></i> Pause';
    } else {
      this.toggleAnimationBtn.innerHTML = '<i class="icon ion-play"></i> Play';
    }
  }

  onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (this.mixer && this.isAnimationPlaying) {
      this.mixer.update(delta);
    }

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.controls) {
      this.controls.dispose();
    }
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
  }
}

// Initialize when DOM is ready
function initAvatarViewer() {
  // Three.js libraries should already be loaded by index.html module script
  if (!window.THREE || !window.GLTFLoader || !window.OrbitControls) {
    console.error('Three.js libraries not found. Aborting avatar viewer initialization.');
    return;
  }

  console.log('Three.js libraries ready, initializing avatar viewer...');
  window.avatarViewer = new AvatarViewer('avatarCanvas');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatarViewer);
} else {
  initAvatarViewer();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  const viewer = window.avatarViewer;
  if (viewer) {
    viewer.dispose();
  }
});
