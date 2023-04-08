import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


// canvas
const canvas = document.querySelector('canvas.webgl')
canvas.width = window.innerWidth
canvas.height = window.innerHeight + 100 // to enable the scroll animation of gsap



// scene
const scene = new THREE.Scene()

// traversed into camera folder
// // camera
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
// camera.name = 'mainCamera'
// scene.add(camera)
// camera.position.y = 19.7
// camera.position.z = 40.7

// // control
// const orbitControl = new OrbitControls(camera, canvas)
// orbitControl.update()

// camera.bindedControl = orbitControl


// renderer
const renderer = new THREE.WebGL1Renderer({ canvas: canvas })


// example object
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshBasicMaterial({ color: '#fff' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// handle full screen
const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
})


const basicSetting = {
    canvas,
    scene,
    // camera,
    renderer,
    mesh,
    // orbitControl,
}


export default basicSetting