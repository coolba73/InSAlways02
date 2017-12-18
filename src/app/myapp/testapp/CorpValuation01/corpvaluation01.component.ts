import { Component , ViewChild } from "@angular/core";
import { PuItemListComponent } from "../../popup/puitemlist/puitemlist.component";

@Component({
    selector : 'corpvaluation01',
    templateUrl : './corpvaluation01.component.html',
    styleUrls : ['./corpvaluation01.component.css']
})

export class CorpValuation01Component{

    @ViewChild('popupItemlist') popupItemlist : PuItemListComponent;

    ItemName = "";
    ItemCode = "";
    Display = "";

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnOpenItemList_Click()
    {
        this.popupItemlist.Open();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    popupItemList_Closed(YesOK)
    {
        if (YesOK===true)
        {
            this.ItemName = this.popupItemlist.ItemName;
            this.ItemCode = this.popupItemlist.ItemCode;
            this.Display = this.ItemName + " (" + this.ItemCode + ")";
            
        }
        else
        {
            this.Display = "";
        }

    }

}//class