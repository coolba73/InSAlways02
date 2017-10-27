import { NgModule } from "@angular/core";
import { MyAppRouting } from "./myapp.routing"; 
import { FlowTestComponent } from "./testapp/flowtest/flowtest.component";
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
        DrawCanvasComponent
    ]
})
export class MyAppModule{}