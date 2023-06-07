import basicSetting from '../basicScene.js'
import ambientLight from './ambientLight.js'
import directionalLight from './directionalLight.js'
import ambientLight from './ambientLight.js'

const objects = []

// create objects
objects.push(directionalLight)
objects.push(ambientLight)

export const addLights = () => {
    const scene = basicSetting.scene

    if (!scene) return

    for (let obj of objects) {
        console.log('addLight: ', obj)
        scene.add(obj.light)
        scene.add(obj.target) // TODO: 验证是否需要添加
        scene.add(obj.helper)
        scene.add(obj.lightCamHelper)
    }
}

export const lightsOnChange = () => {
    for (let obj of objects) {
        obj.onLightChange?.(basicSetting.renderer)
    }
}
