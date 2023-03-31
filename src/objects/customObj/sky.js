import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

import gui from '../../utils/gui.js'
import commonParams from '../../common.js'

const sky = () => {
    const sky = new Sky()
    sky.name = 'sky'
    const sphereGeometry = new THREE.SphereGeometry(1)
    sky.geometry.copy(sphereGeometry)
    sky.scale.setScalar(commonParams.CONTAINER_RADIUS - 10)

    const sun = new THREE.Vector3(-20, 40, -10)
    sky.material.uniforms['sunPosition'].value.copy(sun)

    const skyParams = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        up: {x: 0, y: 1, z: 0}
    }

    const folder = gui.addFolder('Sky')
    folder.add(skyParams, 'turbidity', 0.0, 20.0, 0.1)
    folder.add(skyParams, 'rayleigh', 0.0, 4, 0.001)
    folder.add(skyParams, 'mieCoefficient', 0.0, 0.1, 0.001)
    folder.add(skyParams, 'mieDirectionalG', 0.0, 1.0, 0.001)
    folder.add(skyParams, 'elevation', 0.0, 90.0, 0.1)
    folder.add(skyParams, 'azimuth', -180, 180, 0.1)
    folder.add(skyParams.up, 'x', -100, 100, 5).name('up_x')
    folder.add(skyParams.up, 'y', -100, 100, 5).name('up_y')
    folder.add(skyParams.up, 'z', -100, 100, 5).name('up_z')


    const skyParamsChanged = () => {
        const uniforms = sky.material.uniforms
        uniforms['turbidity'].value = skyParams.turbidity
        uniforms['rayleigh'].value = skyParams.rayleigh
        uniforms['mieCoefficient'].value = skyParams.mieCoefficient
        uniforms['mieDirectionalG'].value = skyParams.mieDirectionalG
        
        const upVec3 = new THREE.Vector3(skyParams.up.x, skyParams.up.y, skyParams.up.z)
        uniforms['up'].value.copy(upVec3)
    
        const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation)
        const theta = THREE.MathUtils.degToRad(skyParams.azimuth)
    
        sun.setFromSphericalCoords(1, phi, theta)
        uniforms['sunPosition'].value.copy(sun)
    
    }

    return {
        mesh: sky,
        onMeshChange: skyParamsChanged
    }
}


export default sky()