import { Component,ViewChild, OnInit, ViewEncapsulation, AfterViewInit, Inject } from "@angular/core";
import { DrawCanvasComponent } from "../../core/material/drawcanvas/drawcanvas.component";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { UUID }                from "angular2-uuid";
import { FlowTest2Service } from "./flowtest02.service";
import { DxDataGridComponent, DxSelectBoxComponent } from "devextreme-angular";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";

declare var $: any;

enum InputType{
     None
    ,NewFlow
    ,AddBox    
}

@Component({
    selector : 'flowtest02',
    templateUrl : './flowtest02.component.html',
    styleUrls : ['./flowtest02.component.css'],
    providers:[FlowTest2Service]
})
export class FlowTest02Component implements OnInit, AfterViewInit{
    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    flowUid : string = '';
    title : string = '';
    id : string = '';
    popupVisible = false;
    @ViewChild('txtTitle') txtTitle : any;
    loadingVisible = false;
    popupVisible_FlowList = false;

    @ViewChild('grdFlowList') grdFlowList : DxDataGridComponent;
    @ViewChild('grdDataSource') grdDataSource : DxDataGridComponent;
    @ViewChild('cboDataTable') cboDatatable : DxSelectBoxComponent;
    @ViewChild('grdCalculation') grdCalculation : DxDataGridComponent;
    @ViewChild('grdMyDataSource') grdMyData : DxDataGridComponent;

    dsMyDataSource = new Array();

    dsFlowList : any[];

    dsFlowList2:string;

    dsflowResult :any[];

    inputBoxTitle:string='Input Box';
    inputBoxType : InputType = InputType.None;

    popupVisible_BoxProperty = false;

    popupVisible_popupStepper = false;

    dsDataSource : any[];

    BoxPropertyType : string;

    UseExistData = false;

    DataSetType : string = '';
    
    datatables = new Array();;
    @ViewChild("fcvs") finCanvas : DrawCanvasComponent;

    dsCalculation : any[];

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(  private service : FlowTest2Service , private http : Http ){

        this.dsCalculation = 
        [
             {'CalType':'Log 수익률'}
            ,{'CalType':'베타계산'}
        ];

        console.log(this.dsCalculation);
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    ngAfterViewInit(){

         // $ init summernote
         $('#summernote').summernote({
            height:270,
            maxHeight:null,
            minHeight:null
            });

        var self = this;
        $('#summernote').on('summernote.change', 
            function(){
                self.Summernote_Change();
            }
        );
    }
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    ngOnInit(){
       
    }    
    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    AddFlow(){
        
        // let flowBox = new FlowBox();

        // flowBox.x = 10;
        // flowBox.y = 10;

        // this.finCanvas.AddObject(flowBox);

        
        this.inputBoxTitle = "Add Flow Box";
        this.inputBoxType = InputType.AddBox;
        this.popupVisible = true;
        this.txtTitle.nativeElement.value = '';
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    NewFlow(){
        // alert("new flow");

        // let dialogRef = this.dialog.open(InputDialog,{
        //     data: {inputstring:this.title}
        // });
        
        // dialogRef.afterClosed().subscribe(result => {
        //     alert(result);
        // });

        this.inputBoxType = InputType.NewFlow;
        this.inputBoxTitle = "New Flow";
        this.popupVisible = true;
        this.txtTitle.nativeElement.value = '';
        
        

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SaveFlow_Click(){
        // alert("Save flow");
        this.loadingVisible = true;

        this.SaveFlow().subscribe(
            data => {
                this.loadingVisible = false;
            }, 
            error => {
                this.loadingVisible = false;
                alert("Error");
            });
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async OpenFlow(){

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/GetFlowList?code=ZynursoTea6fTDXGX4aTTX24Iayme/yZx6p/HgHllLUoWzh6K6Qb1Q==";
        

        // this.service.CallService(url)
        // .subscribe(
        //     data =>
        //     {
        //         this.dsFlowList = data;
        //         console.log('receive service');
        //     },
        //     error =>
        //     {
        //         alert('error');
        //     }
        // );

        this.dsFlowList = await this.service.CallServiceAwait(url);

        console.log(this.dsFlowList);


        this.popupVisible_FlowList = true;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    onContentReady(e) {
        e.component.option("loadPanel.enabled", false);
    }

    onContentReady2(e) {
        e.component.option("loadPanel.enabled", false);
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    FullScreen(){
        $('#flowtest02_container').toggleClass('fullscreen'); 
    }


  

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    OK_Click(aTitle : string){
    
        if (this.inputBoxType == InputType.NewFlow)
        {
            this.title = aTitle;
            this.id = UUID.UUID();
            this.finCanvas.objects = [];
    
            this.loadingVisible = true;
    
            this.SaveFlow().subscribe(
                data =>
                {
                    this.loadingVisible = false;
                },
                error =>
                {
                    this.loadingVisible = false;
                    alert('error');
                }
            )
        }
        else if (this.inputBoxType == InputType.AddBox)
        {
            let flowBox = new FlowBox();
            
            flowBox.x = 10;
            flowBox.y = 10;
            flowBox.Title = aTitle;
    
            this.finCanvas.AddObject(flowBox);            
        }


        

        this.popupVisible = false;


    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    onShown() {
        // setTimeout(() => {
        //     this.loadingVisible = false;
        // }, 3000);
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    showLoadPanel() {
        this.loadingVisible = true;
    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnNewCancel_Click(){

        
        this.popupVisible = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Open_Click(){

        // let sel = this.grdFlowList.instance.getSelectedRowKeys();

        // this.title = sel[0]["title"];
        // let sel2 = this.dsFlowList.find(i=> i["title"] == this.title );
        // let objString = sel2["drawobject"];
        // this.id = sel2["id"];

        // this.SetCanvasObject(objString);

        // this.popupVisible_FlowList = false;

        let sel = this.grdFlowList.instance.getSelectedRowKeys();
        
        this.title = sel[0]["title"];
        let sel2 = this.dsFlowList.find(i=> i["title"] == this.title );

        this.id = sel2["id"];

        let objString = await this.service.OpenFlowObject(this.id);
        this.SetCanvasObject(objString);

        this.popupVisible_FlowList = false;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    FlowListCancel_Click(){
        this.popupVisible_FlowList = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetCanvasObject(objString:string){

        let jsonObje = JSON.parse(objString);

        let myBox : FlowBox;
        let myLine : LineBase;

        this.finCanvas.objects = [];

        for (let obj of jsonObje){

            if (obj.Type === FlowBox.name)
            {
                myBox = new FlowBox();
                myBox.fillFromJSON(JSON.stringify( obj));
                this.finCanvas.objects.push(myBox);
            }
            else if(obj.Type === LineBase.name)
            {
                myLine = new LineBase();
                myLine.fillFromJSON(JSON.stringify(obj));
                this.finCanvas.objects.push(myLine);
            }
        }

        this.finCanvas.Draw();

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SaveFlow()
    {
        let body = JSON.stringify({
            title : this.title,
            id : this.id,
            flowobject : JSON.stringify(this.finCanvas.objects)
        });

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/SaveFlow?code=ZcN2ZGHPkpqy6EVxPUaMfx6goOAhbNGahobgkGsYDQBaL0Kd801lBA==";
        return this.service.CallService(url, body)

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Run_Click(){

        this.loadingVisible = true;

        console.log('run start');

        this.finCanvas.RunStatusClear();
        this.finCanvas.Draw();
        
        await this.service.RunProc(this.finCanvas.objects);

        this.loadingVisible = false;
        console.log('run end');

    }

    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Summernote_Change(){

        let obj : BaseObject  = this.finCanvas.GetCurrentBox();

        if (obj != null && obj instanceof FlowBox){

            let text = $('#summernote').summernote('code');
            let flowBox = <FlowBox>obj;
            flowBox.document = text;
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_MouseUp(){
        
        // alert('mouse up');
        let obj : BaseObject = this.finCanvas.GetCurrentBox();
        this.datatables = new Array();
        this.dsflowResult = [];

        if (obj instanceof FlowBox)
        {
            let flowBox = <FlowBox>obj;

            $('#summernote').summernote('code',flowBox.document);

            if (flowBox.ResultDataJsonString != '')
            {
                let retData = JSON.parse(flowBox.ResultDataJsonString);

                console.log(flowBox.ResultDataJsonString);
                
                for (var key in retData)
                {
                    this.datatables.push(key);
                }
            }

            this.cboDataTablesChanges();

            // console.log(flowBox.ResultDataJsonString);
        }
        else
        {
            $('#summernote').summernote('code','');
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    BoxProperty_Cancel_Click(){
        this.popupVisible_BoxProperty = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    BoxProperty_OK_Click(){

        let flowProperty : any = {};

        flowProperty.Type = this.BoxPropertyType;
        flowProperty.UseExistData = this.UseExistData;

        if (flowProperty.Type == "Calculation")
        {
            let sel = this.grdCalculation.instance.getSelectedRowKeys();
            // console.log(sel[0]);
            flowProperty.CalculationType = sel[0]['CalType'];
        }
        else
        {
            flowProperty.MyData = this.dsMyDataSource;
            flowProperty.DataSetType = this.DataSetType;
        }

        (<FlowBox>this.finCanvas.GetCurrentBox()).MyProperty = JSON.stringify(flowProperty);

        this.popupVisible_BoxProperty = false;

        console.log(flowProperty);

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnProperty_Click(){

        if (this.finCanvas.GetCurrentBox() == null) 
        {
            alert('no selected box');
            return;
        }

        this.popupVisible_BoxProperty = true;

        let prop = (<FlowBox>this.finCanvas.GetCurrentBox()).MyProperty;

        if (prop != "")
        {
            let propObj = JSON.parse(prop);
            
            this.BoxPropertyType = propObj.Type;
            this.dsMyDataSource = propObj.MyData;
            this.DataSetType = propObj.DataSetType;
            this.UseExistData = propObj.UseExistData;

            if (this.BoxPropertyType == "Calculation"){
                
                this.grdCalculation.instance.searchByText(propObj.CalculationType);
                this.grdCalculation.instance.selectRows([1],true);

            }
        }
        else
        {
            this.BoxPropertyType = '';
            this.dsMyDataSource = new Array();
        }
        
    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    popupStepper_Cancel_Click(){
        this.popupVisible_popupStepper = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    popupStepper_OK_Click(){
        this.popupVisible_popupStepper = false;
    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async SearchDataSource(){

        /**
         * 주식 리스트 조회
         */

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/GetStockItemList?code=3tHzRH4nf9nBnmgEVnm0qclWox9M8ayzScvzRPXk5vtAaMksHdJSBg==";

        this.dsDataSource = [];

        this.dsDataSource = await this.service.CallServiceAwait(url);

        // this.service.CallService(url).subscribe(
        //     data=>{
        //         this.dsDataSource = data;
        //     },
        //     error =>
        //     {
        //         alert(error);
        //     }
        // );

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    AddMyDataSource(){
        let sel = this.grdDataSource.instance.getSelectedRowKeys();

        let d : any = {};

        d.ItemCode = sel[0]["ItemCode"];
        d.ItemName = sel[0]["ItemName"];
        
        this.dsMyDataSource.push(d);

        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    cboDataTablesChanges(){
        // alert(this.cboDatatable.selectedItem);

        let obj = this.finCanvas.GetCurrentBox();

        if (obj instanceof FlowBox){

            let flowBox = <FlowBox>obj;

            let id = this.cboDatatable.selectedItem;

            let jobj = JSON.parse(flowBox.ResultDataJsonString);

            // console.log(jobj[id]);

            this.dsflowResult = jobj[id];

            
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnWriteResult_Click(){
        
        let obj = <FlowBox>this.finCanvas.GetCurrentBox();

        let re : any = {};

        re[obj.Id] = obj.ResultDataJsonString; 

        console.log( JSON.stringify(re) );

    }

   
    
}//class
//############################################################################################################################################################################################################################################################




