import * as THREE from 'three'

import gui from '../../utils/gui'


// TODO
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const colorTexture = textureLoader.load('./textures/sand_1/color.jpg')
const heightTexture = textureLoader.load('./textures/sand_1/height.png')
const normalTexture = textureLoader.load('./textures/sand_1/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('./textures/sand_1/ambientOcclusion.jpg')
const roughnessTexture = textureLoader.load('./textures/sand_1/roughness.jpg')


const terrain = () => {

    const terrainFolder = gui.addFolder('Terrain')

    const geometry = new THREE.PlaneGeometry(90, 90, 1200, 1200) //比例： 3: 40
    const material = new THREE.MeshStandardMaterial({
        map: colorTexture,
        normalMap: normalTexture,
        aoMap: ambientOcclusionTexture,
        roughnessMap: roughnessTexture,
        displacementMap: heightTexture
    })

    const textureProcessing = (texture, textureParams) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.x = textureParams.repeatX
        texture.repeat.y = textureParams.repeatY
        texture.rotation = Math.PI * textureParams.angle
    }

    const textureParams = {
        repeatX: 10,
        repeatY: 10,
        angle: 0.5
    }

    const textureArr =[
        colorTexture,
        normalTexture,
        ambientOcclusionTexture,
        roughnessTexture,
        heightTexture
    ]
    textureArr.forEach(texture => {
        textureProcessing(texture, textureParams)
    })

    const textureFolder = terrainFolder.addFolder('Terrain Texture')
    textureFolder.add(textureParams, 'repeatX', 0, 50, 1).name('repeatX')
    textureFolder.add(textureParams, 'repeatY', 0, 50, 1).name('repeatY')
    textureFolder.add(textureParams, 'angle', 0, 2, 0.1).name('rotationAngle')

    // TODO: add comments
    const commonText = `
    #include <common>


    uniform float uyOffset;
    uniform float uyMultiplier;

    uniform float uColorOffset;
    uniform float uColorMultiplier;

    mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
    }

    //////////////////Noise//////////////////
    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float u = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), u);
    }

    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);

        // Four corners in 2D of a tile
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));

        // Simple 2D lerp using smoothstep envelope between the values.
        // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
        //			mix(c, d, smoothstep(0.0, 1.0, f.x)),
        //			smoothstep(0.0, 1.0, f.y)));

        // Same code, with the clamps in smoothstep and common subexpressions
        // optimized away.
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    vec3 noised( in vec2 x )
    {
        vec2 f = fract(x);
        vec2 u = f*f*(3.0-2.0*f);

    #if 0
        // texel fetch version
        ivec2 p = ivec2(floor(x));
        float a = texelFetch( iChannel0, (p+ivec2(0,0))&255, 0 ).x;
        float b = texelFetch( iChannel0, (p+ivec2(1,0))&255, 0 ).x;
        float c = texelFetch( iChannel0, (p+ivec2(0,1))&255, 0 ).x;
        float d = texelFetch( iChannel0, (p+ivec2(1,1))&255, 0 ).x;
    #else    
        // texture version    
        vec2 p = floor(x);
        float a = 0.0; // textureLod( iChannel0, (p+vec2(0.5,0.5))/256.0, 0.0 ).x;
        float b = 0.0; // textureLod( iChannel0, (p+vec2(1.5,0.5))/256.0, 0.0 ).x;
        float c = 0.0; // textureLod( iChannel0, (p+vec2(0.5,1.5))/256.0, 0.0 ).x;
        float d = 1.0; // textureLod( iChannel0, (p+vec2(1.5,1.5))/256.0, 0.0 ).x;
    #endif
        
        return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,
                    6.0*f*(1.0-f)*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));
    }



    `

    const beginnormalVertexText = `
    #include <beginnormal_vertex>


    float elevation_n = noise(vec2(position.x * 0.12, position.y * 0.35)) * uyMultiplier + uyOffset;
    float elevation_detail = -noised(position.xy).x * 2.5;

    float elevation = sin(-11.64 + position.y * 0.475) * sin(-3.65 + uyOffset + position.x * 0.25) * 0.5 + 0.5;
    elevation = -4.41 + pow(elevation, 0.6) * 6.96 + elevation_n * 3.4 + elevation_detail * 0.1;

    objectNormal.z += elevation;

    float angle = 3.1415926535 * 0.5;
    mat2 rotateMatrix = get2dRotateMatrix(angle);

    objectNormal.yz = rotateMatrix * objectNormal.yz;


    `

    const beginVertexText = `
    #include <begin_vertex>


    float elevation2_n = noise(vec2(position.x * 0.12, position.y * 0.35)) * uyMultiplier + uyOffset;
    float elevation2_detail = -noised(position.xy).x * 2.5;

    float elevation2 = sin(-11.64 + position.y * 0.475) * sin(-3.65 + uyOffset + position.x * 0.25) * 0.5 + 0.5;
    elevation2 = -4.41 + pow(elevation2, 0.6) * 6.96 + elevation2_n * 3.4;
    // + elevation2_detail * 0.1;


    transformed.z += elevation2;

    transformed.yz = rotateMatrix * transformed.yz;

    `

    const uniformParams = {
        uyOffset: {value: 0.5},
        uyMultiplier: {value: 2.0}
    }

    terrainFolder.add(uniformParams.uyMultiplier, 'value', 0, 10, 0.1).name('yMultiplier')
    terrainFolder.add(uniformParams.uyOffset, 'value', -10, 100, 0.1).name('yOffset')


    const depthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking
    })
    depthMaterial.onBeforeCompile = (shader) => {
        // shader.uniforms.uyMultiplier = uniformParams.uyMultiplier
        // shader.uniforms.uyOffset = uniformParams.uyOffset

        // shader.vertexShader = shader.vertexShader.replace('#include <common>', commonText)
    }
    material.onBeforeCompile = (shader) => {
        console.log('material before compile > shader:  ', shader)
        shader.uniforms.uyMultiplier = uniformParams.uyMultiplier
        shader.uniforms.uyOffset = uniformParams.uyOffset

        shader.vertexShader = shader.vertexShader.replace('#include <common>', commonText)
        shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', beginnormalVertexText)
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', beginVertexText)
        
    }
    console.log('hahahahah terrain')
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'terrain'
    mesh.scale.set(1.3, 1, 1)

    return { mesh }
}


export default terrain()