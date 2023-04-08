import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import basicSetting from '../basicScene.js'


// camera
const mainCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
    camera.name = 'mainCamera'
    camera.position.y = 19.7
    camera.position.z = 40.7

    // control
    const orbitControl = new OrbitControls(camera, basicSetting.canvas)
    orbitControl.update()

    camera.bindedControl = orbitControl

    return camera
}
export default mainCamera()


