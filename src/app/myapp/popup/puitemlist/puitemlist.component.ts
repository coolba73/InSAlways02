import { Component, Input, Output, EventEmitter, Inject, ViewChild } from "@angular/core";
import { FlowTest2Service } from "../../testapp/flowtest02/flowtest02.service";
import { DxDataGridComponent } from "devextreme-angular";

@Component({
    selector : 'puitemlist',
    templateUrl : './puitemlist.component.html',
    styleUrls : ['./puitemlist.component.css'],
    providers:[FlowTest2Service]
})
export class PuItemListComponent{

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    YesOpen  = false;
    ItemCode = '';
    ItemName = '';
    YesOK = false;
    dsDataSource : any[] = [];

    @Output() Closed = new EventEmitter();

    @ViewChild('grdItemList') grdItemList : DxDataGridComponent;

    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(private service : FlowTest2Service ){
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnOK_Click(){

        let sel = this.grdItemList.instance.getSelectedRowKeys();

        this.ItemCode = sel[0]["ItemCode"];
        this.ItemName = sel[0]["ItemName"];

        this.YesOpen = false;
        this.YesOK = true;
        this.Closed.emit(this.YesOK);
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnCancel_Click(){
        this.YesOpen = false;
        this.YesOK = false;
        this.Closed.emit(this.YesOK);
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Open(){
        
        this.ItemName = '';
        this.ItemCode = '';
        this.YesOpen = true;
        this.YesOK = false;
        this.LoadItemList();
    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async LoadItemList(){
        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/GetStockItemList?code=3tHzRH4nf9nBnmgEVnm0qclWox9M8ayzScvzRPXk5vtAaMksHdJSBg==";
        this.dsDataSource = [];
        this.dsDataSource = await  this.service.CallServiceAwait(url);

    }



}//class



