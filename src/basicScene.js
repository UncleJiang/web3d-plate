import './style.css'
import * as THREE from 'three'

// canvas
const canvas = document.querySelector('canvas.webgl')
canvas.width = window.innerWidth
canvas.height = window.innerHeight + 100 // to enable the scroll animation of gsap


// scene
const scene = new THREE.Scene()


// renderer
const renderer = new THREE.WebGL1Renderer({ canvas: canvas })


// object sample
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
    renderer,
    mesh,
}


export default basicSetting