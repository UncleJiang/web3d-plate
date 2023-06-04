import * as THREE from 'three'
import gui from '../../utils/gui.js'


class SphereObj {
    params = {
        radius: 3,
        visible: true,
        enableAnim: true,
    }
    folder = null
    geometry = null
    material = null
    _mesh = null
    name = ''

    constructor(name = 'sphere') {
        this.name = name
        this.folder = gui.addFolder(name)
        this.folder.close()
        this.folder.add(this.params, 'radius', 1, 10, 0.5)
        this.folder.add(this.params, 'visible')
        this.folder.add(this.params, 'enableAnim')

        this.geometry = new THREE.SphereGeometry(this.params.radius)
        this.material = new THREE.MeshBasicMaterial({ color: '#fff' })
        this._mesh = new THREE.Mesh(this.geometry, this.material)
        this._mesh.name = name
        this._mesh.position.x = 4
    }

    get mesh() {
        console.log('get sphere mesh')
        return this._mesh
    }

    set name(name) {
        this.name = name
        this.folder.name = name
        this._mesh.name = name
    }

    onMeshChange() {
        this._mesh.visible = this.params.visible
        if (this.params.enableAnim) {
            // TODO: change the geometry's size correctly, renew one insteadly
            this._mesh.position.y = this.params.radius
        }
    }
}

export default SphereObj


