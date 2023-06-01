import * as THREE from 'three'
// import { UnpackDepthRGBAShader } from 'three/examples/jsm/shaders/UnpackDepthRGBAShader.js'

import basicSetting from '../basicScene.js'
import vertexShader from '../shaders/caustics_vertex.glsl'
import fragmentShader from '../shaders/caustics_fragment.glsl'


const { renderer } = basicSetting

const rtWidth = 1024
const rtHeight = 1024

const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight)

const rtFov = 90
const rtAspect = rtWidth / rtHeight
const rtNear = 0.1
const rtFar = 5
const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar) // 结合plane的size,使渲染出的texture只包含plane
rtCamera.position.z = 2.5
const rtScene = new THREE.Scene()
rtScene.background = new THREE.Color('white')

const rtGeometry = new THREE.PlaneGeometry(5, 5)
const tempMaterial = new THREE.MeshBasicMaterial({ color: '#fff' })
// const rtMaterial = new THREE.ShaderMaterial({
//   vertexShader: vertexShader,
//   fragmentShader: fragmentShader,
//   uniforms: {
//     baseShadow: {value: null},
//     caustics: {value: null},
//     // cameraNear: {value: 10.},
//     // cameraFar: {value: 20.}
//   }
// })
// const plane = new THREE.Mesh(rtGeometry, rtMaterial)
// rtScene.add(plane)

let rtMaterial
let plane


const getRenderTarget = (baseMap, causticsMap) => {
  
  if (rtMaterial) {
    rtMaterial.dispose()
  }
  // if (plane) {
  //   rtScene.remove(plane)
  // }

  rtMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      baseShadow: {value: baseMap},
      caustics: {value: causticsMap},
      // cameraNear: {value: 10.},
      // cameraFar: {value: 20.}
    }
  })


  const plane = new THREE.Mesh(rtGeometry, rtMaterial)
  rtScene.add(plane)

  // TODO: 修改上面不断新建Mesh的实现方式
  // rtMaterial.uniforms.baseShadow.value = baseMap
  // rtMaterial.uniforms.caustics.value = causticsMap
  // rtMaterial.needsUpdate = true
      
  renderer.setRenderTarget(renderTarget)
  renderer.render(rtScene, rtCamera)
  renderer.setRenderTarget(null)


  // console.log('processed shadow: ', renderTarget)
  return renderTarget
}

export default getRenderTarget