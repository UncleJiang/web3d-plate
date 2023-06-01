uniform sampler2D baseShadow;
uniform sampler2D caustics;

// uniform float cameraNear;
// uniform float cameraFar;

varying vec2 uv_coord;

// float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
//     return (near * far) / ((far - near) * invClipZ - far);
// }
// float viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {
//     return (viewZ + near) / (near - far); //
// }


// float readDepth( sampler2D depthSampler, vec2 coord ) {
//     float fragCoordZ = texture2D( depthSampler, coord ).x;
//     float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
//     return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
// }

void main() {

    vec4 shadowTex = texture2D(baseShadow, uv_coord);
    vec4 causticsTex = texture2D(caustics, uv_coord);

    gl_FragColor = shadowTex; // vec4(shadowTex.w);

    if (causticsTex.w > 0.) {
        gl_FragColor = vec4(vec3(1. - causticsTex), 0.5);
    }
}