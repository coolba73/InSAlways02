import { NgModule, Pipe, PipeTransform  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyAppRouting } from "./myapp.routing"; 
import { FlowTestComponent } from "./testapp/flowtest/flowtest.component";
import { FlowTest02Component } from "./testapp/flowtest02/flowtest02.component";
import { DrawCanvasComponent } from "./core/material/drawcanvas/drawcanvas.component";

import { DevExtremeModule , DxPopupModule, DxLoadPanelModule } from "devextreme-angular";

import { FormsModule }             from "@angular/forms";

import { 
      MatCommonModule
    , MatButtonModule
    , MatTabsModule
    , MatDialogModule 
    , MatInputModule
    ,MatSidenavModule
    ,MatRadioModule
    ,MatStepperModule
    
    
} from "@angular/material";



// TODO: this should go in a shared module. 
import { DomSanitizer } from '@angular/platform-browser'
@Pipe({ name: 'escapeHtml', pure: false })
export class EscapeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value: any, args: any[] = []) {       
        // simple JS inj cleanup that should be done on server side primarly
        if (value.indexOf('<script>') != -1) {
            console.log('JS injection. . . html purified');
            return value.replace('<script>', '').replace('<\/script>', '');
        }
        return this.sanitized.bypassSecurityTrustHtml(value); // so ng2 does not remove CSS
    }
}
// End

@NgModule({
    imports:[
        MyAppRouting
        ,MatCommonModule
        ,MatButtonModule
        ,MatTabsModule
        ,MatInputModule
        ,MatDialogModule
        ,CommonModule
        ,DevExtremeModule
        ,FormsModule
        ,DxLoadPanelModule
        ,MatSidenavModule
        ,MatRadioModule
        ,MatStepperModule
    ],
    declarations:[
        FlowTestComponent,
        FlowTest02Component,
        DrawCanvasComponent,
    ]
})
export class MyAppModule{}