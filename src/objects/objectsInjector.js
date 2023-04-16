import * as THREE from 'three'

import basicSetting from '../basicScene.js'
// import SphereObj from './basicMeshObj/SphereObj.js'
// import sky from './advancedMeshObj/sky.js'
// import timeGroup from './customObj/timeGroup/index.js'

const objects = []


/**
 * create objects and add in objects array
 * 
 * code sample:
 * `
 * const sphere = new SphereObj()
 * objects.push(sphere)
 * 
 * objects.push(sky)
 * objects.push(timeGroup)
 * `
 */


export const addObjects = () => {
    const scene = basicSetting.scene

    if (!scene) return

    for (let obj of objects) {
        obj?.mesh && scene.add(obj.mesh)
    }
}

export const objectsOnChange = () => {
    const scene = basicSetting.scene

    for (let obj of objects) {
        obj.onMeshChange?.(scene)
    }
}
