import gui from './utils/gui.js'
import snapshotParams from './utils/snapshot.js'

// common config
const commonParams = {
    CONTAINER_RADIUS: 80,
}


// common gui folder
export const commonFolder = gui.addFolder('Common')
commonFolder.add(commonParams, 'CONTAINER_RADIUS', 40, 120, 5)

// add snapshotParams function
commonFolder.add(snapshotParams, 'createSnapshot')
commonFolder.add(snapshotParams, 'switchSnapshot')


export default commonParams