import { NgModule, Pipe, PipeTransform  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyAppRouting } from "./myapp.routing"; 
import { FlowTestComponent } from "./testapp/flowtest/flowtest.component";
import { FlowTest02Component } from "./testapp/flowtest02/flowtest02.component";
import { DrawCanvasComponent } from "./core/material/drawcanvas/drawcanvas.component";
import { NgInit } from "./testapp/flowtest02/flowtest02.component";
import { CorpValuation01Component } from "./testapp/CorpValuation01/corpvaluation01.component";
import { PuItemListComponent } from "./popup/puitemlist/puitemlist.component";
import { PuTreemapComponent } from "./popup/putreemap/putreemap.component";

import { 
      DevExtremeModule 
    , DxPopupModule
    , DxLoadPanelModule
    , DxMenuModule
    , DxSelectBoxModule
    , DxCheckBoxModule 
    , DxContextMenuModule
    ,DxBoxModule
    ,DxTextBoxModule
    ,DxChartModule
    ,DxTreeMapModule
} from "devextreme-angular";

import { FormsModule }             from "@angular/forms";

import { 
      MatCommonModule
    , MatButtonModule
    , MatTabsModule
    , MatDialogModule 
    , MatInputModule
    , MatSidenavModule
    , MatRadioModule
    , MatStepperModule
    , MatCheckboxModule
    , MatOptionModule
    , MatFormFieldModule
    , MatSelectModule
    
   
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
        ,MatCheckboxModule
        ,MatOptionModule
        ,MatFormFieldModule
        ,MatSelectModule
        , DxMenuModule
        , DxSelectBoxModule
        , DxCheckBoxModule 
        ,DxContextMenuModule
        ,DxBoxModule
        ,DxTextBoxModule
        , DxChartModule
        ,DxTreeMapModule
    ],
    declarations:[
        FlowTestComponent,
        FlowTest02Component,
        DrawCanvasComponent,
        EscapeHtmlPipe,
        NgInit,
        CorpValuation01Component,
        PuItemListComponent,
        PuTreemapComponent
        
    ]
})
export class MyAppModule{}