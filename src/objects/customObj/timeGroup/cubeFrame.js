import * as THREE from 'three'

import gui from '../../../utils/gui.js'


const cubeFrame = () => {

    // 使用curve -> tubeGeometry -> 通过顶点上色达到碎玻璃的质感
    const lineSize = 10
    const lineCurveObject = {
        lineCurve1: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, lineSize, lineSize),
            new THREE.Vector3(-lineSize, lineSize, lineSize)
        ),
        lineCurve2: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, lineSize, lineSize),
            new THREE.Vector3(-lineSize, -lineSize, lineSize)
        ),
        lineCurve3: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, -lineSize, lineSize),
            new THREE.Vector3(lineSize, -lineSize, lineSize)
        ),
        lineCurve4: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, -lineSize, lineSize),
            new THREE.Vector3(lineSize, lineSize, lineSize)
        ),
        lineCurve5: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, lineSize, lineSize),
            new THREE.Vector3(lineSize, lineSize, -lineSize)
        ),
        lineCurve6: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, lineSize, lineSize),
            new THREE.Vector3(-lineSize, lineSize, -lineSize)
        ),
        lineCurve7: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, -lineSize, lineSize),
            new THREE.Vector3(-lineSize, -lineSize, -lineSize)
        ),
        lineCurve8: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, -lineSize, lineSize),
            new THREE.Vector3(lineSize, -lineSize, -lineSize)
        ),
        lineCurve9: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, lineSize, -lineSize),
            new THREE.Vector3(-lineSize, lineSize, -lineSize)
        ),
        lineCurve10: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, lineSize, -lineSize),
            new THREE.Vector3(-lineSize, -lineSize, -lineSize)
        ),
        lineCurve11: new THREE.LineCurve3(
            new THREE.Vector3(-lineSize, -lineSize, -lineSize),
            new THREE.Vector3(lineSize, -lineSize, -lineSize)
        ),
        lineCurve12: new THREE.LineCurve3(
            new THREE.Vector3(lineSize, -lineSize, -lineSize),
            new THREE.Vector3(lineSize, lineSize, -lineSize)
        )
    }

    const generateVertexColors = ( geometry ) => {

        const positionAttribute = geometry.attributes.position

        const colors = []
        const color = new THREE.Color()

        for ( let i = 0, il = positionAttribute.count; i < il; i ++ ) {

            color.setHSL( i / il * Math.random(), 0.3, 0.9 )
            colors.push( color.r, color.g, color.b )

        }

        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) )

    }
    const cubeGeometryParams = {
        segements: 32,
        radius: 0.2,
        radialSegment: 8
    }

    const cubeMaterial = new THREE.MeshBasicMaterial({
        color: '#fff9eb',
        // vertexColors: true,
        // side: THREE.DoubleSide,
        // transparent: true,
        // opacity: 0.7
    })

    const cubeGroup = new THREE.Group()
    cubeGroup.name = 'cubeGroup'
    for (let i = 0; i < 12; i ++) {

        const cubeGeometry = new THREE.TubeGeometry(
            lineCurveObject[`lineCurve${i + 1}`],
            cubeGeometryParams.segements,
            cubeGeometryParams.radius,
            cubeGeometryParams.radialSegment
        )

        generateVertexColors(cubeGeometry)
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cubeGroup.add(cube)
        cubeMaterial.needsUpdate = true
    }
    cubeGroup.position.set(0, -0.66, 0)
    // cubeGroup.scale.set(0.75, 0.67, 0.67)
    cubeGroup.scale.set(0.67, 0.67, 0.67)

    const onGroupChange = () => {
        cubeGroup.rotateX(0.002 * Math.random())
        cubeGroup.rotateY(-0.002)
        cubeGroup.rotateZ(-0.002)
    }

    return {
        mesh: cubeGroup,
        onMeshChange: onGroupChange,
    }
}

export default cubeFrame()