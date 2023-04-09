import * as THREE from 'three'

import gui from './gui.js'
import basicSetting from '../basicScene.js'
import transformControl from './transformControl.js'
import mainCamera from '../cameras/mainCamera.js'
import getCamera from '../cameras/cameraHandler.js'

const {
    canvas,
    scene,
    renderer,
} = basicSetting
const camera = getCamera('mainCamera')


class CurveEditor {

    name = ''
    enabled = false
    onEditComplete = null

    curve = null
    splineHelperObjects = []
    splinePointsLength = 4
    positions = []
    point = new THREE.Vector3()

    geometry = new THREE.BoxGeometry( 2, 2, 2 )


    ARC_SEGMENTS = 200

    folder = gui.addFolder('Curve editor')
    params = {
        visible: true,
        editDone: () => this.editDone(),
        addPoint: () => this.addPoint(),
        removePoint: () => this.removePoint(),
        exportSpline: () => this.exportSpline()
    }

    constructor(name, onEditComplete) {
        this.name = name
        this.enabled = true
        this.params.visible = true
        this.onEditComplete = onEditComplete

        this.init()
    }

    set enabled(v) {
        this.enabled = v
        this.params.visible = v
    }

    init() {

        const helper = new THREE.GridHelper( 2000, 100 )
        helper.position.y = - 199
        helper.material.opacity = 0.25
        helper.material.transparent = true
        scene.add( helper )

        renderer.shadowMap.enabled = true


        this.folder.add( this.params, 'visible' ).onChange( () => this.render() )
        this.folder.add( this.params, 'editDone' )
        this.folder.add( this.params, 'addPoint' )
        this.folder.add( this.params, 'removePoint' )
        this.folder.add( this.params, 'exportSpline' )

        transformControl.addEventListener( 'objectChange', () => {
            this.updateSplineOutline()
        } )


        /*******
         * Curves
         *********/

        for ( let i = 0; i < this.splinePointsLength; i ++ ) {

            this.addSplineObject( this.positions[i] )

        }

        this.positions.length = 0

        for ( let i = 0; i < this.splinePointsLength; i ++ ) {

            this.positions.push( this.splineHelperObjects[i].position )

        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.ARC_SEGMENTS * 3 ), 3 ) )


        this.curve = new THREE.CatmullRomCurve3( this.positions )
        this.curve.curveType = 'chordal'
        this.curve.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
            color: 0x0000ff,
            opacity: 0.35
        } ) )
        this.curve.mesh.castShadow = true

        scene.add(this.curve.mesh)


        this.load( [
            new THREE.Vector3( -10, 0, 10 ),
            new THREE.Vector3( -5, 5, 5 ),
            new THREE.Vector3( 0, 0, 0 ),
            new THREE.Vector3( 5, -5, 5 ),
            new THREE.Vector3( 10, 0, 10 ),
        ] )

        this.render()

    }

    addSplineObject( position ) {

        const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )
        const object = new THREE.Mesh( this.geometry, material )
        object.name = 'curveEditorHelperCube'

        if ( position ) {

            object.position.copy( position )

        } else {

            object.position.x = Math.random() * 100 - 50
            object.position.y = Math.random() * 60
            object.position.z = Math.random() * 80 - 40

        }

        object.castShadow = true
        object.receiveShadow = true
        scene.add( object )
        this.splineHelperObjects.push( object )
        console.log('cube object pos: ', object.position)
        return object

    }

    addPoint() {

        this.splinePointsLength ++

        this.positions.push( this.addSplineObject().position )

        this.updateSplineOutline()

        this.render()

    }

    removePoint() {

        if ( this.splinePointsLength <= 4 ) {

            return

        }

        const point = this.splineHelperObjects.pop()
        this.splinePointsLength --
        this.positions.pop()

        if ( transformControl.object === point ) transformControl.detach()
        scene.remove( point )

        this.updateSplineOutline()

        this.render()

    }

    updateSplineOutline() {

        const splineMesh = this.curve.mesh
        const position = splineMesh.geometry.attributes.position

        for ( let i = 0; i < this.ARC_SEGMENTS; i ++ ) {

            const t = i / ( this.ARC_SEGMENTS - 1 )
            this.curve.getPoint( t, this.point )
            position.setXYZ( i, this.point.x, this.point.y, this.point.z )

        }
        console.log('curve pos arr: ', position.array)

        position.needsUpdate = true


    }

    exportSpline() {

        const strplace = []

        for ( let i = 0; i < this.splinePointsLength; i ++ ) {

            const p = this.splineHelperObjects[i].position
            strplace.push( `new THREE.Vector3(${p.x}, ${p.y}, ${p.z})` )

        }

        console.log( strplace.join( ',\n' ) )
        const code = '[' + ( strplace.join( ',\n\t' ) ) + ']'
        prompt( 'copy and paste code', code )

    }

    load( new_positions ) {

        while ( new_positions.length > this.positions.length ) {

            this.addPoint()

        }

        while ( new_positions.length < this.positions.length ) {

            this.removePoint()

        }

        for ( let i = 0; i < this.positions.length; i ++ ) {

            this.positions[i].copy( new_positions[i] )

        }

        this.updateSplineOutline()

    }

    render() {
        this.curve.mesh.visible = this.params.visible
        for (let object of this.splineHelperObjects) {
            object.visible = this.params.visible
        }
        renderer.render( scene, camera )
    }

    getCurve() {
        return this.curve
    }

    editDone() {
        this.onEditComplete(this.curve)
        this.enabled = false
        this.params.visible = false
    }

}

export default CurveEditor