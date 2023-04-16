import './style.css'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const stats = new Stats()
document.body.appendChild(stats.dom)

// canvas
const canvas = document.querySelector('canvas.webgl')
canvas.width = window.innerWidth
canvas.height = window.innerHeight + 100 // to enable the scroll animation of gsap

window.addEventListener('scroll', () => {
    console.log('scrollY canvas: ', window.scrollY)
})


// scene
const scene = new THREE.Scene()


// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas }) // WebGL1Renderer cannot identify matnxm type
// renderer.shadowMap.enabled = true // enable the shadow
// renderer.shadowMap.type = THREE.BasicShadowMap

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
    stats,
}


export default basicSetting