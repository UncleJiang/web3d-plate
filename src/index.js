import './style.css'

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

const {
    canvas,
    scene,
    renderer,
    mesh,
} = basicSetting

scene.add(transformControl)

console.log('index scene: ', scene)



// animation
const anim = () => {
    window.requestAnimationFrame(anim)

    renderer.render(scene, getCamera())
    getCamera()?.bindedControl.update()

    mesh.rotateX(0.01)
    mesh.rotateY(0.01)

    objectsOnChange()
    lightsOnChange()
}

anim()

