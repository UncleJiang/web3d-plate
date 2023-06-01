import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import basicSetting from '../../basicScene'

const mantaModel = {
    mesh: null,
    onMeshChange: null,
}

const loadManta = () => {

    const onMantaChange = () => {
        // 
    }

    const loadModel = () => {
        mantaModel.mesh.castShadow = true // invalid
        // mantaModel.mesh.children.forEach((mesh) => { // valid
        //     mesh.castShadow = true
        // })
        basicSetting.scene.add(mantaModel.mesh)
        mantaModel.mesh.rotateY(Math.PI * 1.2)
        mantaModel.mesh.position.set(-12, 13, 35)

        mantaModel.onMeshChange = onMantaChange
    }

    // const manager = new THREE.LoadingManager(loadMesh)
    const gltfLoader = new GLTFLoader()
    gltfLoader.load(
        // 资源的URL
        "models/manta/model.glb",

        // onLoad回调
        // Here the loaded data is assumed to be an object
        function (obj ) {
            // Add the loaded object to the scene
            // scene.add( obj );
            
            mantaModel.mesh = obj.scene
            
            

            console.log('manta obj: ', obj)
            loadModel()
            // return obj
        },

        // onProgress回调
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded ---model' )
            // console.log('model.Mat: ', mantaModel.material)

        },

        // onError回调
        function ( err ) {
            console.error( 'An error happened----model' )
        }

        
    )


    return mantaModel

}

export default loadManta()