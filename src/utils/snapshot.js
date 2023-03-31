import * as THREE from 'three'

import basicSetting from '../basicScene.js'

/*
* Using snapshots to save multiple transform modifications
* only for object3D whose name has been set.
*/

const snapshotArr = []
let currSnapshotIndex = 0
const createSnapshot = () => {
    // cannot modify any properties inside this function

    const { scene } = basicSetting
    const objectsInfo = scene.children.filter(obj => !!obj.name)

    const snapshotInfo = {}
    objectsInfo.forEach(element => { // deep copy to save multiple snapshots
        snapshotInfo[`${element.name}`] = {
            matrix: element.matrix.clone(),
            matrixWorld: element.matrixWorld.clone(),
            quaternion: element.quaternion.clone(),
            position: element.position.clone(),
            rotation: element.rotation.clone(),
            scale: element.scale.clone()
        }
    })
    snapshotArr.push(snapshotInfo)

    currSnapshotIndex = snapshotArr.length - 1

    console.log('Current snapshot info: ', snapshotInfo)
    console.log('Current snapshot details: ', objectsInfo)


    // console.log('snapshot arr: ', snapshotArr)

}
const switchSnapshot = () => {
    if (currSnapshotIndex == 0) {
        currSnapshotIndex = snapshotArr.length
    }
    --currSnapshotIndex

    const appliedSnapshot = snapshotArr[currSnapshotIndex]
    const { scene } = basicSetting

    for (const [key, value] of Object.entries(appliedSnapshot)) {
        console.log('switch: ', currSnapshotIndex, key, value)
        const obj = scene.getObjectByName(`${key}`)

        // TODO： 应用matrix与matrixWorld来修改

        // Alternative: 单独手动设置
        obj.position.copy(value.position)
        obj.scale.copy(value.scale)
        obj.quaternion.copy(value.quaternion)
    }
}

const snapshotParams = {
    snapshotCount: snapshotArr.length, // 有单独的UI板块时展示
    createSnapshot,
    switchSnapshot,
}

export default snapshotParams