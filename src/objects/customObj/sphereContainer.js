import * as THREE from 'three'

import commonParams from '../../common.js'

const sphereContainer = () => {

    const sphereGeometry = new THREE.SphereGeometry(commonParams.CONTAINER_RADIUS, 32, 16)
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: '#aaa',
        // TODO: 设置envmap为 cubeCamera render的texture
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.name = 'sphereContainer'
    
    return {
        mesh: sphere
    }

}

export default sphereContainer()