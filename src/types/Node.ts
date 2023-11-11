export interface DrawHistory {
  id: string;
  name: string;
  desc: string;
  data: string;
  lastUpdate: string;
}

export interface Node {
  width: number;
  height: number;
  label: string;
  fontSize: number;
  fontColor: number;
  borderColor: string;
  borderSize: number;
  background: string;
}
