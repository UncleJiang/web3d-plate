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

// TODO: 根据用户点击 选择attach物体  single-click  attach   double-click  invisible
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

window.addEventListener('click', (e) => {
    console.log('click listener: ')
    transformControl.visible = true // TODO: 添加上前置条件： 如果选中了物体
})
window.addEventListener('dblclick', (e) => {
    console.log('dblclick listener')
    transformControl.visible = false
})

export default transformControl

