export interface UserData {
  id: string;
  name: string;
  desc: string;
  data: string;
  exportType: string;
  createTime: string;
  updateTime: string;
}

export interface GraphNode {
  width: number;
  height: number;
  lineHeight: number;
  fontSize: number;
  fontColor: string;
  borderColor: string;
  borderSize: number;
  background: string;
  textAnchor: string;
  textVerticalAnchor: string;
}

export interface GraphLine {
  strokeColor: string;
  strokeWidth: number;
  markerHeight: number;
  markerWidth: number;
}

export interface GraphProperty {
  bgMode: string;
  bgImage: string;
  opacity: number;
  background: string;
  //是否允许缩放，以及最大最小缩放倍率
  mousewheel: boolean;
  scale: [number, number];
  //是否允许画布平移
  panning: boolean;
  //节点嵌套：
  embedding: boolean;
  //空白连接
  allowBlank: boolean;
  //允许循环连接
  allowLoop: boolean;
  //是否允许边链接到连接桩，
  allowPort: boolean;
  //是否允许在相同的起始节点和终止之间创建多条边，
  allowMulti: boolean;
  //拖动边时，是否高亮显示所有可用的连接桩或节点，
  highlight: boolean;
  //一条边连接另一条边
  allowEdge: boolean;
  //是否允许边连接到节点（非节点上的连接桩），默认为 true 。
  allowNode: boolean;
  nodeMovable: boolean;
  edgeMovable: boolean;
  edgeLabelMovable: boolean;
  arrowheadMovable: boolean;
  vertexMovable: boolean;
  vertexAddable: boolean;
  vertexDeletable: boolean;
  //起点箭头类型
  sourceMarker: string;
  //终点箭头类型
  targetMarker: string;
  //路由类型
  router: string;
  //连接器
  connector: string;
  //自动吸附
  snap: number;
  //线条类型
  lineType: string;
  //边上工具
  lineTools: string[];
  //节点工具
  nodeTools: string[];
}
