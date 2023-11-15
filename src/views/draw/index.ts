// 控制连接桩显示/隐藏
import { Graph } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Export } from '@antv/x6-plugin-export';
import { GraphLine, GraphNode } from '@/types/node';

//控制连接桩的显示
export const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden';
  }
};

//注册插件
export const registerPlugin = (graph: Graph) => {
  graph
    .use(
      new Transform({
        resizing: true,
        rotating: true,
      })
    )
    .use(
      new Selection({
        rubberband: true,
        showNodeSelectionBox: true,
      })
    )
    .use(new Snapline())
    .use(new Keyboard())
    .use(new Clipboard())
    .use(new History())
    .use(new Export());
};

//注册常用快捷键
export const registerKeyEvents = (graph: Graph) => {
  //copy
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    console.log(1);
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
    return false;
  });
  //cut
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.cut(cells);
    }
    return false;
  });
  //
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
    return false;
  });
  // undo
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo();
    }
    return false;
  });
  //redo
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    if (graph.canRedo()) {
      graph.redo();
    }
    return false;
  });
  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    const nodes = graph.getNodes();
    if (nodes) {
      graph.select(nodes);
    }
  });
  // delete
  graph.bindKey('backspace', () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });
};

//创建连接桩通用属性
export const createPortProperty = (position: string) => {
  return {
    position,
    attrs: {
      circle: {
        r: 4,
        magnet: true,
        stroke: '#000',
        strokeWidth: 1,
        fill: '#fff',
        style: {
          visibility: 'hidden',
        },
      },
    },
  };
};

//创建节点的通用属性
const createNodeProperty = (config: {
  width: number;
  height: number;
  shape: string;
}) => {
  const { width, height, shape } = config;
  return {
    inherit: shape,
    width,
    height,
    attrs: {
      body: {
        strokeWidth: 1.5,
        stroke: '#000000',
        fill: '#ffffff',
      },
      text: {
        fontSize: 12,
        fill: '#262626',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
      label: {
        textWrap: {
          width: '90%',
          height: '90%',
          ellipsis: true,
          breakWord: true,
        },
      },
    },
    tools: [
      {
        name: 'node-editor',
        args: {
          attrs: {
            text: {
              fontSize: 15,
            },
          },
        },
      },
    ],
    ports: {
      groups: {
        top: createPortProperty('top'),
        right: createPortProperty('right'),
        bottom: createPortProperty('bottom'),
        left: createPortProperty('left'),
      },
    },
  };
};

//注册几个常用几点
export const registerNode = () => {
  Graph.registerNode(
    'custom-rect',
    createNodeProperty({
      shape: 'rect',
      width: 33,
      height: 18,
    }),
    true
  );
  Graph.registerNode(
    'custom-polygon',
    createNodeProperty({
      shape: 'polygon',
      width: 33,
      height: 18,
    }),
    true
  );
  Graph.registerNode(
    'custom-circle',
    createNodeProperty({
      shape: 'circle',
      width: 23,
      height: 23,
    }),
    true
  );
  Graph.registerNode(
    'custom-ellipse',
    createNodeProperty({
      shape: 'ellipse',
      width: 33,
      height: 18,
    }),
    true
  );
};

//处理节点数据
const handlePortData = (ports: string[] | undefined): { group: string }[] => {
  return (ports ? ports : ['top', 'bottom', 'left', 'right']).map((item) => {
    return { group: item };
  });
};

//创建常用节点
const createPolygon = (
  graph: Graph,
  config: {
    refPoints: string;
    height?: number;
    width?: number;
    port?: string[];
  }
) => {
  let { refPoints, width, height, port } = config;
  width = width ? width : 33;
  height = height ? height : 18;
  return graph.createNode({
    shape: 'custom-polygon',
    width,
    height,
    attrs: {
      body: {
        refPoints,
      },
    },
    ports: {
      items: handlePortData(port),
    },
  });
};

const createRect = (
  graph: Graph,
  config: { rx: number; ry: number; port?: string[] }
) => {
  const { rx, ry, port } = config;
  return graph.createNode({
    shape: 'custom-rect',
    attrs: {
      body: {
        rx,
        ry,
      },
    },
    ports: {
      items: handlePortData(port),
    },
  });
};

const createCircle = (graph: Graph, port?: string[]) => {
  return graph.createNode({
    shape: 'custom-circle',
    ports: {
      items: handlePortData(port),
    },
  });
};

const createEllipse = (graph: Graph, port?: string[]) => {
  return graph.createNode({
    shape: 'custom-ellipse',
    ports: {
      items: handlePortData(port),
    },
  });
};

//创建所有的基础节点
export const createBasicNodes = (graph: Graph) => {
  const r1 = createRect(graph, { rx: 0, ry: 0 });
  const r2 = createRect(graph, { rx: 6, ry: 6 });
  const r3 = createRect(graph, { rx: 10, ry: 13 });
  const r4 = createEllipse(graph);
  const r5 = createCircle(graph);
  const r6 = createPolygon(graph, {
    refPoints: '10,0 40,0 30,20 0,20',
  });
  const r7 = createPolygon(graph, {
    refPoints: '0,10 10,0 20,10 10,20',
  });
  const r8 = createPolygon(graph, {
    height: 25,
    width: 25,
    refPoints:
      '0.5,0 0.61,0.35 1,0.35 0.68,0.57 0.79,0.91 0.5,0.75 0.21,0.91 0.32,0.57 0,0.35 0.39,0.35',
  });
  const r9 = createPolygon(graph, {
    refPoints: '0,0 0,1 1,1',
    port: ['left', 'bottom'],
  });
  const r10 = createPolygon(graph, {
    height: 22,
    width: 25,
    refPoints: '0.5,0 1,1 0,1',
  });
  const r11 = createPolygon(graph, {
    height: 25,
    refPoints: '0.5,0 1,0.38 0.82,1 0.18,1 0,0.38',
  });
  const r12 = createPolygon(graph, {
    height: 28,
    width: 28,
    refPoints: '0.5,0 1,0.25 1,0.75 0.5,1 0,0.75 0,0.25',
  });
  const r13 = createPolygon(graph, {
    height: 33,
    refPoints:
      '0.5,0 0.85,0.15 1,0.5 0.85,0.85 0.5,1 0.15,0.85 0,0.5 0.15,0.15',
  });

  return [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13];
};

//初始化节点默认值
export const initNodeProperty = (): GraphNode => {
  return {
    width: 0,
    height: 0,
    fontColor: '',
    fontSize: 0,
    background: '',
    borderColor: '',
    borderSize: 0,
    textAnchor: '',
    textVerticalAnchor: '',
  };
};

//初始化线条默认值
export const initLineProperty = (): GraphLine => {
  return {
    strokeColor: '',
    strokeWidth: 0,
    markerHeight: 0,
    markerWidth: 0,
    sourceMarker: '',
    targetMarker: '',
    fontSize: 0,
    fontColor: '',
  };
};
