import { NgModule }             from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlowTestComponent }    from "./testapp/flowtest/flowtest.component";

const routes : Routes = [
    {
        path:'',
        children:[
            {
                path:'flowtest',
                component:FlowTestComponent
            }
        ]
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class MyAppRouting{}
