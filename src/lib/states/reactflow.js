export const kReactflow = {};

export const getReactflowData = () => {
    const nodes = kReactflow.instance?.getNodes() ?? [];
    const edges = kReactflow.instance?.getEdges() ?? [];
    return {
        nodes,
        edges,
        nodesMap: nodes.reduce((pre, v) => {
            pre[v.id] = v;
            return pre;
        }, {}),
        edgesMap: edges.reduce((pre, v) => {
            pre[v.id] = v;
            return pre;
        }, {}),
    };
};
