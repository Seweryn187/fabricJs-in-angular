import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabricCanvasComponent } from './components/fabric-canvas/fabric-canvas.component';



@NgModule({
    declarations: [
        FabricCanvasComponent
    ],
    exports: [
        FabricCanvasComponent
    ],
    imports: [
        CommonModule
    ]
})
export class FabricModule { }
