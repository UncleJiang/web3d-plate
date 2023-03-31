import './style.css'

import basicSetting from './basicScene.js'
import { addObjects, objectsOnChange } from './objects/objectsInjector.js'
import { addLights, lightsOnChange } from './lights/lightsInjector.js'
import transformControl from './utils/transformControl.js'

addObjects()
addLights()

const {
    canvas,
    scene,
    camera,
    renderer,
    mesh,
    orbitControl,
} = basicSetting

scene.add(transformControl)

console.log('index scene: ', scene)
// animation
const anim = () => {
    window.requestAnimationFrame(anim)
    orbitControl.update()
    renderer.render(scene, camera)

    mesh.rotateX(0.01)
    mesh.rotateY(0.01)

    objectsOnChange()
    lightsOnChange()
}

anim()

