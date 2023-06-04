import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import gui from '../../../utils/gui.js'

const fontLoader = new FontLoader()


export default class TimeText {
    fontJsonPath = './fonts/Rajdhani/Rajdhani_Regular.json'
    font = null
    textStr = ''
    name = ''

    folder = null
    textGeometryParams = {
        size: 5.5,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.4,
        bevelOffset: 0,
        bevelSegments: 4,
    }
    textMaterialParams = {
        color: { string: '#948f84' },
        // reflectivity: 0.5,
        refractionRatio: 0.84,
        // roughness: 0.5,
        // metalness: 0.5,
        // emissive: { string: '#ffffff' },
        // emissiveIntensity: 0.5,
        // opacity: 0.8,
        // transparent: true,
    }

    geometry = null
    material = null
    textMesh = null
    renderGroup = null

    timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        hour12: false,
    }
    timeFormatter = null

    constructor(name = '') {
        this.name = name
        this.renderGroup = new THREE.Group() // TODO: 以group为单位给transformControl附着
        this.renderGroup.name = name
        this.renderGroup.layers.enable(2)

        this.timeFormatter = new Intl.DateTimeFormat('en-US', this.timeOptions)
        this.textStr = this.timeFormatter.format(Date.now())
        this.initGuiFolder()
        this.load()
        // TODO: improve time accuracy
        setInterval(() => {
            this.refreshText()
        }, 15000) // refresh time text every 15 seconds
    }

    initGuiFolder() {
        this.folder = gui.addFolder(`TimeText_${this.name}`)
        this.folder.close()
        this.folder.add(this.textGeometryParams, 'size', 0, 20, 0.5).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'height', 0, 20, 0.5).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'curveSegments', 0, 64, 4).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'bevelEnabled').onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'bevelThickness', 0, 10, 0.1).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'bevelSize', 0, 10, 0.1).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'bevelOffset', 0, 20, 0.5).onChange(() => this.refreshText())
        this.folder.add(this.textGeometryParams, 'bevelSegments', 0, 32, 2).onChange(() => this.refreshText())

        this.folder.addColor(this.textMaterialParams.color, 'string').name('textColor').onChange(() => this.refreshMaterial())
        this.folder.add(this.textMaterialParams, 'refractionRatio', 0, 1, 0.02).onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'reflectivity', 0, 1, 0.1).onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'roughness', 0, 1, 0.1).onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'metalness', 0, 1, 0.1).onChange(() => this.refreshMaterial())
        // this.folder.addColor(this.textMaterialParams.emissive, 'string').name('emissive').onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'emissiveIntensity', 0, 1, 0.1).onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'opacity', 0, 1, 0.1).onChange(() => this.refreshMaterial())
        // this.folder.add(this.textMaterialParams, 'transparent').onChange(() => this.refreshMaterial())
    }

    createText() {
        this.textStr = this.timeFormatter.format(Date.now())

        this.geometry = new TextGeometry(this.textStr, {
            font: this.font,
            ...this.textGeometryParams,
        })
        this.geometry.center()
        this.material = this.material || new THREE.MeshPhongMaterial({ color: '#948f84', refractionRatio: 0.84}) // new THREE.MeshPhysicalMaterial(this.textMaterialParams)
        this.textMesh = new THREE.Mesh(this.geometry, this.material)
        this.renderGroup.add(this.textMesh)
    }

    refreshText() {
        this.geometry.dispose()
        this.renderGroup.remove(this.textMesh)

        this.createText()
    }

    refreshMaterial() {
        this.material.color.set(this.textMaterialParams.color.string)
        this.material.refractionRatio = this.textMaterialParams.refractionRatio
        // this.material.reflectivity = this.textMaterialParams.reflectivity
        // this.material.roughness = this.textMaterialParams.roughness
        // this.material.metalness = this.textMaterialParams.metalness
        // this.material.emissive.set(this.textMaterialParams.emissive.string)
        // this.material.emissiveIntensity = this.textMaterialParams.emissiveIntensity
        // this.material.opacity = this.textMaterialParams.opacity
        // this.material.transparent = this.textMaterialParams.transparent

        this.textMesh.material = this.material
    }

    load() {
        fontLoader.load(this.fontJsonPath, (font) => {
            this.font = font
            this.createText()
        })
    }

    setFont(fontPath) {
        this.fontJsonPath = fontPath
        this.load()
    }

    setTimeOptions(options) {
        this.timeOptions = options
        this.timeFormatter = new Intl.DateTimeFormat('en-US', this.timeOptions)
        this.refreshText()
    }

    getRenderGroup() {
        return this.renderGroup
    }
}


