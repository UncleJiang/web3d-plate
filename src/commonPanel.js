import gui from './utils/gui.js'
import commonParams from './common.js'
import snapshotParams from './utils/snapshot.js'
import transformControl from './utils/transformControl.js'

// common gui folder
const commonPanel = () => {
    const commonFolder = gui.addFolder('Common')
    commonFolder.add(commonParams, 'CONTAINER_RADIUS', 40, 120, 5)

    // add snapshotParams function
    commonFolder.add(snapshotParams, 'createSnapshot')
    commonFolder.add(snapshotParams, 'switchSnapshot')

    commonFolder.add(transformControl, 'visible').name('transformControl_visible')

}

export default commonPanel