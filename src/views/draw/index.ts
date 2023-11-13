// 控制连接桩显示/隐藏
import { Graph } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Scroller } from '@antv/x6-plugin-scroller';
import { Export } from '@antv/x6-plugin-export';

export const ports = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'top',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
    {
      group: 'left',
    },
  ],
};

export const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden';
  }
};

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
    .use(
      new Scroller({
        enabled: true,
      })
    )
    .use(new Export());
};

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
  // zoom
  graph.bindKey(['ctrl+1', 'meta+1'], () => {
    const zoom = graph.zoom();
    if (zoom < 1.5) {
      graph.zoom(0.1);
    }
  });
  graph.bindKey(['ctrl+2', 'meta+2'], () => {
    const zoom = graph.zoom();
    if (zoom > 0.5) {
      graph.zoom(-0.1);
    }
  });
};

export const registerNode = () => {
  Graph.registerNode(
    'custom-rect',
    {
      inherit: 'rect',
      width: 33,
      height: 18,
      attrs: {
        body: {
          strokeWidth: 1.5,
          stroke: '#000000',
          fill: '#ffffff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
          textAlign: 'middle',
          textVerticalAlign: 'middle',
        },
        label: {
          textWrap: {
            width: '90%', // 宽度减少 10px
            height: '90%', // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
        },
      },
      tools: [
        {
          name: 'node-editor',
          args: {
            attrs: {
              backgroundColor: '#ffffff',
            },
          },
        },
      ],
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    'custom-polygon',
    {
      inherit: 'polygon',
      width: 33,
      height: 18,
      attrs: {
        body: {
          strokeWidth: 1.5,
          stroke: '#000000',
          fill: '#ffffff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
          textAlign: 'middle',
          textVerticalAlign: 'middle',
        },
        label: {
          textWrap: {
            width: '90%', // 宽度减少 10px
            height: '90%', // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
        },
      },
      tools: [
        {
          name: 'node-editor',
          args: {
            attrs: {
              backgroundColor: '#ffffff',
            },
          },
        },
      ],
      ports: {
        ...ports,
      },
    },
    true
  );

  Graph.registerNode(
    'custom-circle',
    {
      inherit: 'circle',
      width: 23,
      height: 23,
      attrs: {
        body: {
          strokeWidth: 1.5,
          stroke: '#000000',
          fill: '#ffffff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
          textAlign: 'middle',
          textVerticalAlign: 'middle',
        },
        label: {
          textWrap: {
            width: '90%', // 宽度减少 10px
            height: '90%', // 高度为参照元素高度的一半
            ellipsis: true, // 文本超出显示范围时，自动添加省略号
            breakWord: true, // 是否截断单词
          },
        },
      },
      tools: [
        {
          name: 'node-editor',
          args: {
            attrs: {
              backgroundColor: '#ffffff',
            },
          },
        },
      ],
      ports: { ...ports },
    },
    true
  );

  Graph.registerNode(
    'custom-ellipse',
    {
      inherit: 'ellipse',
      width: 33,
      height: 18,
      attrs: {
        body: {
          strokeWidth: 1.5,
          stroke: '#000000',
          fill: '#ffffff',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
          textAlign: 'middle',
          textVerticalAlign: 'middle',
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
              backgroundColor: '#ffffff',
            },
          },
        },
      ],
      ports: { ...ports },
    },
    true
  );
};

export const createPolygon = (
  graph: Graph,
  config: { refPoints: string; height?: number; width?: number }
) => {
  let { refPoints, width, height } = config;
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
  });
};

export const createRect = (
  graph: Graph,
  config: { rx: number; ry: number }
) => {
  const { rx, ry } = config;
  return graph.createNode({
    shape: 'custom-rect',
    attrs: {
      body: {
        rx,
        ry,
      },
    },
  });
};

export const createCircle = (graph: Graph) => {
  return graph.createNode({
    shape: 'custom-circle',
  });
};

export const createEllipse = (graph: Graph) => {
  return graph.createNode({
    shape: 'custom-ellipse',
  });
};

export const createAllNodes = (graph: Graph) => {
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
    height: 20,
    width: 20,
    refPoints: '100,10 40,198 190,78 10,78 160,198',
  });
  const r9 = createPolygon(graph, {
    refPoints: '0,0 1,0 0,1',
  });
  const r10 = createPolygon(graph, {
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
