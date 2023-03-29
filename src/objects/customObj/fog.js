import * as THREE from 'three'

import gui from '../../utils/gui'


// TODO: 作为scene的属性单独去定义
const fog = () => {
    const fog = new THREE.Fog('#d2d2d2', 10, 100)

    const params = {
        fogNear: 10,
        fogFar: 100,
        fogColor: { string: '#d2d2d2' },
        fogVisible: true,
    }

    const folder = gui.addFolder('Fog')
    folder.addColor(params.fogColor, 'string').name('fog_color')
    folder.add(params, 'fogNear', 0, 100, 10).name('fog_near')
    folder.add(params, 'fogFar', 0, 1000, 20).name('fog_far')
    folder.add(params, 'fogVisible')

    const onFogChange = (scene) => {
        if (params.fogVisible) {
            scene.fog = fog
            scene.fog.color.set(params.fogColor.string)
            scene.fog.near = params.fogNear
            scene.fog.far = params.fogFar
        } else {
            scene.fog = null
        }
        
    }

    return {
        onMeshChange: onFogChange
    }

}

export default fog()