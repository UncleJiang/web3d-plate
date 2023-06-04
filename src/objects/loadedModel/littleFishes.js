import * as THREE from 'three'
import basicSetting from '../../basicScene'
import commonParams from '../../common'


const getFishMesh = (count, color) => {

    const fishShape = new THREE.Shape()
    fishShape.moveTo(0, 0)
    fishShape.lineTo(-2, 1.3)
    fishShape.lineTo(-5.5, 0.05)
    fishShape.lineTo(-6.5, 0.5)
    fishShape.lineTo(-6.5, -0.5)
    fishShape.lineTo(-5.5, -0.05)
    fishShape.lineTo(-2, -1.3)
    fishShape.lineTo(0, 0)

    const extrudeSettings = {
        steps: 2,
        depth: 0.6,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    }
    
    const geometry = new THREE.ExtrudeGeometry( fishShape, extrudeSettings )
    const material = new THREE.MeshPhongMaterial( { color: color } ) // '#dfd'

    const colorFragmentText = `
        #include <color_fragment>

        if(vNormal.x < 0.0) {
            diffuseColor *= vec4(1.0, 0.8, 0.6, 1.0);
        } else if (vNormal.y < 0.0) {
            diffuseColor = vec4(0.8, 1.0, 0.6, 1.0);
        } else if (vNormal.z < 0.0) {
            diffuseColor = vec4(0.8, 0.6, 1.0, 1.0);
        }
    `
    material.onBeforeCompile = (shader) => {
        // console.log('little fish shader uniform: ', shader.uniforms)
        // console.log('little fish shader vertex: ', shader.vertexShader)
        // console.log('little fish shader fragment: ', shader.fragmentShader)
        
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', colorFragmentText)
    }
    // const mesh = new THREE.Mesh( geometry, material )
    // const count = 50
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count)
    let matrix = new THREE.Matrix4()
    const p1 = new THREE.Vector2(-3, 3)
    const p2 = new THREE.Vector2(3, 3)
    const p3 = new THREE.Vector2(0, -2.1)
    const p4 = new THREE.Vector2(0, 3.9)
    const p5 = new THREE.Vector2(-3, -1.2)
    const p6 = new THREE.Vector2(3, 1.2)
    let scale = 0.4
    for (let i = 1; i < count + 1; i++) {
        scale = 0.4 + _.random(-0.2, 0.2)

        switch(i%6) {
            case 1:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p1.x,
                    0, 0, scale, p1.y,
                    0, 0, 0, scale
                )
                break
            case 2:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p2.x,
                    0, 0, scale, p2.y,
                    0, 0, 0, scale
                )
                break
            case 3:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p3.x,
                    0, 0, scale, p3.y,
                    0, 0, 0, scale 
                )
                break
            case 4:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p4.x,
                    0, 0, scale, p4.y,
                    0, 0, 0, scale
                )
                break
            case 5:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p5.x,
                    0, 0, scale, p5.y,
                    0, 0, 0, scale 
                )
                break
            case 0:
                matrix.set(
                    scale, 0, 0, (i/3) * 2,
                    0, scale, 0, p6.x,
                    0, 0, scale, p6.y,
                    0, 0, 0, scale
                )
                break
        }
        instancedMesh.setMatrixAt(i, matrix)
        // instancedMesh.instanceMatrix.needsUpdate
    }

    return instancedMesh
    
}

const littleFishes = () => {

    
    const mesh1 = getFishMesh(130, '#adf') // 50
    mesh1.position.set(10, 20, 0)
    mesh1.scale.set(0.4, 0.4, 0.4)
    basicSetting.scene.add(mesh1)
    mesh1.visible = false



    const mesh2 = getFishMesh(90, '#fdc')
    mesh2.position.set(-60, 30, -10)
    mesh2.scale.set(0.3, 0.3, 0.3)
    basicSetting.scene.add(mesh2)
    mesh2.visible = commonParams.isOceanMode
    mesh2.visible = false


    const onMeshChange = () => {
        mesh1.visible = commonParams.isOceanMode
        mesh2.visible = commonParams.isOceanMode

        if (!commonParams.isOceanMode) return
        
        if (mesh1.position.x > 130) {
            mesh1.position.x = -150
        }
        if (mesh2.position.x > 90) {
            mesh2.position.x = -110
        }
        mesh1.position.x += 0.1
        mesh1.position.y += 0.001
        // mesh.position.y = Math.sin(mesh.position.x * 0.03) * 0.2 + 20
        mesh1.position.z = Math.sin(mesh1.position.x * 0.1) * 7

        mesh2.position.x += 0.05
        mesh2.position.y += 0.001
        // mesh.position.y = Math.sin(mesh.position.x * 0.03) * 0.2 + 20
        mesh2.position.z = Math.cos(mesh2.position.x * 0.1) * 7 - 13
    }

    // basicSetting.scene.add(unitMesh)
    return {
        // mesh,
        onMeshChange
    }


}

export default littleFishes()