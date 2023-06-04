import * as THREE from 'three'
// import getRenderTarget from '../caustics/renderTarget.js'

import gui from '../utils/gui.js'
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js'


const directionalLight = () => {
    const lightFolder = gui.addFolder('light')
    lightFolder.close()

    const lightParams = {
        directionalLightCoor: { x: 12, y: 20, z: 45 }, // { x: -18, y: 10, z: 35 },
        directionalLightColor: { string: '#33daff' },
        directionalLightIntensity: 0.5,
        lightToTarget: { x: 0, y: -2, z: -2 },
        showLightHelper: false,
        // resetShadow: false,
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
    directionalLightTarget.position.set(0, 0, 0)


    const directionalLight = new THREE.DirectionalLight('#33daff', 0.5) // TODO: check 不能自动应用depthmatetial, shadow不正确
    directionalLight.position.set(0, 20, 0)
    directionalLight.target = directionalLightTarget
    const helper = new THREE.DirectionalLightHelper(directionalLight, 5)

    directionalLight.castShadow = true
    directionalLight.shadow.autoUpdate = true
    console.log('d light- shadow: ', directionalLight.shadow)

    const shadowMapViewer = new ShadowMapViewer(directionalLight)
    const size = window.innerWidth * 0.15
    shadowMapViewer.position.x = 10
    shadowMapViewer.position.y = 10
    shadowMapViewer.size.width = size
    shadowMapViewer.size.height = size
    shadowMapViewer.update()


    // directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 40
    directionalLight.shadow.camera.right = 15
    directionalLight.shadow.camera.left = - 15
    directionalLight.shadow.camera.top	= 15
    directionalLight.shadow.camera.bottom = - 15
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024

    // shadow map todo
    const oldShadow = directionalLight.shadow.clone(true)

    // lightFolder.add(lightParams, 'resetShadow')
       

    // scene.add( new THREE.CameraHelper( directionalLight.shadow.camera ) );
    const lightCamHelper = new THREE.CameraHelper( directionalLight.shadow.camera )

    const testTexture = new THREE.TextureLoader().load( 'textures/IMG_6878.png' )
    const onLightChange = function(renderer) {
        directionalLight.position.set(
            lightParams.directionalLightCoor.x,
            lightParams.directionalLightCoor.y,
            lightParams.directionalLightCoor.z
        )
        directionalLight.color.set(lightParams.directionalLightColor.string)
        directionalLight.intensity = lightParams.directionalLightIntensity
        helper.visible = lightParams.showLightHelper

        directionalLight.shadow.needsUpdate = true

        // shadowMapViewer.render(renderer)

        // 叠加上caustics texture 到shadow map中，性能消耗严重，故舍弃该方式
        // if(lightParams.resetShadow) {
        //     // console.log('reset shadow', oldShadow, directionalLight.shadow)

        //     directionalLight.shadow.map.texture = getRenderTarget(directionalLight.shadow.map.texture, testTexture).texture
        //     directionalLight.shadow.needsUpdate = true
        // }

        // console.log('d light- shadow: ', directionalLight.shadow)

    }

    return {
        light: directionalLight,
        target: directionalLightTarget,
        helper: helper,
        // lightCamHelper: lightCamHelper,
        onLightChange: onLightChange,
    }

}

export default directionalLight()