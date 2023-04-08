import * as THREE from 'three'
import gsap from 'gsap'

import TrackControl from '../utils/TrackControl.js'
// import basicSetting from '../basicScene.js'
import commonParams from '../common.js'

const trackCamera = () => {
    const positions = [
        new THREE.Vector3( -10, 0, 10 ),
        new THREE.Vector3( -5, 5, 5 ),
        new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( 5, -5, 5 ),
        new THREE.Vector3( 10, 0, 10 )
    ]
    const ARC_SEGMENTS = 50

    const curve = new THREE.CatmullRomCurve3(positions)
    curve.curveType = 'chordal'

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) );
    const material = new THREE.LineBasicMaterial({ color: '#ffff00' })

    curve.mesh = new THREE.Line(geometry, material)

    const { sizes } = commonParams
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.name = 'trackCamera'

    const trackControl = new TrackControl({
        camera: camera,
        curve: curve,
        segmentNum: ARC_SEGMENTS,
    })

    camera.bindedControl = trackControl
    return camera
}

export default trackCamera()