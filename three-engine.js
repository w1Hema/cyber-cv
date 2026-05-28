/* ========================================================
   IBRAHIM FATHY PORTFOLIO - THREE.JS WEBGL ENGINE
   Creates two completely distinct, ultra-premium 3D background animation styles:
   1. Dark Mode: Interactive Undulating Digital Terrain Wave (Grid Waves).
   2. Light Mode: Dynamic Constellation Network (Spiderweb Net Grid).
   ======================================================== */

// Make sure Three.js is loaded
if (typeof THREE !== 'undefined') {
    
    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090f, 0.001);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;
    camera.position.y = 200;

    // Renderer Setup
    const canvas = document.getElementById('webgl-background');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);


    // ====================================================
    // STYLE A: DARK MODE - Digital Grid Wave
    // ====================================================
    const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
    let count = 0;

    const numWaveParticles = AMOUNTX * AMOUNTY;
    const wavePositions = new Float32Array(numWaveParticles * 3);
    const waveScales = new Float32Array(numWaveParticles);

    let idx3 = 0, idx1 = 0;
    for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
            wavePositions[ idx3 ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 ); // x
            wavePositions[ idx3 + 1 ] = 0; // y
            wavePositions[ idx3 + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 ); // z
            waveScales[ idx1 ] = 1;
            idx3 += 3;
            idx1 ++;
        }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute( 'position', new THREE.BufferAttribute( wavePositions, 3 ) );
    waveGeometry.setAttribute( 'scale', new THREE.BufferAttribute( waveScales, 1 ) );

    // Custom shader for glowing terrain nodes
    const waveMaterial = new THREE.ShaderMaterial( {
        uniforms: {
            color: { value: new THREE.Color( 0xff6a00 ) },
            isLightMode: { value: 0.0 }
        },
        vertexShader: `
            attribute float scale;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = scale * ( 300.0 / - mvPosition.z );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float isLightMode;
            void main() {
                if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.47 ) discard;
                gl_FragColor = vec4( color, 0.6 );
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const waveParticles = new THREE.Points( waveGeometry, waveMaterial );
    scene.add( waveParticles );


    // ====================================================
    // STYLE B: LIGHT MODE - Interactive Constellation Spiderweb Net
    // ====================================================
    const spiderBoxHalfSize = 500; // boundary box for nodes
    const maxSpiderParticles = 120;
    const spiderParticlesData = [];
    const spiderPositions = new Float32Array(maxSpiderParticles * 3);

    for (let i = 0; i < maxSpiderParticles; i++) {
        const x = Math.random() * spiderBoxHalfSize * 2 - spiderBoxHalfSize;
        const y = Math.random() * spiderBoxHalfSize * 2 - spiderBoxHalfSize;
        const z = Math.random() * spiderBoxHalfSize * 2 - spiderBoxHalfSize;

        spiderPositions[i * 3] = x;
        spiderPositions[i * 3 + 1] = y;
        spiderPositions[i * 3 + 2] = z;

        // Random organic speed vector
        spiderParticlesData.push({
            velocity: new THREE.Vector3(
                -1.2 + Math.random() * 2.4,
                -1.2 + Math.random() * 2.4,
                -1.2 + Math.random() * 2.4
            )
        });
    }

    const spiderGeometry = new THREE.BufferGeometry();
    spiderGeometry.setAttribute('position', new THREE.BufferAttribute(spiderPositions, 3).setUsage(THREE.DynamicDrawUsage));

    // Custom shader for spider web nodes to make them glow nicely
    const spiderPointsMaterial = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xff6a00) }
        },
        vertexShader: `
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_PointSize = 12.0 * ( 300.0 / - mvPosition.z );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            void main() {
                if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.47 ) discard;
                gl_FragColor = vec4( color, 0.85 );
            }
        `,
        transparent: true,
        blending: THREE.NormalBlending,
        depthWrite: false
    });

    const spiderPoints = new THREE.Points(spiderGeometry, spiderPointsMaterial);
    scene.add(spiderPoints);

    // Spider Line segments pre-allocation
    const maxSpiderLineSegments = maxSpiderParticles * maxSpiderParticles;
    const spiderLinePositions = new Float32Array(maxSpiderLineSegments * 3);
    const spiderLineGeometry = new THREE.BufferGeometry();
    spiderLineGeometry.setAttribute('position', new THREE.BufferAttribute(spiderLinePositions, 3).setUsage(THREE.DynamicDrawUsage));

    const spiderLineMaterial = new THREE.LineBasicMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.28,
        blending: THREE.NormalBlending,
        linewidth: 1
    });

    const spiderLines = new THREE.LineSegments(spiderLineGeometry, spiderLineMaterial);
    scene.add(spiderLines);


    // ----------------------------------------------------
    // Mouse Tracking
    // ----------------------------------------------------
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener( 'mousemove', (event) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    });


    // ----------------------------------------------------
    // Core Animation loop
    // ----------------------------------------------------
    function animate() {
        requestAnimationFrame( animate );

        // Dynamic theme detection
        const isLightMode = document.body.classList.contains("light-mode");
        const activeAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        const activeColor = new THREE.Color(activeAccent || "#ff6600");

        // camera look at
        camera.position.x += ( mouseX - camera.position.x ) * 0.02;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.02;
        camera.lookAt( scene.position );

        if (isLightMode) {
            // ================================================
            // LIGHT MODE: Dynamic Constellation Spiderweb Net
            // ================================================
            waveParticles.visible = false;
            spiderPoints.visible = true;
            spiderLines.visible = true;

            // Sync Fog for Light Theme
            scene.fog.color.setHex(0xf8fafc);

            // Update particle positions
            const nodeCoords = spiderGeometry.attributes.position.array;
            for (let i = 0; i < maxSpiderParticles; i++) {
                const data = spiderParticlesData[i];

                nodeCoords[i * 3] += data.velocity.x;
                nodeCoords[i * 3 + 1] += data.velocity.y;
                nodeCoords[i * 3 + 2] += data.velocity.z;

                // Wall bounce physics
                if (Math.abs(nodeCoords[i * 3]) > spiderBoxHalfSize) data.velocity.x *= -1;
                if (Math.abs(nodeCoords[i * 3 + 1]) > spiderBoxHalfSize) data.velocity.y *= -1;
                if (Math.abs(nodeCoords[i * 3 + 2]) > spiderBoxHalfSize) data.velocity.z *= -1;
            }
            spiderGeometry.attributes.position.needsUpdate = true;

            // Calculate connections
            let lineIdx = 0;
            let activeConnections = 0;
            const lineCoords = spiderLines.geometry.attributes.position.array;

            for (let i = 0; i < maxSpiderParticles; i++) {
                for (let j = i + 1; j < maxSpiderParticles; j++) {
                    const dx = nodeCoords[i * 3] - nodeCoords[j * 3];
                    const dy = nodeCoords[i * 3 + 1] - nodeCoords[j * 3 + 1];
                    const dz = nodeCoords[i * 3 + 2] - nodeCoords[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    // Threshold to build a web link (160 units)
                    if (dist < 165) {
                        lineCoords[lineIdx++] = nodeCoords[i * 3];
                        lineCoords[lineIdx++] = nodeCoords[i * 3 + 1];
                        lineCoords[lineIdx++] = nodeCoords[i * 3 + 2];

                        lineCoords[lineIdx++] = nodeCoords[j * 3];
                        lineCoords[lineIdx++] = nodeCoords[j * 3 + 1];
                        lineCoords[lineIdx++] = nodeCoords[j * 3 + 2];

                        activeConnections++;
                    }
                }
            }

            spiderLines.geometry.attributes.position.needsUpdate = true;
            spiderLines.geometry.setDrawRange(0, activeConnections * 2);

            // Sync dynamic colors
            spiderPointsMaterial.uniforms.color.value.copy(activeColor);
            spiderLineMaterial.color.copy(activeColor);
            spiderLineMaterial.opacity = 0.22;

        } else {
            // ================================================
            // DARK MODE: Interactive Digital Wave Grid
            // ================================================
            waveParticles.visible = true;
            spiderPoints.visible = false;
            spiderLines.visible = false;

            // Sync Fog for Dark Theme
            scene.fog.color.setHex(0x040508);

            const positions = waveParticles.geometry.attributes.position.array;
            const scales = waveParticles.geometry.attributes.scale.array;

            let idx3 = 0, idx1 = 0;
            for ( let ix = 0; ix < AMOUNTX; ix ++ ) {
                for ( let iy = 0; iy < AMOUNTY; iy ++ ) {
                    positions[ idx3 + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 55 ) +
                                         ( Math.sin( ( iy + count ) * 0.5 ) * 55 );
                    
                    scales[ idx1 ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 +
                                  ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;

                    idx3 += 3;
                    idx1 ++;
                }
            }

            waveParticles.geometry.attributes.position.needsUpdate = true;
            waveParticles.geometry.attributes.scale.needsUpdate = true;
            count += 0.05;

            // Sync Wave color with dynamic cycle
            waveMaterial.uniforms.color.value.copy(activeColor);
            waveMaterial.uniforms.isLightMode.value = 0.0;
        }

        renderer.render( scene, camera );
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

}
