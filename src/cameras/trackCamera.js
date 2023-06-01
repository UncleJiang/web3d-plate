import * as THREE from 'three'
import gsap from 'gsap'

import TrackControl from '../utils/TrackControl.js'
// import basicSetting from '../basicScene.js'
import commonParams from '../common.js'
import CurveEditor from '../utils/curveEditor.js'
import gui from '../utils/gui.js'

const trackCamera = () => {
    const positions = [
        new THREE.Vector3(0, 19.7, 40.7),
        new THREE.Vector3(8, 9, 37), // lizard的位置
        new THREE.Vector3(11, 12, 5),
        new THREE.Vector3(-7, 18, 1),
        new THREE.Vector3(-1.5, 21, 15),
        new THREE.Vector3(-1, 26, 1),
        new THREE.Vector3(-49, 55, 1.4),
        new THREE.Vector3(-86, 98, 105),
        new THREE.Vector3(-9, 15, 38),
        new THREE.Vector3(0, 19.7, 40.7),
    ]
    const ARC_SEGMENTS = 150

    const curve = new THREE.CatmullRomCurve3(positions)
    curve.curveType = 'chordal'

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) )
    const material = new THREE.LineBasicMaterial({ color: '#ffff00' })

    curve.mesh = new THREE.Line(geometry, material)
    // const curve = new CurveEditor().getCurve()
    let curveEditor = null

    const { sizes } = commonParams
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.name = 'trackCamera'
    camera.position.copy(new THREE.Vector3(0, 19.7, 40.7))

    // TODO: set initial lookat

    const _trackControl = new TrackControl({
        camera: camera,
        cameraLookAt: new THREE.Vector3(0, 19.4, 7.57),
        curve: curve,
        segmentNum: ARC_SEGMENTS,
    })

    camera.bindedControl = _trackControl

    camera.setCurve = (curve) => {
        if (!_trackControl) return

        _trackControl.dispose()
        const trackControl = new TrackControl({
            camera: camera,
            cameraLookAt: new THREE.Vector3(0, 19.4, 7.57),
            curve: curve,
            segmentNum: ARC_SEGMENTS,
        })
        camera.bindedControl = trackControl
    }

    camera.editCurve = () => {
        if (!_trackControl) return

        if (!curveEditor) {
            curveEditor = new CurveEditor(camera.name, camera.setCurve)
        } else {
            curveEditor.enabled = true
        }
    }

    const folder = gui.addFolder('trackCamera')
    folder.add(camera, 'editCurve')

    return camera
}

export default trackCamera()