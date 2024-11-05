import React from 'react';

import {button, Leva, useControls} from 'leva';
import {jsonEncode} from '../utils/base';

export const kReactflowLayoutConfig = {};

export const kDefaultLayoutConfig = {
    algorithm: 'elk-layered',
    direction: 'horizontal',
    visibility: 'visible',
    spacing: {x: 100, y: 80},
    reverseSourceHandles: false,
};

export const workflowInputHint = jsonEncode({
    nodes: [
        {
            id: 'mig_dsid_000001',
            type: 'custom',
            data: {name: '[ATV] Staged Unit Sales', emoji: '📊'},
            position: {x: 400, y: 200},
        },
        {
            id: 'mig_dsid_000002',
            type: 'custom',
            data: {name: '[ATV] Staged Dealer Counts', emoji: '📊'},
            position: {x: 400, y: 400},
        },
        {
            id: 'mig_dsid_000003',
            type: 'custom',
            data: {name: '[ATV] Staged Details', emoji: '📊'},
            position: {x: 400, y: 600},
        },
        {
            id: 'mig_dsid_000004',
            type: 'custom',
            data: {
                name: ' [ATV] Intermediate Trends Output Recreational Vehicle Trends',
                emoji: '📊',
            },
            position: {x: 400, y: 800},
        },
        {
            id: 'mig_dsid_000005',
            type: 'custom',
            data: {
                name: ' [ATV] Intermediate Model Output Recreational Vehicle Trends',
                emoji: '📊',
            },
            position: {x: 400, y: 1000},
        },
        {
            id: 'mig_dsid_000006',
            type: 'custom',
            data: {name: ' [ATV] Recreational Vehicle Trends GTS', emoji: '📊'},
            position: {x: 400, y: 1200},
        },
    ],
    edges: [
        {
            id: 'mig_dsid_000001#mig_dsid_000004#0',
            source: 'mig_dsid_000001',
            target: 'mig_dsid_000004',
            sourceHandle: 'mig_dsid_000001#source#0}',
            targetHandle: 'mig_dsid_000004#target#0',
        },
        {
            id: 'mig_dsid_000001#mig_dsid_000005#1',
            source: 'mig_dsid_000001',
            target: 'mig_dsid_000005',
            sourceHandle: 'mig_dsid_000001#source#1}',
            targetHandle: 'mig_dsid_000005#target#0',
        },
        {
            id: 'mig_dsid_000002#mig_dsid_000004#0',
            source: 'mig_dsid_000002',
            target: 'mig_dsid_000004',
            sourceHandle: 'mig_dsid_000002#source#0}',
            targetHandle: 'mig_dsid_000004#target#0',
        },
        {
            id: 'mig_dsid_000002#mig_dsid_000005#1',
            source: 'mig_dsid_000002',
            target: 'mig_dsid_000005',
            sourceHandle: 'mig_dsid_000002#source#1}',
            targetHandle: 'mig_dsid_000005#target#0',
        },
        {
            id: 'mig_dsid_000003#mig_dsid_000004#0',
            source: 'mig_dsid_000003',
            target: 'mig_dsid_000004',
            sourceHandle: 'mig_dsid_000003#source#0}',
            targetHandle: 'mig_dsid_000004#target#0',
        },
        {
            id: 'mig_dsid_000003#mig_dsid_000005#1',
            source: 'mig_dsid_000003',
            target: 'mig_dsid_000005',
            sourceHandle: 'mig_dsid_000003#source#1}',
            targetHandle: 'mig_dsid_000005#target#0',
        },
        {
            id: 'mig_dsid_000004#mig_dsid_000006#0',
            source: 'mig_dsid_000004',
            target: 'mig_dsid_000006',
            sourceHandle: 'mig_dsid_000004#source#0}',
            targetHandle: 'mig_dsid_000006#target#0',
        },
        {
            id: 'mig_dsid_000005#mig_dsid_000006#0',
            source: 'mig_dsid_000005',
            target: 'mig_dsid_000006',
            sourceHandle: 'mig_dsid_000005#source#0}',
            targetHandle: 'mig_dsid_000006#target#0',
        },
    ],
});

const algorithms = [
    'elk-mr-tree',
    'd3-hierarchy',
    'd3-dag',
    'ds-dag(s)',
    'elk-layered',
    'dagre-tree',
].reduce(
    (pre, algorithm) => {
        pre[algorithm] = algorithm;
        return pre;
    },
    {
        [kDefaultLayoutConfig.algorithm]: kDefaultLayoutConfig.algorithm,
    }
);

const directions = Object.entries({
    vertical: 'vertical',
    horizontal: 'horizontal',
}).reduce(
    (pre, [key, value]) => {
        pre[key] = value;
        return pre;
    },
    {
        [kDefaultLayoutConfig.direction]: kDefaultLayoutConfig.direction,
    }
);

const reverseSourceHandlesKeyMap = {
    false: 'asc',
    true: 'desc',
};
const reverseSourceHandles = Object.entries({
    asc: false,
    desc: true,
}).reduce(
    (pre, [key, value]) => {
        pre[key] = value;
        return pre;
    },
    {
        [reverseSourceHandlesKeyMap[
            kDefaultLayoutConfig.reverseSourceHandles.toString()
        ]]: kDefaultLayoutConfig.reverseSourceHandles,
    }
);

export const ControlPanel = (props) => {
    const {layoutReactflow} = props;

    const [state, setState] = useControls(() => {
        return {
            workflow: {
                order: 1,
                label: 'Workflow',
                rows: 3,
                value: workflowInputHint,
            },
            algorithm: {
                order: 2,
                label: 'Algorithms',
                options: algorithms,
            },
            direction: {
                order: 3,
                label: 'Direction',
                options: directions,
            },
            spacing: {
                order: 4,
                label: 'Spacing',
                value: kDefaultLayoutConfig.spacing,
                joystick: false,
            },
            reverseSourceHandles: {
                order: 5,
                label: 'Order',
                options: reverseSourceHandles,
            },
            layout: {
                order: 6,
                label: 'Layout',
                ...button((get) => {
                    layoutReactflow({
                        workflow: get('workflow'),
                        algorithm: get('algorithm'),
                        direction: get('direction'),
                        spacing: get('spacing'),
                        reverseSourceHandles: get('reverseSourceHandles'),
                    });
                }),
            },
        };
    });

    kReactflowLayoutConfig.state = state;
    kReactflowLayoutConfig.setState = setState;

    return <Leva hideCopyButton titleBar={{filter: false}} />;
};
