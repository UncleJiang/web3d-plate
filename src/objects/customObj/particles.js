import * as THREE from 'three'

import gui from '../../utils/gui.js'
import commonParams from '../../common.js'

const particles = () => {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 800

    const positions = new Float32Array(count * 3)
    const maxWidth = (commonParams.CONTAINER_RADIUS - 10) * 2

    for (let i = 0; i < count * 3; i++)
    {
        positions[i] = (i % 3 == 1)
            ? Math.random() * 10 // on y axis
            : (Math.random() - 0.5) * maxWidth
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.04,
        sizeAttenuation: true
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    particles.name = 'dustParticles'

    const startPositionX = - maxWidth * 0.5
    const endPositionX = maxWidth * 0.5

    const onParticlesChange = () => {
        const { position: particlePosition } = particlesGeometry.attributes
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            if (particlePosition.array[i3] > endPositionX) {
                particlePosition.array[i3] = startPositionX
            }
            particlePosition.array[i3] += Math.random() * 0.06 // * 0.01
            particlePosition.array[i3 + 1] += (Math.random() - 0.5) * 0.0001
            particlePosition.array[i3 + 2] += (Math.random() - 0.5) * 0.0001
        }
        particlePosition.needsUpdate = true
    }

    return {
        mesh: particles,
        onMeshChange: onParticlesChange
    }
}

export default particles()