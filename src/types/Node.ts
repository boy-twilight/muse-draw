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
  sourceMarker: string;
  targetMarker: string;
  markerHeight: number;
  markerWidth: number;
  fontSize: number;
  fontColor: string;
}

export interface GraphProperty {
  background: string;
}
