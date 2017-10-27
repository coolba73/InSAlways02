import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { MainComponent } from "./main/main.component";

export const routes : Routes = [
    {
        path:'',
        component:MainComponent,
        children:[
            {
                path:'myapp',
                loadChildren:'./myapp/myapp.module#MyAppModule'
            }
        ]
    }
]

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRouting{}