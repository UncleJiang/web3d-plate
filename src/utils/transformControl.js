import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import basicSetting from '../basicScene.js'

const {
    canvas,
    scene,
    camera,
    renderer,
    mesh,
    orbitControl,
} = basicSetting

const transformControl = new TransformControls(camera, canvas)

transformControl.addEventListener('change', (e) => {
    renderer.render(scene, camera)
})

transformControl.addEventListener('dragging-changed', (e) => {
    orbitControl.enabled = !e.value
})

transformControl.attach(mesh)

window.addEventListener('keydown', (e) => {
    console.log('key:   ', e.key)
    console.log('window: ', window)
    switch(e.key) {
        case 'Shift':
            control.setTranslationSnap( null )
            control.setRotationSnap( null )
            control.setScaleSnap( null )
            break
        case 'r':
        case 'R':
            transformControl.setMode('scale')
            break
        case 'w':
        case 'W':
            transformControl.setMode('translate')
            break
        case 'e':
        case 'E':
            transformControl.setMode('rotate')
            break
        case 'Escape': // escape the full screen mode  // TODO: 将无关的操作分开
            document.fullscreenElement && document.exitFullscreen()
            break
        default: 
            return
    }
})

const raycaster = new THREE.Raycaster()
// TODO: fix
// only cast objects on layer 2
// raycaster.layers.set(2)

const pointer = new THREE.Vector2()

window.addEventListener('dblclick', (e) => {
    // calculate the pointer position, -1 to +1
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = - (e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    // TODO: configure the raycaster's threshold
    const intersects = raycaster.intersectObjects(scene.children)
    console.log('ray intersects[]: ', intersects)

    if (intersects.length <= 1) { // no valid object casted
        transformControl.visible = false
    } else if (intersects[0]?.object?.isObject3D) {
        // attach the transformControl to the selected object
        transformControl.attach(intersects[0].object)
        transformControl.visible = true
    }
})

export default transformControl

