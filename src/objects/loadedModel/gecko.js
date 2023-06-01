import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

import basicSetting from '../../basicScene'




const geckoModel = {
    mesh: null,
    onMeshChange: null,
}

let geckoMtl

const loadGecko = () => {

    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512)
    const mirrorSphereCamera = new THREE.CubeCamera(0.05, 50, cubeRenderTarget) // TODO: paramalize
    basicSetting.scene.add(mirrorSphereCamera)

    const mirrorSphereMtl = new THREE.MeshBasicMaterial({ // 待调整
        envMap: cubeRenderTarget.texture
    })

    const modifyMtl = (mtl) => {
        const bodyMaterial = new THREE.MeshStandardMaterial({ // TODO: paramlize
            color: '#fff',
            roughness: 0.4,
        })
        const spotMaterial = new THREE.MeshStandardMaterial({ // TODO: paramlize
            color: '#d1b',
            roughness: 0.2,
        })

        mtl.materials.mat5 = spotMaterial
        mtl.materials.mat3 = bodyMaterial
        mtl.materials.mat0 = mirrorSphereMtl

        return mtl
    }


    
    const onGeckoChange = () => {
        const eyeMeshL = geckoModel.mesh.getObjectByName('mesh521616420')
        const eyeMeshR = geckoModel.mesh.getObjectByName('mesh121355826')

        eyeMeshL.visible = false // 避免循环调用
        eyeMeshR.visible = false
        
        mirrorSphereCamera.position.copy(eyeMeshL.position)
        mirrorSphereCamera.update(basicSetting.renderer, basicSetting.scene)

        eyeMeshL.visible = true
        eyeMeshR.visible = true
    }

    const loadModel = () => {
        
        geckoModel.mesh.castShadow = true // invalid
        geckoModel.mesh.children.forEach((mesh) => { // valid
            mesh.castShadow = true
        })
        basicSetting.scene.add(geckoModel.mesh)
        geckoModel.mesh.rotateY(Math.PI * 1.2)
        geckoModel.mesh.scale.set(6, 6, 6) // 4
        geckoModel.mesh.position.set(12, 13, 35)

        // const eyeMeshL = geckoModel.mesh.getObjectByName('mesh521616420')
        // const eyeMeshR = geckoModel.mesh.getObjectByName('mesh121355826')
        // eyeMeshL.material = mirrorSphereMtl
        // eyeMeshR.material = mirrorSphereMtl
        

        geckoModel.onMeshChange = onGeckoChange


        // test shadow
        const sphereGeometry = new THREE.SphereGeometry(3, 16)
        // const planeMaterial = new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.4 })
        
        const planeMaterial = new THREE.MeshPhongMaterial( {
            color: 0xa0adaf,
            shininess: 150,
            specular: 0x111111
        } )

        const sphere = new THREE.Mesh(sphereGeometry, planeMaterial)
        sphere.castShadow = true
        basicSetting.scene.add(sphere)
        sphere.position.copy(geckoModel.mesh.position)
        sphere.position.x -= 4
        sphere.position.y += 3
        

        const material = new THREE.MeshPhongMaterial( {
            color: 0xa0adaf,
            shininess: 150,
            specular: 0x111111
        } )

        const planeGeometry = new THREE.PlaneGeometry(80, 80)
        const plane = new THREE.Mesh(planeGeometry, material)
       
        // plane.material.side = THREE.DoubleSide
        plane.castShadow = true // TODO: ?? 无效
        plane.receiveShadow = true
        // basicSetting.scene.add(plane)
        // plane.visible = false
        

        plane.rotateX(-Math.PI * 0.5)
        plane.position.copy(geckoModel.mesh.position)
        plane.position.y -= 2

    }

    const loadMesh = () => {
        objLoader.load(
            // 资源的URL
            "models/gecko/model.obj",

            // onLoad回调
            // Here the loaded data is assumed to be an object
            function (obj ) {
                // Add the loaded object to the scene
                // scene.add( obj );
                
                geckoModel.mesh = obj
                
                

                console.log('gecko obj: ', obj)
                // return obj
            },

            // onProgress回调
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded ---model' )
                // console.log('model.Mat: ', geckoModel.material)

            },

            // onError回调
            function ( err ) {
                console.error( 'An error happened----model' )
            }

            
        )
    }

    const manager = new THREE.LoadingManager(loadModel)
    const mtlManager = new THREE.LoadingManager(loadMesh)



        const objLoader = new OBJLoader(manager)

        const mtlLoader = new MTLLoader(mtlManager)

        mtlLoader.setMaterialOptions().load('models/gecko/materials.mtl',
            function (mtl) {
                geckoMtl = modifyMtl(mtl)
                
                objLoader.setMaterials(geckoMtl)
                // TODO: 修改material
                
                console.log('gecko mtl: ', mtl)
            },
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded ---mtl' )
                // console.log('model.Mat: ', geckoModel.material)

            },

            // onError回调
            function ( err ) {
                console.error( 'An error happened---- mtl' )
            }
        )

        return geckoModel

}

export default loadGecko()