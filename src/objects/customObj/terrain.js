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
        bumpMap: heightTexture,
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

    const textureArr = [
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
    uniform float uTime;

    uniform float uColorOffset;
    uniform float uColorMultiplier;

    mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
    }

    //////////////////Terrain Noise//////////////////
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


    //////////////////Caustics Texture Noise//////////////////
    // refer to: https://www.shadertoy.com/view/wlc3zr

    vec4 permute(vec4 t) {
        return t * (t * 34.0 + 133.0);
    }

    vec3 grad(float hash) {
        vec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;
        vec3 cuboct = cube;
        cuboct[int(hash / 16.0)] = 0.0;
        
        float type = mod(floor(hash / 8.0), 2.0);
        vec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));
        
        vec3 grad = cuboct * 1.22474487139 + rhomb;
        
        grad *= (1.0 - 0.042942436724648037 * type) * 3.5946317686139184;
        return grad;
    }

    vec4 os2NoiseWithDerivativesPart(vec3 X) {
        vec3 b = floor(X);
        vec4 i4 = vec4(X - b, 2.5);
        
        vec3 v1 = b + floor(dot(i4, vec4(.25)));
        vec3 v2 = b + vec3(1, 0, 0) + vec3(-1, 1, 1) * floor(dot(i4, vec4(-.25, .25, .25, .35)));
        vec3 v3 = b + vec3(0, 1, 0) + vec3(1, -1, 1) * floor(dot(i4, vec4(.25, -.25, .25, .35)));
        vec3 v4 = b + vec3(0, 0, 1) + vec3(1, 1, -1) * floor(dot(i4, vec4(.25, .25, -.25, .35)));
        
        vec4 hashes = permute(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));
        hashes = permute(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));
        hashes = mod(permute(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);
        
        vec3 d1 = X - v1; vec3 d2 = X - v2; vec3 d3 = X - v3; vec3 d4 = X - v4;
        vec4 a = max(0.75 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);
        vec4 aa = a * a; vec4 aaaa = aa * aa;
        vec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);
        vec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);
        vec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));

        vec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)
            + mat4x3(g1, g2, g3, g4) * aaaa;
        
        return vec4(derivative, dot(aaaa, extrapolations));
    }

    vec4 os2NoiseWithDerivatives_Fallback(vec3 X) {
        X = dot(X, vec3(2.0/3.0)) - X;
        
        vec4 result = os2NoiseWithDerivativesPart(X) + os2NoiseWithDerivativesPart(X + 144.5);
        
        return vec4(dot(result.xyz, vec3(2.0/3.0)) - result.xyz, result.w);
    }

    vec4 os2NoiseWithDerivatives_ImproveXY(vec3 X) {
        mat3 orthonormalMap = mat3(
            0.788675134594813, -0.211324865405187, -0.577350269189626,
            -0.211324865405187, 0.788675134594813, -0.577350269189626,
            0.577350269189626, 0.577350269189626, 0.577350269189626);
        
        X = orthonormalMap * X;
        vec4 result = os2NoiseWithDerivativesPart(X) + os2NoiseWithDerivativesPart(X + 144.5);
        
        return vec4(result.xyz * orthonormalMap, result.w);
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
        uyOffset: { value: 0.5 },
        uyMultiplier: { value: 2.0 },
        uTime: { value: 0.0 }
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


    const causticsMapText = `
    #include <map_fragment>

    #ifdef USE_MAP
	    // diffuseColor *= texture2D( map, vMapUv );

        vec3 X = vec3(vUv * 1.6, mod(uTime, 578.0) * 0.8660254037844386);
        vec4 noiseResult = os2NoiseWithDerivatives_ImproveXY(X);
        noiseResult = os2NoiseWithDerivatives_ImproveXY(X - noiseResult.xyz / 16.0);
        float value = noiseResult.w;
        vec3 col = vec3(.431, .8, 1.0) * (0.5 + 0.5 * value);
        diffuseColor *= vec4(col, 1.0);  // TODO: modify the blend algorithm.
    
    #endif
    `

    let isOceanMode = 1 // TODO  还有.customProgramCacheKey 需添加

    material.onBeforeCompile = (shader) => {
        console.log('material before compile > shader:  ', shader)
        shader.uniforms.uyMultiplier = uniformParams.uyMultiplier
        shader.uniforms.uyOffset = uniformParams.uyOffset
        shader.uniforms.uTime = uniformParams.uTime

        shader.vertexShader = shader.vertexShader.replace('#include <common>', commonText)
        shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', beginnormalVertexText)
        shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', beginVertexText)

        console.log('material before compile > shader fragment:  ', shader.fragmentShader)

        if (isOceanMode) {
            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', commonText)
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', causticsMapText)
        }

    }
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'terrain'
    mesh.scale.set(1.3, 1, 1)
    mesh.receiveShadow = true

    const clock = new THREE.Clock()
    const onMeshChange = () => {
        const elapsedTime = clock.getElapsedTime()
        uniformParams.uTime.value = elapsedTime
    }

    return { 
        mesh,
        onMeshChange
    }
}


export default terrain()