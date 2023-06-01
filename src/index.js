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
import getRenderTarget from './caustics/renderTarget'
// import renderTarget from './caustics/renderTarget'

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

const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshPhongMaterial({
    color: '#fff',
})
// console.log('rt texture: ', renderTarget, renderTarget.texture)
const tCube = new THREE.Mesh(geometry, material)
scene.add(tCube)

tCube.position.set(0, 20, 18)



// animation
const anim = () => {
// console.log('d-light-shadow: ', directionalLight.light.shadow)

    stats.update()

    window.requestAnimationFrame(anim)

    renderer.render(scene, getCamera())
    getCamera()?.bindedControl.update()

    mesh.rotateX(0.01)
    mesh.rotateY(0.01)

    objectsOnChange()
    lightsOnChange()

    material.map = getRenderTarget(directionalLight.light.shadow.map.texture, directionalLight.light.shadow.map.texture).texture
    material.needsUpdate = true

}

anim()

