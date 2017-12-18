import { NgModule }             from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FlowTestComponent }    from "./testapp/flowtest/flowtest.component";
import { FlowTest02Component }    from "./testapp/flowtest02/flowtest02.component";
import { CorpValuation01Component } from "./testapp/CorpValuation01/corpvaluation01.component";

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
            },
            {
                path:'corpvalueation01',
                component:CorpValuation01Component
            }
        ]
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class MyAppRouting{}
