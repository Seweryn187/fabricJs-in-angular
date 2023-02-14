import {Injectable} from '@angular/core';
import {CustomFabricObject, CustomFabricPolygon, DrawingTools, Pointer} from "../models/fabric-tools.model";
import {fabric} from "fabric";
import {FabricShapeHandlerService} from "./fabric-shape-handler.service";


@Injectable({
  providedIn: 'root'
})
export class FabricEventHandlerService {

  public canvas!: fabric.Canvas;
  private _selectedTool: DrawingTools = DrawingTools.SELECT;
  private _isMouseDown = false;
  private _initPositionOfElement!: Pointer;
  private _elementUnderDrawing: CustomFabricPolygon | undefined;

  set selectedTool(t: DrawingTools) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this._selectedTool = t;
    if (
      this._selectedTool === DrawingTools.SELECT
    ) {
      this.objectsSelectable(true);
    } else {
      this.objectsSelectable(false);
    }
    if (this.selectedTool === DrawingTools.DELETE_ALL) {
      const background = this.canvas.backgroundImage;
      this.canvas.clear();
      if(background) {
        this.canvas.setBackgroundImage(background, () => {});
      }
    }
    if(this.selectedTool === DrawingTools.DELETE) {
      const activeObject = this.canvas.getActiveObject();
      if(activeObject !== null) {
        this.canvas.remove(activeObject);
      }
    }
  }
  get selectedTool(): DrawingTools {
    return this._selectedTool;
  }
  constructor(private fabricShapeHandlerService: FabricShapeHandlerService) { }
  extendToObjectWithId(): void {
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (this: CustomFabricObject) {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id,
        });
      };
    })(fabric.Object.prototype.toObject);
  }

  mouseDown(e: Event) {
    this._isMouseDown = true;
    const pointer = this.canvas.getPointer(e);
    this._initPositionOfElement = { x: pointer.x, y: pointer.y };

    switch (this._selectedTool) {
      case DrawingTools.POLYGON:
        if (!this._elementUnderDrawing) {
          this._elementUnderDrawing = this.fabricShapeHandlerService.createPolygon(
            this.canvas,
            pointer
          );
        } else {
          if (
            this.fabricShapeHandlerService.isClickNearPolygonCenter(
              this._elementUnderDrawing as CustomFabricPolygon,
              pointer
            )
          ) {
            this._elementUnderDrawing = this.fabricShapeHandlerService.finishPolygon(this.canvas, this
              ._elementUnderDrawing as CustomFabricPolygon);
            this._elementUnderDrawing = undefined;
          } else {
            this.fabricShapeHandlerService.addPointToPolygon(this._elementUnderDrawing as CustomFabricPolygon, pointer);
          }
        }
        break;
    }
  }

  mouseMove(e: Event) {
    if (!this._isMouseDown) {
      return;
    }
    const pointer = this.canvas.getPointer(e);
    switch (this._selectedTool) {
      case DrawingTools.POLYGON:
        this.fabricShapeHandlerService.formFirstLineOfPolygon(
          this._elementUnderDrawing as CustomFabricPolygon,
          this._initPositionOfElement,
          pointer,
        );
        break;
    }
    this.canvas.renderAll();
  }

  mouseUp() {
    this._isMouseDown = false;
    if (this._selectedTool !== DrawingTools.POLYGON) {
      this._elementUnderDrawing = undefined;
    }
    if (this._selectedTool !== DrawingTools.SELECT) {
      this.canvas.renderAll();
    }
  }

  private objectsSelectable(isSelectable: boolean) {
    this.canvas.forEachObject(obj => {
      obj.selectable = isSelectable;
    });
  }
}
