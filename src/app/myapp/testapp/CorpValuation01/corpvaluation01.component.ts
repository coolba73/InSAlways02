import { Component , ViewChild } from "@angular/core";
import { PuItemListComponent } from "../../popup/puitemlist/puitemlist.component";

@Component({
    selector : 'corpvaluation01',
    templateUrl : './corpvaluation01.component.html',
    styleUrls : ['./corpvaluation01.component.css']
})

export class CorpValuation01Component{

    @ViewChild('popupItemlist') popupItemlist : PuItemListComponent;

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

        }
        else
        {

        }

    }

}//class