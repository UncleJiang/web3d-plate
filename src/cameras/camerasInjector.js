import gui from '../utils/gui.js'

import basicSetting from '../basicScene.js'
import trackCamera from './trackCamera.js'
import mainCamera from './mainCamera.js'
import commonParams from '../common.js'


const {scene, renderer} = basicSetting

const cameraArr = []

cameraArr.push(mainCamera)
cameraArr.push(trackCamera)

const cameraNameArr = cameraArr.map((item) => item.name)

for(let i = 0; i < cameraArr.length; i++) {
    scene.add(cameraArr[i])
}

let params = { name: mainCamera.name }
let selectedCamera = mainCamera

// Only the camera with a not-empty name is valid.
const changeCamera = (name) => {
    if (!name) return
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

const folder = gui.addFolder('Camera Selector')
folder.add(params, 'name', cameraNameArr)
    .onChange(changeCamera)

const getCamera = (name) => {
    // return the selected camera directly if passing no param
    changeCamera(name)
    return selectedCamera
}



// TODO 单独处理事件
const { sizes } = commonParams
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