import {AfterContentInit, Component} from '@angular/core';
import {Canvas, Polygon} from "fabric/fabric-impl";
import {fabric} from "fabric";
import {FabricEventHandlerService} from "../../services/fabric-event-handler.service";
import {DrawingTools} from "../../models/fabric-tools.model";

@Component({
  selector: 'app-fabric-canvas',
  templateUrl: './fabric-canvas.component.html',
  styleUrls: ['./fabric-canvas.component.scss']
})
export class FabricCanvasComponent implements AfterContentInit {
  canvas!: Canvas;
  polygon1!: Polygon;
  polygon2!: Polygon;
  image = new Image();

  canvasToJson!: string;

  isAddingOn = false;

  url!: string;
  setOfPoints1 = [new fabric.Point(200 , 10), new fabric.Point(250, 50),  new fabric.Point(250, 180),  new fabric.Point(150, 180),  new fabric.Point(150, 50)];
  setOfPoints2 = [new fabric.Point(230 , 10), new fabric.Point(280, 50),  new fabric.Point(280, 180),  new fabric.Point(180, 180),  new fabric.Point(180, 50)];
  polygonPoints: fabric.Point[] = [];
  polygons = [this.setOfPoints1, this.setOfPoints2];

  selected = this.fabricEventHandler.selectedTool;
  DrawingTools = DrawingTools;


  constructor(private fabricEventHandler: FabricEventHandlerService) { }

  ngAfterContentInit(): void {
    if (this.fabricEventHandler.canvas) {
      this.fabricEventHandler.canvas.dispose();
    }
    this.canvas = new fabric.Canvas('myCanvas', {
      selection: false,
      preserveObjectStacking: true,
    });
    this.canvas.setHeight(500);
    this.canvas.setWidth(1280);

    this.polygon1 = new fabric.Polygon( this.setOfPoints1, {
      left: 10,
      top: 10,
      fill: 'rgb(0,0,0)',
      strokeWidth: 1,
      stroke: 'lightgrey',
      scaleX: 1,
      scaleY: 1,
      objectCaching: false,
      transparentCorners: false,
      selectable: true,
      cornerColor: 'blue'

    });

    this.polygon2 = new fabric.Polygon( this.setOfPoints1, {
      left: 150,
      top: 10,
      fill: 'rgb(0,0,0)',
      strokeWidth: 1,
      stroke: 'lightgrey',
      scaleX: 1,
      scaleY: 1,
      objectCaching: false,
      transparentCorners: false,
      selectable: true,
      cornerColor: 'blue',
    });

    this.canvas.add(this.polygon1);
    this.canvas.add(this.polygon2);

    this.fabricEventHandler.canvas = this.canvas;
    this.fabricEventHandler.extendToObjectWithId();
    fabric.Object.prototype.objectCaching = false;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvas.on('mouse:down', e =>  this.onCanvasMouseDown(e));
    this.canvas.on('mouse:move', e => this.onCanvasMouseMove(e));
    this.canvas.on('mouse:up', () =>this.onCanvasMouseUp());
  }

  private onCanvasMouseDown(event: { e: Event }) {
    this.fabricEventHandler.mouseDown(event.e);
    event.e.stopPropagation();
  }
  private onCanvasMouseMove(event: { e: Event }) {
    this.fabricEventHandler.mouseMove(event.e);
  }
  private onCanvasMouseUp() {
    this.fabricEventHandler.mouseUp();
  }

  public selectBackgroundFile(event: any): void {
    const canvas = this.canvas;
    if (event.target.files) {
      const reader = new FileReader();
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        fabric.Image.fromURL(this.url, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            // @ts-ignore
            scaleX: canvas.width / img.width,
            // @ts-ignore
            scaleY: canvas.height / img.height
          });
        });
      };
    }
  }

  convertCanvasObjectsToJson() {
    const canvasObjects = this.canvas.toJSON().objects;
    this.canvasToJson = JSON.stringify(canvasObjects, null, 2);
  }

  loadFromJson() {

  }

  activateReadOnlyMod() {
    this.canvas.hoverCursor !== 'pointer' ? this.canvas.hoverCursor = 'pointer' : this.canvas.hoverCursor = 'move';
    this.canvas.getObjects().map( (object) => {
      object.selectable = !object.selectable;
      // object.lockMovementX = !object.lockMovementX;
      // object.lockMovementY = !object.lockMovementY;
    });
  }

  async select(tool: DrawingTools) {
    console.log(this.canvas);
    this.fabricEventHandler.selectedTool = tool;
    this.selected = this.fabricEventHandler.selectedTool;
  }

  public edit() {
    this.canvas.getObjects()[0].controls;
  //   let poly = this.canvas.getObjects()[0] as Polygon;
  //   this.canvas.setActiveObject(poly);
  //   console.log(poly);
  //   console.log(this.polygon1);
  //   if (!('edit' in poly)) {
  //     poly.edit = false;
  //   }
  //   // @ts-ignore
  //   poly.edit = !poly.edit;
  //   // @ts-ignore
  //   if (poly.edit) {
  //     // @ts-ignore
  //     let lastControl = poly.points.length - 1;
  //     poly.cornerStyle = 'circle';
  //     poly.cornerColor = 'rgba(0,0,255,0.5)';
  //     // @ts-ignore
  //     poly.controls = poly.points.reduce((acc: any, point, index) => {
  //       acc['p' + index] = new fabric.Control({
  //         positionHandler: this.polygonPositionHandler,
  //         actionHandler: this.anchorWrapper(index > 0 ? index - 1 : lastControl, this.actionHandler),
  //         actionName: 'modifyPolygon',
  //         // @ts-ignore
  //         pointIndex: index
  //       });
  //       return acc;
  //     }, { });
  //   } else {
  //     poly.cornerColor = 'blue';
  //     poly.cornerStyle = 'rect';
  //     poly.controls = fabric.Object.prototype.controls;
  //   }
  //   // @ts-ignore
  //   poly.hasBorders = !poly.edit;
  //   this.canvas.requestRenderAll();
  }

}
