import { NgModule } from "@angular/core";
import { MyAppRouting } from "./myapp.routing"; 
import { FlowTestComponent } from "./testapp/flowtest/flowtest.component";
import { FlowTest02Component } from "./testapp/flowtest02/flowtest02.component";
import { DrawCanvasComponent } from "./core/material/drawcanvas/drawcanvas.component";
import { MatCommonModule, MatButtonModule } from "@angular/material";

@NgModule({
    imports:[
        MyAppRouting
        ,MatCommonModule
        ,MatButtonModule
    ],
    declarations:[
        FlowTestComponent,
        FlowTest02Component,
        DrawCanvasComponent
    ]
})
export class MyAppModule{}