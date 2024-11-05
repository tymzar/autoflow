import {removeEmpty} from '../../../utils/base';
import {kD3DAGAlgorithms} from './algorithms/d3-dag';
import {layoutD3Hierarchy} from './algorithms/d3-hierarchy';
import {layoutDagreTree} from './algorithms/dagre-tree';
import {kElkAlgorithms} from './algorithms/elk';
import {layoutOrigin} from './algorithms/origin';

export const kLayoutAlgorithms = {
    origin: layoutOrigin,
    'dagre-tree': layoutDagreTree,
    'd3-hierarchy': layoutD3Hierarchy,
    ...kElkAlgorithms,
    ...kD3DAGAlgorithms,
};

export const kDefaultLayoutConfig = {
    algorithm: 'elk-mr-tree',
    direction: 'vertical',
    visibility: 'visible',
    spacing: {x: 120, y: 120},
    reverseSourceHandles: false,
};

export const layoutReactflow = async (options) => {
    const config = {...kDefaultLayoutConfig, ...removeEmpty(options)};
    const {nodes = [], edges = []} = config;
    const layout = kLayoutAlgorithms[config.algorithm];
    let result = await layout({...config, nodes, edges});
    if (!result) {
        // If the layout fails, fallback to the origin layout
        result = await layoutReactflow({
            ...config,
            nodes,
            edges,
            algorithm: 'origin',
        });
    }

    return result;
};
