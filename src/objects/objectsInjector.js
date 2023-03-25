import * as THREE from 'three'

import basicSetting from '../basicScene.js'
import SphereObj from './basicMeshObj/SphereObj.js'
import terrain from './customObj/terrain.js'

const objects = []

// create objects
const sphere1 = new SphereObj()
objects.push(sphere1)

const sphere2 = new SphereObj()
objects.push(sphere2)

objects.push(terrain)


export const addObjects = () => {
    const scene = basicSetting.scene
    const scene2 = basicSetting.scene
    console.log('scene: ', scene, scene2)
    
    if (!scene) return

    for (let obj of objects) {
        console.log('haliluya: ', obj)
        scene.add(obj.mesh)
    }
}

export const objectsOnChange = () => {
    for (let obj of objects) {
        obj.onMeshChange?.()
    }
}




