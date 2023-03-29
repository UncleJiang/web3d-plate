import * as THREE from 'three'

import basicSetting from '../../basicScene.js'

const sphereContainer = () => {

    const sphereGeometry = new THREE.SphereGeometry(basicSetting.commonParams.CONTAINER_RADIUS, 32, 16)
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: '#aaa',
        // TODO: 设置envmap为 cubeCamera render的texture
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    
    return {
        mesh: sphere
    }

}

export default sphereContainer()