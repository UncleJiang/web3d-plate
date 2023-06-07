import * as THREE from 'three'

import gui from '../utils/gui.js'


const directionalLight = () => {
    const lightFolder = gui.addFolder('light')
    lightFolder.close()

    const lightParams = {
        directionalLightCoor: { x: 0, y: 13, z: 0 },
        directionalLightColor: { string: '#00d0ff' },
        directionalLightIntensity: 0.5,
        lightToTarget: { x: 0, y: -2, z: -2 },
        pointLightCoor: { x: 0, y: 10, z: 0 },
        pointLightColor: { string: '#ff9000' },
        pointLightIntensity: 0.5,
        showLightHelper: true,
    }

    lightFolder.add(lightParams.directionalLightCoor, 'x', -70, 70, 1).name('directionalLight_x')
    lightFolder.add(lightParams.directionalLightCoor, 'y', -30, 30, 1).name('directionalLight_y')
    lightFolder.add(lightParams.directionalLightCoor, 'z', -70, 70, 1).name('directionalLight_z')

    lightFolder.add(lightParams.lightToTarget, 'x', -70, 70, 1).name('toTarget_dx')
    lightFolder.add(lightParams.lightToTarget, 'y', -30, 30, 1).name('toTarget_dy')
    lightFolder.add(lightParams.lightToTarget, 'z', -70, 70, 1).name('toTarget_dz')

    lightFolder.addColor(lightParams.directionalLightColor, 'string').name('directionalLight_color')
    lightFolder.add(lightParams, 'directionalLightIntensity', 0, 1, 0.1).name('dLight_intensity')
    lightFolder.add(lightParams, 'showLightHelper')


    const directionalLightTarget = new THREE.Object3D()
    directionalLightTarget.position.set(0, 3, 0)


    const directionalLight = new THREE.DirectionalLight('#00d6ff', 0.5) // TODO: check 不能自动应用depthmatetial, shadow不正确
    directionalLight.position.set(0, 0, 0)
    directionalLight.target = directionalLightTarget
    const helper = new THREE.DirectionalLightHelper(directionalLight, 5)

    const onLightChange = function() {
        directionalLight.position.set(
            lightParams.directionalLightCoor.x,
            lightParams.directionalLightCoor.y,
            lightParams.directionalLightCoor.z
        )
        directionalLight.color.set(lightParams.directionalLightColor.string)
        directionalLight.intensity = lightParams.directionalLightIntensity
        helper.visible = lightParams.showLightHelper
    }

    return {
        light: directionalLight,
        target: directionalLightTarget,
        helper: helper,
        onLightChange: onLightChange,
    }

}

export default directionalLight()