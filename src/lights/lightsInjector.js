import basicSetting from '../basicScene.js'
import directionalLight from './directionalLight.js'

const objects = []

// create objects
objects.push(directionalLight)

export const addLights = () => {
    const scene = basicSetting.scene

    if (!scene) return

    for (let obj of objects) {
        console.log('addLight: ', obj)
        scene.add(obj.light)
        scene.add(obj.target) // TODO: check 是否需要添加
        scene.add(obj.helper)
    }
}

export const lightsOnChange = () => {
    for (let obj of objects) {
        obj.onLightChange?.()
    }
}
