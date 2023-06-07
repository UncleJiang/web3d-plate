import './style.css'
import * as THREE from 'three'

import basicSetting from './basicScene.js'
import { addObjects, objectsOnChange } from './objects/objectsInjector.js'
import { addLights, lightsOnChange } from './lights/lightsInjector.js'
import transformControl from './utils/transformControl.js'
import commonPanel from './commonPanel.js'
import addCamera from './cameras/camerasInjector.js'
import getCamera from './cameras/cameraHandler'
import directionalLight from './lights/directionalLight'


commonPanel()

addCamera()
addObjects()
addLights()


console.log('d-light-shadow: ', directionalLight.light.shadow)

const {
    canvas,
    scene,
    renderer,
    mesh,
    stats
} = basicSetting

scene.add(transformControl)

console.log('index scene: ', scene)



// animation
const clock = new THREE.Clock()
let currentTime = 0
const anim = () => {
// console.log('d-light-shadow: ', directionalLight.light.shadow)

    stats.update()

    window.requestAnimationFrame(anim)

    renderer.render(scene, getCamera())
    getCamera()?.bindedControl.update()

    mesh.rotateX(0.01)
    mesh.rotateY(0.01)

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - currentTime
    currentTime = elapsedTime

    objectsOnChange(elapsedTime, deltaTime)
    lightsOnChange()

}

anim()

