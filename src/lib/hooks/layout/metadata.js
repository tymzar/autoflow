import {MarkerType, Position} from 'reactflow';
import {kReactflow} from '../../states/reactflow';

export const getRootNode = (nodes) => {
    return nodes.find((e) => e.type === 'start') ?? nodes[0];
};

export const getNodeSize = (node, defaultSize = {width: 150, height: 36}) => {
    const internalNode = kReactflow.store
        ?.getState()
        ?.nodeInternals?.get(node.id);
    const nodeWith = internalNode?.width;
    const nodeHeight = internalNode?.height;
    const hasDimension = [nodeWith, nodeHeight].every((e) => e !== null);
    return {
        hasDimension,
        width: nodeWith,
        height: nodeHeight,
        widthWithDefault: nodeWith ?? defaultSize.width,
        heightWithDefault: nodeHeight ?? defaultSize.height,
    };
};

export const getNodeLayouted = (props) => {
    const {
        node,
        position,
        direction,
        visibility,
        fixPosition = (p) => ({x: p.x, y: p.y}),
    } = props;

    console.log('node_data', node);

    const hidden = visibility !== 'visible';
    const isHorizontal = direction === 'horizontal';
    const {width, height, widthWithDefault, heightWithDefault} =
        getNodeSize(node);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    return {
        ...node,
        width,
        height,
        hidden,
        position: fixPosition({
            ...position,
            width: widthWithDefault,
            height: heightWithDefault,
        }),
        data: {
            ...node.data,
        },
        style: {
            ...node.style,
            opacity: hidden ? 0 : 1,
        },
    };
};

export const getEdgeLayouted = (props) => {
    const {edge, visibility} = props;
    const hidden = visibility !== 'visible';
    return {
        ...edge,
        hidden,
        // type: 'base',
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            ...edge.style,
            opacity: hidden ? 0 : 1,
        },
    };
};
