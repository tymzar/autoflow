import {graphStratify, sugiyama} from 'd3-dag';
import {getIncomers} from 'reactflow';

import {getEdgeLayouted, getNodeLayouted, getNodeSize} from '../../metadata';

// Since d3-dag layout algorithm does not support multiple root nodes,
// we attach the sub-workflows to the global rootNode.
const rootNode = {
    id: '#root',
    x: 0,
    y: 0,
    position: {x: 0, y: 0},
    data: {},
};

const algorithms = {
    'd3-dag': 'd3-dag',
    'ds-dag(s)': 'ds-dag(s)',
};

export const layoutD3DAG = async (props) => {
    const {
        nodes,
        edges,
        direction,
        visibility,
        spacing,
        algorithm = 'd3-dag',
    } = props;
    const isHorizontal = direction === 'horizontal';

    const initialNodes = [];
    let maxNodeWidth = 0;
    let maxNodeHeight = 0;
    for (const node of nodes) {
        const {widthWithDefault, heightWithDefault} = getNodeSize(node);
        initialNodes.push({
            ...node,
            ...node.position,
            width: widthWithDefault,
            height: heightWithDefault,
        });
        maxNodeWidth = Math.max(maxNodeWidth, widthWithDefault);
        maxNodeHeight = Math.max(maxNodeHeight, heightWithDefault);
    }

    // Since d3-dag does not support horizontal layout,
    // we swap the width and height of nodes and interchange x and y mappings based on the layout direction.
    const nodeSize = isHorizontal
        ? [maxNodeHeight + spacing.y, maxNodeWidth + spacing.x]
        : [maxNodeWidth + spacing.x, maxNodeHeight + spacing.y];

    const getParentIds = (node) => {
        if (node.id === rootNode.id) {
            return undefined;
        }
        // Node without input is the root node of sub-workflow, and we should connect it to the rootNode
        const incomers = getIncomers(node, nodes, edges);
        if (incomers.length < 1) {
            return [rootNode.id];
        }
        return algorithm === 'd3-dag'
            ? [incomers[0]?.id]
            : incomers.map((e) => e.id);
    };

    const stratify = graphStratify();
    const dag = stratify(
        [rootNode, ...initialNodes].map((node) => {
            return {
                id: node.id,
                parentIds: getParentIds(node),
            };
        })
    );

    const layout = sugiyama().nodeSize(nodeSize);
    layout(dag);

    const layoutNodes = new Map();
    for (const node of dag.nodes()) {
        layoutNodes.set(node.data.id, node);
    }

    return {
        nodes: nodes.map((node) => {
            const {x, y} = layoutNodes.get(node.id);
            // Interchange x and y mappings based on the layout direction.
            const position = isHorizontal ? {x: y, y: x} : {x, y};
            return getNodeLayouted({
                node,
                position,
                direction,
                visibility,
                fixPosition: ({x, y, width, height}) => {
                    // This algorithm uses the center coordinate of the node as the reference point,
                    // which needs adjustment for ReactFlow's topLeft coordinate system.
                    return {
                        x: x - width / 2,
                        y: y - height / 2,
                    };
                },
            });
        }),
        edges: edges.map((edge) => getEdgeLayouted({edge, visibility})),
    };
};

export const kD3DAGAlgorithms = Object.keys(algorithms).reduce(
    (pre, algorithm) => {
        pre[algorithm] = (props) => {
            return layoutD3DAG({...props, algorithm});
        };
        return pre;
    },
    {}
);
