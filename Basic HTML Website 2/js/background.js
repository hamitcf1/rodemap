class TileEffect {
    constructor() {
        // Core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.tiles = [];
        
        // State
        this.enabled = false;
        this.mouseDown = false;
        this.mousePos = { x: 0, y: 0 };
        
        // Init
        this.init();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            width / -2, width / 2,
            height / 2, height / -2,
            1, 1000
        );
        this.camera.position.z = 100;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: false 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Add to DOM
        document.getElementById('background').appendChild(this.renderer.domElement);
        
        // Create tiles
        this.createTiles();
    }
    
    createTiles() {
        // Settings
        const tileSize = 60;
        const gap = 5;
        const cols = Math.ceil(window.innerWidth / tileSize) + 1;
        const rows = Math.ceil(window.innerHeight / tileSize) + 1;
        
        // Geometry (reuse for performance)
        const geometry = new THREE.PlaneGeometry(tileSize - gap, tileSize - gap);
        
        // Create grid
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0
                });
                
                const tile = new THREE.Mesh(geometry, material);
                
                // Position
                tile.position.x = (j - cols/2) * tileSize;
                tile.position.y = (i - rows/2) * tileSize;
                
                // Store default state
                tile.basePos = { ...tile.position };
                tile.currentVelocity = { x: 0, y: 0, z: 0 };
                
                this.scene.add(tile);
                this.tiles.push(tile);
            }
        }
    }
    
    addEventListeners() {
        // Mouse events
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = (e.clientX - window.innerWidth/2);
            this.mousePos.y = -(e.clientY - window.innerHeight/2);
        });
        
        document.addEventListener('mousedown', () => {
            this.mouseDown = true;
        });
        
        document.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });
        
        // Toggle button
        const toggle = document.getElementById('toggleBackground');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleEffect());
        }
        
        // Window resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.camera.left = width / -2;
            this.camera.right = width / 2;
            this.camera.top = height / 2;
            this.camera.bottom = height / -2;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(width, height);
            
            // Recreate tiles
            this.tiles.forEach(tile => {
                this.scene.remove(tile);
                tile.geometry.dispose();
                tile.material.dispose();
            });
            this.tiles = [];
            this.createTiles();
        });
    }
    
    updateTiles() {
        if (!this.enabled) return;
        
        this.tiles.forEach(tile => {
            const dx = tile.position.x - this.mousePos.x;
            const dy = tile.position.y - this.mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = this.mouseDown ? 300 : 200;
            
            if (distance < maxDistance) {
                const influence = 1 - (distance / maxDistance);
                const targetZ = this.mouseDown ? influence * 100 : influence * 30;
                
                // Smooth movement
                tile.position.z += (targetZ - tile.position.z) * 0.1;
                
                // Rotation based on mouse position
                const rotationInfluence = this.mouseDown ? 0.5 : 0.2;
                tile.rotation.x = (dy / maxDistance) * influence * rotationInfluence;
                tile.rotation.y = (dx / maxDistance) * influence * rotationInfluence;
                
                // Opacity
                tile.material.opacity = 0.3 + influence * 0.7;
            } else {
                // Return to default state
                tile.position.z *= 0.9;
                tile.rotation.x *= 0.9;
                tile.rotation.y *= 0.9;
                tile.material.opacity = this.enabled ? 0.3 : 0;
            }
        });
    }
    
    toggleEffect() {
        this.enabled = !this.enabled;
        
        const toggle = document.getElementById('toggleBackground');
        if (toggle) {
            toggle.classList.toggle('active');
        }
        
        // Update all tiles
        this.tiles.forEach(tile => {
            tile.material.opacity = this.enabled ? 0.3 : 0;
            tile.position.z = 0;
            tile.rotation.x = 0;
            tile.rotation.y = 0;
        });
    }
    
    animate = () => {
        requestAnimationFrame(this.animate);
        this.updateTiles();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tileEffect = new TileEffect();
}); 