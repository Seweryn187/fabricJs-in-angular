import { Injectable } from '@angular/core';
import {CustomFabricPolygon, Pointer} from "../models/fabric-tools.model";
import {fabric} from "fabric";
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FabricShapeHandlerService {
  RANGE_AROUND_FIRST_POINT = 20;

  constructor() { }

  isClickNearPolygonCenter(polygon: CustomFabricPolygon, pointer: Pointer): boolean {
    if(polygon.points) {
      const centerXOfPolygon =
        (Math.max(...polygon.points.map(p => p.x)) + Math.min(...polygon.points.map(p => p.x))) / 2;
      const centerYOfPolygon =
        (Math.max(...polygon.points.map(p => p.y)) + Math.min(...polygon.points.map(p => p.y))) / 2;
      // const firstPointX = polygon.points[0].x;
      // const firstPointY = polygon.points[0].y;

      return Math.abs(pointer.x - centerXOfPolygon) <= this.RANGE_AROUND_FIRST_POINT && Math.abs(pointer.y - centerYOfPolygon) <= this.RANGE_AROUND_FIRST_POINT;
    }else {
      return false;
    }
  }

  createPolygon(
    canvas: fabric.Canvas,
    pointer: Pointer,
  ): CustomFabricPolygon {
    const polygon = new fabric.Polygon([pointer], {
      selectable: false,
      hasRotatingPoint: false,
      cornerColor: 'blue',
      transparentCorners: false,
    }) as CustomFabricPolygon;
    polygon.id = uuid();
    canvas.add(polygon);
    return polygon;
  }

  formFirstLineOfPolygon(polygon: CustomFabricPolygon, initialPointer: Pointer, pointer: Pointer) {
    polygon.points = [new fabric.Point(initialPointer.x, initialPointer.y), new fabric.Point(pointer.x, pointer.y)];
  }

  addPointToPolygon(polygon: CustomFabricPolygon, pointer: Pointer) {
    if(polygon.points) {
      polygon.points.push(new fabric.Point(pointer.x, pointer.y));
    }
  }

  finishPolygon(canvas: fabric.Canvas, polygon: CustomFabricPolygon): CustomFabricPolygon {
    if(polygon.points) {
      canvas.remove(polygon);
      const newPolygon = new fabric.Polygon(polygon.points, {
        selectable: false,
        hasRotatingPoint: false,
        cornerColor: 'blue',
        transparentCorners: false,
      }) as CustomFabricPolygon;
      newPolygon.id = polygon.id;
      canvas.add(newPolygon);
      return newPolygon;
    } else {
      return polygon;
    }

  }
}
