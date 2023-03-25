import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import gui from './utils/gui.js'

// common config
gui.addFolder('Common')


// canvas
const canvas = document.querySelector('canvas.webgl')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// scene
const scene = new THREE.Scene()


// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
scene.add(camera)
camera.position.z = 10

// control
const orbitControl = new OrbitControls(camera, canvas)
orbitControl.update()


// renderer
const renderer = new THREE.WebGL1Renderer({ canvas: canvas })


// objects
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshBasicMaterial({color: '#fff'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



// handle full screen
const btn = document.getElementById("btn")
btn.addEventListener('click', () => {
     if(!document.fullscreenElement) {
        canvas.requestFullscreen()
    }
})


const basicSetting = {
    canvas,
    scene,
    camera,
    renderer,
    mesh,
    orbitControl,
}


export default basicSetting