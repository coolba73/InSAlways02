import { NgModule }             from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlowTestComponent }    from "./testapp/flowtest/flowtest.component";
import { FlowTest02Component }    from "./testapp/flowtest02/flowtest02.component";

const routes : Routes = [
    {
        path:'',
        children:[
            {
                path:'flowtest',
                component:FlowTestComponent
            },
            {
                path:'flowtest02',
                component:FlowTest02Component
            }
        ]
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class MyAppRouting{}
