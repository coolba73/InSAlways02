import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector : 'putreemap',
    templateUrl : './putreemap.component.html',
})
export class PuTreemapComponent{
    
    @Output() Closed = new EventEmitter();
    DsTreeMap : any[];
    YesOpen = false;


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Treemap_Cancel_Click(){
        
        this.YesOpen = false;
        this.Closed.emit();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Treemap_OK_Click(){

        this.YesOpen = false;
        this.Closed.emit();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Open(){
        
        this.YesOpen = true;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    customizeTooltip(arg){
        // console.log(arg.valueText);

        return {
            "text" : arg.valueText + "%"
        };
    }

}//class