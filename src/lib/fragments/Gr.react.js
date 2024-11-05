import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import ReactFlow, {
    Background,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
    useStoreApi,
} from 'reactflow';
import CustomNodeReact from './CustomNode.react';

import 'reactflow/dist/style.css';
import {useAutoLayout} from '../hooks/layout/useAutoLayout';

import {workflow2reactflow} from '../utils/convert';
import {ReactflowInstance} from './instance.react';
import {jsonDecode} from '../utils/base';
import {ControlPanel, kDefaultLayoutConfig} from './ControlPanel.react';

const nodeTypes = {
    custom: CustomNodeReact,
};

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const Gr = (props) => {
    const {
        id,
        nodes = JSON.parse(`{
            "mig_dsid_000001": "[ATV] Staged Unit Sales",
            "mig_dsid_000002": "[ATV] Staged Dealer Counts",
            "mig_dsid_000003": "[ATV] Staged Details",
            "mig_dsid_000004": " [ATV] Intermediate Trends Output Recreational Vehicle Trends",
            "mig_dsid_000005": " [ATV] Intermediate Model Output Recreational Vehicle Trends",
            "mig_dsid_000006" : " [ATV] Recreational Vehicle Trends GTS"}`),

        edges = JSON.parse(`{
"mig_dsid_000001": ["mig_dsid_000004", "mig_dsid_000005"],
"mig_dsid_000002": ["mig_dsid_000004", "mig_dsid_000005"],
"mig_dsid_000003": ["mig_dsid_000004", "mig_dsid_000005"],
"mig_dsid_000004": ["mig_dsid_000006"],
"mig_dsid_000005": ["mig_dsid_000006"]}`),
        setProps,
        algorithm,
        variant = 'basic',
    } = props;

    const [controlledNodes, _setNodes, onNodesChange] = useNodesState([]);
    const [controlledEdges, _setEdges, onEdgesChange] = useEdgesState([]);

    const initialNodes = Object.entries(nodes).map(([id, name]) => {
        return {
            id: id,
            type: 'custom',
            data: {name: name, emoji: '📊'},
        };
    });

    const initialEdges = Object.entries(edges)
        .map(([source, destinations]) =>
            destinations.map((destination, index) => ({
                id: `${source}#${destination}#${index}`,
                source: source,
                target: destination,
                sourceHandle: `${source}#source#${index}}`,
                targetHandle: `${destination}#target#0`,
            }))
        )
        .flat();

    const {layout, layouting} = useAutoLayout();

    const layoutReactflow = async (props) => {
        if (layouting) {
            return;
        }
        const input = props.workflow;
        const data = jsonDecode(input);
        if (!data) {
            alert('Invalid workflow JSON data');
            return;
        }
        const workflow = workflow2reactflow(data);
        await layout({...workflow, ...props});
    };

    useEffect(() => {
        const {nodes, edges} = workflow2reactflow({
            nodes: initialNodes,
            edges: initialEdges,
        });
        console.log({nodes, edges});
        layout({nodes, edges, ...kDefaultLayoutConfig});
    }, []);

    // const handleInputChange = (e) => {
    //     /*
    //      * Send the new value to the parent component.
    //      * setProps is a prop that is automatically supplied
    //      * by dash's front-end ("dash-renderer").
    //      * In a Dash app, this will update the component's
    //      * props and send the data back to the Python Dash
    //      * app server if a callback uses the modified prop as
    //      * Input or State.
    //      */
    //     setProps({value: e.target.value});
    // };

    return (
        <div id={id} style={{width: '100vw', height: '100vh'}}>
            <ReactFlow
                nodes={controlledNodes}
                edges={controlledEdges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
            >
                <ReactflowInstance />
                <ControlPanel layoutReactflow={layoutReactflow} />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

Gr.defaultProps = {
    variant: 'basic',
};

Gr.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string.isRequired,

    /**
     * Object where keys are node identifiers of sources and value is an displayable name of the node
     */
    nodes: PropTypes.objectOf(PropTypes.string).isRequired,

    /**
     * Object where keys are node identifiers of sources and value is an array of destination node identifiers
     */
    edges: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,

    /**
     * The styling variant of the graph
     */
    variant: PropTypes.string,

    /**
     * Algorithm used for the auto-layout resolving
     */
    algorithm: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
};

export default Gr;
