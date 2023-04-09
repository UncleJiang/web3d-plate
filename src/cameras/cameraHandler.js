import mainCamera from './mainCamera.js'
import basicSetting from '../basicScene.js'
import commonParams from '../common.js'

export const cameraArr = []
cameraArr.push(mainCamera)

let selectedCamera = mainCamera

// Only the camera with a not-empty name is valid.
export const changeCamera = (name) => {
    
    if (!name) return

    const cameraNameArr = cameraArr.map((item) => item.name)
    if (!cameraNameArr.includes(name)) return

    for (let i = 0; i < cameraArr.length; i ++) {
        cameraArr[i]?.bindedControl && (cameraArr[i].bindedControl.enabled = false)
        if (cameraArr[i].name === name) {
            selectedCamera = cameraArr[i]
        }
    }
    selectedCamera?.bindedControl && (selectedCamera.bindedControl.enabled = true)
    selectedCamera?.bindedControl.update()
}

const getCamera = (name) => {
    // return the selected camera directly if passing no param
    changeCamera(name)
    return selectedCamera
}

// TODO 单独处理事件
const { sizes } = commonParams
const { renderer } = basicSetting
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight + 100 // to enable the scroll animation of gsap

    // Update camera
    selectedCamera.aspect = sizes.width / sizes.height
    selectedCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

export default getCamera