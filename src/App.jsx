import { useEffect, useCallback } from "react";
import ReactFlow, {
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
} from "reactflow";

// This is used to display a leva (https://github.com/pmndrs/leva) control panel for the example
import { useControls, button } from "leva";

import useAutoLayout from "./useAutoLayout";

import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initialElements";
import { getId } from "./utils";

import "reactflow/dist/style.css";

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  // pathOptions: { offset: 5 },
};

/**
 * This example shows how you can automatically arrange your nodes after adding child nodes to your graph.
 */
function ReactFlowAutoLayout() {
  const { fitView, addNodes } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 👇 This hook is used to display a leva (https://github.com/pmndrs/leva) control panel for this example.
  // You can safely remove it, if you don't want to use it.
  const layoutOptions = useControls({
    about: {
      value:
        "Add child nodes by clicking a node in the graph. Add new root nodes by clicking the button below.",
      editable: false,
    },
    algorithm: {
      value: "d3-hierarchy",
      options: ["dagre", "d3-hierarchy", "elk"],
    },
    direction: {
      value: "TB",
      options: {
        down: "TB",
        right: "LR",
        up: "BT",
        left: "RL",
      },
    },
    spacing: [50, 50],
    "add root node": button(() =>
      addNodes({
        id: getId(),
        position: { x: 0, y: 0 },
        data: { label: `New Node` },
        style: { opacity: 0 },
      })
    ),
  });

  // this hook handles the computation of the layout once the elements or the direction changes
  console.log("layoutOptions", layoutOptions);
  useAutoLayout(layoutOptions);

  // this helper function adds a new node and connects it to the source node
  const addChildNode = useCallback(
    (parentNodeId) => {
      // create an incremental ID based on the number of elements already in the graph
      const childNodeId = getId();

      const childNode = {
        id: childNodeId,
        data: { label: `Node ${nodes.length + 1}` },
        position: { x: 0, y: 0 }, // no need to pass a position as it is computed by the layout hook
        style: { opacity: 0 },
      };

      const connectingEdge = {
        id: `${parentNodeId}->${childNodeId}`,
        source: parentNodeId,
        target: childNodeId,
        style: { opacity: 0 },
      };

      setNodes((nodes) => nodes.concat([childNode]));
      setEdges((edges) => edges.concat([connectingEdge]));
    },
    [setNodes, setEdges, nodes.length]
  );

  // this function is called when a node in the graph is clicked
  const onNodeClick = useCallback(
    (_, node) => {
      // on click, we want to create a new node connection the clicked node
      addChildNode(node.id);
    },
    [addChildNode]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // every time our nodes change, we want to center the graph again
  useEffect(() => {
    fitView();
  }, [nodes, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodesDraggable={false}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      zoomOnDoubleClick={false}
    />
  );
}

const ReactFlowWrapper = () => {
  return (
    <ReactFlowProvider>
      <ReactFlowAutoLayout />
    </ReactFlowProvider>
  );
};

export default ReactFlowWrapper;
