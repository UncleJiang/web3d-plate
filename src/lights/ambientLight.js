import * as THREE from 'three'

import gui from '../utils/gui.js'


const ambientLight = () => {
    const lightFolder = gui.addFolder('ambient-light')

    const lightParams = {
        ambientLightCoor: { x: 0, y: 13, z: 0 },
        ambientLightColor: { string: '#00d0ff' },
        ambientLightIntensity: 0.2,
        lightToTarget: { x: 0, y: -2, z: -2 },
        // showLightHelper: true,
    }

    lightFolder.add(lightParams.ambientLightCoor, 'x', -70, 70, 1).name('ambientLight_x')
    lightFolder.add(lightParams.ambientLightCoor, 'y', -30, 30, 1).name('ambientLight_y')
    lightFolder.add(lightParams.ambientLightCoor, 'z', -70, 70, 1).name('ambientLight_z')

    lightFolder.add(lightParams.lightToTarget, 'x', -70, 70, 1).name('toTarget_dx')
    lightFolder.add(lightParams.lightToTarget, 'y', -30, 30, 1).name('toTarget_dy')
    lightFolder.add(lightParams.lightToTarget, 'z', -70, 70, 1).name('toTarget_dz')

    lightFolder.addColor(lightParams.ambientLightColor, 'string').name('ambientLight_color')
    lightFolder.add(lightParams, 'ambientLightIntensity', 0, 1, 0.1).name('dLight_intensity')
    // lightFolder.add(lightParams, 'showLightHelper')


    const ambientLightTarget = new THREE.Object3D()
    ambientLightTarget.position.set(0, 3, 0)


    const ambientLight = new THREE.AmbientLight('#ffffff', 0.2)
    ambientLight.position.set(0, 0, 0)
    ambientLight.target = ambientLightTarget
    // const helper = new THREE.Ambien(ambientLight, 5)

    const onLightChange = function() {
        ambientLight.position.set(
            lightParams.ambientLightCoor.x,
            lightParams.ambientLightCoor.y,
            lightParams.ambientLightCoor.z
        )
        ambientLight.color.set(lightParams.ambientLightColor.string)
        ambientLight.intensity = lightParams.ambientLightIntensity
        // helper.visible = lightParams.showLightHelper
    }

    return {
        light: ambientLight,
        target: ambientLightTarget,
        // helper: helper,
        onLightChange: onLightChange,
    }

}

export default ambientLight()