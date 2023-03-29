import * as THREE from 'three'

import basicSetting from '../basicScene.js'
import SphereObj from './basicMeshObj/SphereObj.js'
import terrain from './customObj/terrain.js'
import sphereContainer from './customObj/sphereContainer.js'
import sky from './customObj/sky.js'
import fog from './customObj/fog.js'
import timeGroup from './customObj/timeGroup/index.js'
import particles from './customObj/particles.js'

const objects = []

// create objects
const sphere1 = new SphereObj()
objects.push(sphere1)

const sphere2 = new SphereObj()
objects.push(sphere2)

objects.push(terrain)
objects.push(sphereContainer)
objects.push(sky)
objects.push(timeGroup)
objects.push(particles)

objects.push(fog) // TODO: 单独的对scene的属性进行设置


export const addObjects = () => {
    const scene = basicSetting.scene
    
    if (!scene) return

    for (let obj of objects) {
        console.log('haliluya: ', obj)
        obj?.mesh && scene.add(obj.mesh)
    }
}

export const objectsOnChange = () => {
    const scene = basicSetting.scene

    for (let obj of objects) {
        obj.onMeshChange?.(scene)
    }
}




