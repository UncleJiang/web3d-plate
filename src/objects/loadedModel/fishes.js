import _ from 'lodash'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import basicSetting from '../../basicScene'
import commonParams from '../../common'

const fishModels = {
    mesh: null,
    meshes: {},
    mixers: [],
    onMeshChange: null,
}


const initAndCloneModel = (baseModel, baseName, cloneCount, alterFn) => {

    fishModels.meshes[`${baseName}`] = baseModel.scene
    fishModels.meshes[`${baseName}`].name = baseName
    alterFn(baseModel)

    if (cloneCount == 0) return
    for(let i = 0; i < cloneCount; i++) {
        const name = `${baseName}${i+1}`
        const model = _.assign({}, baseModel)
        const newObject = new THREE.Group()
        newObject.copy(model.scene, true)
        model.scene = newObject
        // model.scenes[0] = model.scene // TODO 为什么都被赋值给了最后一个model的scene
        console.log('clone modelL: ', model)
        fishModels.meshes[`${name}`] = newObject
        fishModels.meshes[`${name}`].name = name
        alterFn(model)
    }
}

const loadFishes = () => {

    const onFishesChange = (elapsedTime, deltaTime) => {
        // mixer1.update(deltaTime)
        // mixer2.update(deltaTime)
        if (!commonParams.isOceanMode) return

        fishModels.mixers.forEach((mixer) => mixer.update(deltaTime))

        for(let mesh in fishModels.meshes) {
            if (fishModels.meshes[mesh].position.x > 62) {
                fishModels.meshes[mesh].position.x = -62
            }
        }
        fishModels.meshes.manta.position.x += 0.03
        fishModels.meshes.manta.position.y += (Math.sin(0.5 * fishModels.meshes.manta.position.x) * 0.05)
    
        fishModels.meshes.shark.position.x += 0.05
        // fishModels.meshes.shark.position.y += 0.05

        fishModels.meshes.whale.position.x += 0.05
        fishModels.meshes.whale.position.y += 0.001


        
    }

    const onLoad = () => {
        const objects = fishModels.meshes
        for (let mesh in objects) {
            basicSetting.scene.add(objects[mesh])
            objects[mesh].visible = commonParams.isOceanMode
        }

        fishModels.onMeshChange = onFishesChange

    }

    const onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log('Total fish models: ' + (itemsLoaded / itemsTotal * 100) + '% loaded ---model' )
    }

    const onError = (e) => {
        console.log('total fish model error: ', e)
    }

    const manager = new THREE.LoadingManager(onLoad, onProgress, onError)
    const gltfLoader = new GLTFLoader(manager)
    gltfLoader.load(
        // 资源的URL
        "models/fishes/manta.glb",
        function (obj ) {
            
            const activeManta = (obj) => {
                console.log('alterFn obj model: ', obj)
                const mixer = new THREE.AnimationMixer(obj.scene)
                mixer.clipAction(obj.animations[0]).play()
                fishModels.mixers.push(mixer)

                // shadow
                obj.scene.children.forEach((mesh) => {
                    mesh.castShadow = true
                })
                // transformation
                obj.scene.rotateY(Math.PI * 0.5)
                obj.scene.position.set(_.random(-60, 60), _.random(20, 24), _.random(10, 20))
            }
            initAndCloneModel(obj, 'manta', 0, activeManta)

        }
    )

    gltfLoader.load(
        'models/fishes/whale.glb',
        function (obj ) {
            
            fishModels.meshes.whale = obj.scene
            fishModels.meshes.whale.animations = obj.animations
            fishModels.meshes.whale.name = 'shark'
            
            const mixer = new THREE.AnimationMixer(obj.scene)
            mixer.clipAction(obj.animations[0]).play()
            fishModels.mixers.push(mixer)

            const whale = fishModels.meshes.whale
            whale.scale.set(3, 3, 3)
            whale.rotateY(Math.PI * 0.5)
            whale.position.set(0, 23, -4)
            
            console.log('whale obj: ', obj)
        }
    )

    gltfLoader.load(
        'models/fishes/shark.glb',
        function (obj ) {
            
            fishModels.meshes.shark = obj.scene
            fishModels.meshes.shark.animations = obj.animations
            fishModels.meshes.shark.name = 'shark'
            
            const mixer = new THREE.AnimationMixer(obj.scene)
            mixer.clipAction(obj.animations[0]).play()
            fishModels.mixers.push(mixer)

            const shark = fishModels.meshes.shark
            shark.rotateY(Math.PI * 0.5)
            shark.position.set(-30, 25, 4)
            
            console.log('shark obj: ', obj)
        }
    )


    return fishModels

}

export default loadFishes()