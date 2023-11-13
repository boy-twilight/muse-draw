export interface DrawHistory {
  id: string;
  name: string;
  desc: string;
  data: string;
  lastUpdate: string;
}

export interface GraphNode {
  width: number;
  height: number;
  fontSize: number;
  fontColor: string;
  borderColor: string;
  borderSize: number;
  background: string;
}

export interface GraphLine {
  strokeColor: string;
  strokeWidth: number;
  lineType: string;
}
