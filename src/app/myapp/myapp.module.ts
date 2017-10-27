import { NgModule } from "@angular/core";
import { MyAppRouting } from "./myapp.routing"; 
import { FlowTestComponent } from "./testapp/flowtest/flowtest.component";

@NgModule({
    imports:[
        MyAppRouting
    ],
    declarations:[
        FlowTestComponent
    ]
})
export class MyAppModule{}