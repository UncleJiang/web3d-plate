import * as THREE from 'three'
import gsap from 'gsap'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

import gui from '../../utils/gui.js'
import commonParams from '../../common.js'
import basicSetting from '../../basicScene.js'

const ONE_DAY = '24 hours'
const ONE_HOUR = '1 hour'
const HALF_HOUR = '30 minutes'
const ONE_MINUTE = '1 minute'

const sky = () => {
    const sky = new Sky()
    sky.name = 'sky'
    const sphereGeometry = new THREE.SphereGeometry(1)
    sky.geometry.copy(sphereGeometry)
    sky.scale.setScalar(commonParams.COMMON_PARAM_EXAMPLE) // TODO: 改成配置

    const sun = new THREE.Vector3(-20, 40, -10)
    sky.material.uniforms['sunPosition'].value.copy(sun)

    const skyParams = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        up: { x: 0, y: 1, z: 0 },
        isNight: false,
        progress: 0,
        ambientLightH: 187,
        ambientLightS: 0.31,
        ambientLightL: 0.95,
        lightIntensity: 1.0,
    }

    const skyFolder = gui.addFolder('Sky')
    skyFolder.close()
    skyFolder.add(skyParams, 'turbidity', 0.0, 20.0, 0.1)
    skyFolder.add(skyParams, 'rayleigh', 0.0, 4, 0.001)
    skyFolder.add(skyParams, 'mieCoefficient', 0.0, 0.1, 0.001)
    skyFolder.add(skyParams, 'mieDirectionalG', 0.0, 1.0, 0.001)
    skyFolder.add(skyParams, 'elevation', 0.0, 90.0, 0.1)
    skyFolder.add(skyParams, 'azimuth', -180, 180, 0.1)
    skyFolder.add(skyParams.up, 'x', -100, 100, 5).name('up_x')
    skyFolder.add(skyParams.up, 'y', -100, 100, 5).name('up_y')
    skyFolder.add(skyParams.up, 'z', -100, 100, 5).name('up_z')


    let sunlightColor = new THREE.Color('#0b1637')
    let nightSunlightColor = new THREE.Color('#0b1637')
    let morningSunlightColor = new THREE.Color('#bd8b51')
    let daySunlightColor = new THREE.Color('#beada2')
    const getSunLight = (elevation) => {
        let alpha = 0
        if (elevation > 8.7) {
            sunlightColor.copy(daySunlightColor)
        } else if (elevation > 2.27 && elevation <= 8.7) {
            alpha = (elevation - 2.27) / 6.43 // (8.7 - 2.27)
            sunlightColor = morningSunlightColor.clone().lerpHSL(daySunlightColor, alpha)
        } else if (elevation > 0 && elevation <= 2.27) {
            alpha = 1 - (2.27 - elevation) / 2.27
            sunlightColor = nightSunlightColor.clone().lerpHSL(morningSunlightColor, alpha)
        }
        return sunlightColor
    }

    const skyParamsChanged = () => {
        const uniforms = sky.material.uniforms
        uniforms['turbidity'].value = skyParams.turbidity
        uniforms['rayleigh'].value = skyParams.rayleigh
        uniforms['mieCoefficient'].value = skyParams.mieCoefficient
        uniforms['mieDirectionalG'].value = skyParams.mieDirectionalG

        const upVec3 = new THREE.Vector3(skyParams.up.x, skyParams.up.y, skyParams.up.z)
        uniforms['up'].value.copy(upVec3)

        const phi = THREE.MathUtils.degToRad(90 - skyParams.elevation)
        const theta = THREE.MathUtils.degToRad(skyParams.azimuth)

        sun.setFromSphericalCoords(1, phi, theta)
        uniforms['sunPosition'].value.copy(sun)

        let { scene } = basicSetting
        scene?.fog?.color.set(getSunLight(skyParams.elevation))

        // ambientLight control
        commonParams.ambientLight.hue = skyParams.ambientLightH
        commonParams.ambientLight.saturation = skyParams.ambientLightS
        commonParams.ambientLight.lightness = skyParams.ambientLightL
        commonParams.ambientLight.intensity = skyParams.lightIntensity
        // ocean mode control
        commonParams.isOceanMode = skyParams.isNight
    }


    const nightSky = {
        elevation: 0.3,
        turbidity: 0,
        rayleigh: 0.2,
        mieCoefficient: 0.02,
        mieDirectionalG: 0.06,
        duration: 30,
        isNight: true,
         // #eef5f6 rgb(238, 245, 246) hsl(187, 0.31, 0.95)
         ambientLightH: 187,
         ambientLightS: 0.31,
         ambientLightL: 0.95,
         lightIntensity: 1.0,
    }
    const morningSky = {
        elevation: 2.27,
        turbidity: 10,
        rayleigh: 2.27,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.5,
        duration: 10,
        isNight: false,
        // #5f7b93    rgb(95, 123, 147) hsl(208, 0.21, 0.47)
        ambientLightH: 208,
        ambientLightS: 0.21,
        ambientLightL: 0.47,
        lightIntensity: 0.6,
    }
    const daySky = {
        elevation: 8.7,
        turbidity: 0,
        rayleigh: 3,
        duration: 20,
        isNight: false,
        // #dbf2ff  rgb(219, 242, 255) hsl(202, 1.0, 0.93)
        ambientLightH: 202,
        ambientLightS: 1.0,
        ambientLightL: 0.93,
        lightIntensity: 0.9,
    }

    let t1 = gsap.timeline({
        repeat: -1,
        repeatRefresh: true,
        defaults: {
            onUpdate: skyParamsChanged,
        },
        yoyo: true,
        paused: true,
    })
    let skyAnim = t1.fromTo(skyParams, nightSky, nightSky)
        .to(skyParams, morningSky)
        .to(skyParams, daySky)

    const params = {
        enabled: true,
        dayNightCycle: ONE_DAY,
    }
    const folder = gui.addFolder('Sky-Time Setting')
    folder.add(params, 'enabled')
    folder.add(params, 'dayNightCycle', [ONE_DAY, ONE_HOUR, HALF_HOUR, ONE_MINUTE])
    folder.add(skyParams, 'progress', 0, 1, 0.01).name('progress (when disabled)')

    let needCalibrate = true
    const paramsChanged = () => {
        if (params.enabled) {
            let multi = null
            if (params.dayNightCycle == ONE_DAY) {
                multi = 12 * 60
            } else if (params.dayNightCycle == ONE_HOUR) {
                multi = 30
            } else if (params.dayNightCycle == HALF_HOUR) {
                multi = 15
            } else if (params.dayNightCycle == ONE_MINUTE) {
                multi = 1
            }
            skyAnim.play() // plays forward
                .timeScale(1 / multi) // 2 = double speed, 0.5 = half speed

            if (needCalibrate && params.dayNightCycle == ONE_DAY) {
                needCalibrate = false
                let currDate = new Date(Date.now())
                let progress = (currDate.getHours() * 60 + currDate.getMinutes()) / (12 * 60)
                skyAnim.progress(progress) // 0.5 = half
            }
        } else {
            skyAnim.progress(skyParams.progress)
            skyAnim.pause()
            needCalibrate = true
        }
    }

    return {
        mesh: sky,
        onMeshChange: paramsChanged
    }
}


export default sky()