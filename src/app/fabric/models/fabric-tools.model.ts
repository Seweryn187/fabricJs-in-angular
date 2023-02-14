import {fabric} from "fabric";

export enum DrawingTools {
  SELECT = 'select',
  POLYGON = 'polygon',
  DELETE = 'delete',
  DELETE_ALL = 'delete_all'
}

export interface Pointer {
  x: number;
  y: number;
}

interface CustomFabricProps {
  id: string;
}

export type CustomFabricPolygon = fabric.Polygon & CustomFabricProps;
export type CustomFabricObject = fabric.Object & CustomFabricProps;

