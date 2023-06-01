import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import commonParams from '../common.js'
import basicSetting from '../basicScene.js'

gsap.registerPlugin(ScrollTrigger)

class TrackControl {
    enabled = false

    constructor(props) {
        this.camera = props?.camera
        this.curve = props?.curve
        this.enabled = props?.enabled || false

        if (!this.camera || !this.curve) return

        this.segmentNum = props?.segmentNum || 5
        this.cameraLookAt = props?.cameraLookAt || new THREE.Vector3(0, 0, 0)

        this.points = this.curve.getPoints(this.segmentNum)
        console.log('this.points: ', this.points)

        let target = { index: 0 }
        this.anim = gsap.to(target, {
            index: this.segmentNum,
            duration: 5,
            scrollTrigger: {
                // trigger: 'canvas.webgl',
                trigger: '.scroll-controller',
                start: 'top top',
                end: 'bottom bottom', // 增多每像素移动所花费的step
                scrub: 1,
                markers: true,
            },
            onUpdate: () => {
                console.log('===gsap=scroll=target======', target)
                this.camera.position.copy(this.points[Math.round(target.index)])
                this.camera.lookAt(this.cameraLookAt)
                // renderer.render(scene, this.camera)

            },
            paused: true,
        })


        this.update = function() {
            if (!this.enabled) return
            window.addEventListener('mousemove', handleMouseMove)
            // window.addEventListener('wheel', handleMouseWheel)
        }

        this.dispose = function() {
            window.removeEventListener('mousemove', handleMouseMove)
            // window.removeEventListener('wheel', handleMouseWheel)
            scope.anim.kill()
        }

        const scope = this
        const { sizes } = commonParams

        function handleMouseMove(event) {
            // console.log('=======move========', scope.camera.position)
            scope.camera.position.x += (event.clientX / sizes.width - 0.5) * 0.02
            scope.camera.position.y -= (event.clientY / sizes.height - 0.5) * 0.02
            // renderer.render(scene, this.camera)
        }


    }

}

export default TrackControl