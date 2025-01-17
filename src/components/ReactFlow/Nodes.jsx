//hard-coded xy positioning of each node in the canvas
export default function createInitialNodes (schemaObject, edges) {
  const nodePositions = [
    { x: 0, y: 0 },
    { x: 500, y: 0 },
    { x: 0, y: 350 },
    { x: 500, y: 350 },
    { x: 0, y: 700 },
    { x: 500, y: 700 },
    { x: 0, y: 1050 },
    { x: 500, y: 1050 },
    { x: 0, y: 1400 },
    { x: 500, y: 1400 },
    { x: 0, y: 1750 },
    { x: 500, y: 1750 },
    { x: 0, y: 2100 },
    { x: 500, y: 2100 },
    { x: 0, y: 2450 },
    { x: 500, y: 2450 },
    { x: 0, y: 2450 },
  ];
  // renders each table on the React Flow canvas
  const nodes = Object.entries(schemaObject).map((table, index) => {
    return {
      id: table[0],
      type: 'table',
      position: nodePositions[index],
      data: { table, edges },
    };
  });
  return nodes;
};

