import * as THREE from 'three'

import basicSetting from '../basicScene.js'
// import SphereObj from './basicMeshObj/SphereObj.js'



const objects = []

/**
 * create objects
 */

// const sphere1 = new SphereObj()
// objects.push(sphere1)


// objects.push(terrain)
// objects.push(sky)
// objects.push(timeGroup)
// objects.push(particles)

// objects.push(fog) // TODO: 单独的对scene的属性进行设置



export const addObjects = () => {
    const scene = basicSetting.scene

    if (!scene) return

    for (let obj of objects) {
        obj?.mesh && scene.add(obj.mesh)
    }
}

export const objectsOnChange = (elapsedTime, deltaTime) => {
    const scene = basicSetting.scene

    for (let obj of objects) {
        obj.onMeshChange?.(elapsedTime, deltaTime, scene)
    }
}
