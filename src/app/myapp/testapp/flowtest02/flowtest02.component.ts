import { Component,ViewChild, OnInit, ViewEncapsulation, AfterViewInit, Inject } from "@angular/core";
import { DrawCanvasComponent } from "../../core/material/drawcanvas/drawcanvas.component";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { UUID }                from "angular2-uuid";
import { FlowTest2Service } from "./flowtest02.service";
import { DxDataGridComponent, DxSelectBoxComponent, DxTextBoxComponent } from "devextreme-angular";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";
import { FormArrayName } from "@angular/forms/src/directives/reactive_directives/form_group_name";
import { Menu, MenuService } from "./menu.service";

declare var $: any;

enum InputType{
     None
    ,NewFlow
    ,AddBox    
    ,CopyFlow
}

@Component({
    selector : 'flowtest02',
    templateUrl : './flowtest02.component.html',
    styleUrls : ['./flowtest02.component.css'],
    providers:[FlowTest2Service, MenuService]
})
export class FlowTest02Component implements OnInit, AfterViewInit{
    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    flowUid : string = '';
    title : string = ' ';
    id : string = '';
    inputBoxTitle:string='Input Box';
    inputBoxType : InputType = InputType.None;
    BoxPropertyType : string;
    UseExistData = false;
    DataSetType : string = '';
    CalculationType : string = '';
    targetDataSource = '';
    targetDataSourceName = '';
    targetTable = '';
    targetColumn = '';
    menus : Menu[];
    contextMenu : any;
    inputData : any;
    previousBox : any;
    copyFlowTitle = '';
    resultColumnName = '';
    numeratorColumn = '';//분자
    denominatorColumn = '';//분모

    
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    loadingVisible = false;
    popupVisible_FlowList = false;
    popupVisible_BoxProperty = false;
    popupVisible_popupStepper = false;
    popupVisible = false;
    popupVisible_popupSetDataInfo = false;

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    @ViewChild('txtTitle') txtTitle : any;
    @ViewChild('grdFlowList') grdFlowList : DxDataGridComponent;
    @ViewChild('grdDataSource') grdDataSource : DxDataGridComponent;
    @ViewChild('cboDataTable') cboDatatable : DxSelectBoxComponent;
    @ViewChild('grdCalculation') grdCalculation : DxDataGridComponent;
    @ViewChild('grdMyDataSource') grdMyData : DxDataGridComponent;
    @ViewChild("fcvs") finCanvas : DrawCanvasComponent;
    @ViewChild("cboTargetTable") cboTargetTable : DxSelectBoxComponent;
    @ViewChild("cboTargetColumn") cboTargetColumn : DxSelectBoxComponent;
    @ViewChild("cboTargetSource") cboTargetSource :DxSelectBoxComponent;
    @ViewChild("txtResultColumnName") txtResultColumnName : DxTextBoxComponent;


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    dsMyDataSource = new Array();
    dsFlowList : any[];
    dsFlowList2:string;
    dsflowResult :any[];
    dsDataSource : any[];
    datatables = new Array();
    dsCalculation : any[];
    dsTargetTable = new Array();
    dsTargetColumn = new Array();
    dsTargetSource = new Array();

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(  private service : FlowTest2Service , private http : Http , menuService : MenuService){

        this.dsCalculation = 
        [
             {'CalType':'Log 수익률'}
            ,{'CalType':'베타계산'}
            ,{'CalType':'평균계산'}
            ,{'CalType':'데이터곱'}
            ,{'CalType':'데이터빼기'}
            ,{'CalType':'데이터나누기'}
            ,{'CalType':'데이터더하기'}

        ];

        this.menus = menuService.getMenus();

        this.contextMenu = [
                                { 
                                    text: 'Property' 
                                }
                                ,{
                                    text:'Write Console Log',
                                    items:[
                                          { text: 'Property Info' }
                                        , { text: 'Result Data' }
                                        , { text: 'Input Data' }

                                ]
                                }
                                
                            ];
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
    CopyFlow_Click(){


        this.inputBoxType = InputType.CopyFlow;
        this.inputBoxTitle = "Copy Flow";
        this.popupVisible = true;

        // this.loadingVisible = true;
        
        // this.CopyFlow().subscribe(
        //     data => {
        //         this.loadingVisible = false;
        //     }, 
        //     error => {
        //         this.loadingVisible = false;
        //         alert("Error");
        //     });
        
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
        else if (this.inputBoxType == InputType.CopyFlow)
        {
            this.loadingVisible = true;
        
            this.CopyFlow().subscribe(
                data => {
                    this.loadingVisible = false;
                }, 
                error => {
                    this.loadingVisible = false;
                    alert("Error");
                });
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
    CopyFlow()
    {
        // var today = new Date();
        // var dd = today.getDate();
        // var mm = today.getMonth()+1; //January is 0!
        // var yyyy = today.getFullYear();
        // var hh = today.getHours();
        // var mm = today.getMinutes();
        // var ss = today.getSeconds();

        // var today2 =''+ yyyy + mm  + dd + hh + mm + ss;

        
        
        // var newTitle = this.title + " " + today2;

        var newTitle = this.copyFlowTitle;

        let newid = UUID.UUID();

        let body = JSON.stringify({
            title : newTitle,
            id : newid,
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
                
                for (var key in retData)
                {
                    this.datatables.push(key);
                }
            }

            this.cboDataTablesChanges();
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
            // let sel = this.grdCalculation.instance.getSelectedRowKeys();
            // console.log(sel[0]);
            // flowProperty.CalculationType = sel[0]['CalType'];

            flowProperty.CalculationType = this.CalculationType;
    
            flowProperty.TargetDataSource = this.targetDataSource;
            flowProperty.TargetTable = this.targetTable;
            flowProperty.TargetColumn = this.targetColumn;
            flowProperty.ResultColumnName = this.resultColumnName;
            flowProperty.NumeratorColumn = this.numeratorColumn;
            flowProperty.denominatorColumn = this.denominatorColumn;

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
    async btnProperty_Click(){

        if (this.finCanvas.GetCurrentBox() == null) 
        {
            alert('no selected box');
            return;
        }

        this.previousBox = await this.finCanvas.GetPreviousBox();

        this.CalculationType = '';
        this.targetDataSource = '';
        this.targetTable = '';
        this.targetColumn = '';
        this.resultColumnName = '';
        this.numeratorColumn = '';
        this.denominatorColumn = '';

        this.popupVisible_BoxProperty = true;

        let prop = (<FlowBox>this.finCanvas.GetCurrentBox()).MyProperty;

        if (prop != "")
        {
            let propObj = JSON.parse(prop);
            
            this.BoxPropertyType = propObj.Type;
            this.dsMyDataSource = propObj.MyData;
            this.DataSetType = propObj.DataSetType;
            this.UseExistData = propObj.UseExistData;

            this.resultColumnName = propObj.ResultColumnName;

            this.targetDataSource = propObj.TargetDataSource;
            this.targetDataSourceName =  this.previousBox.find(i=>i.ID == this.targetDataSource).Title ;
            this.targetTable = propObj.TargetTable;
            this.targetColumn = propObj.TargetColumn;

            this.numeratorColumn = propObj.NumeratorColumn;
            this.denominatorColumn = propObj.DenominatorColumn;

            if (this.BoxPropertyType == "Calculation"){
                
                // this.grdCalculation.instance.searchByText(propObj.CalculationType);
                // this.grdCalculation.instance.selectRows([1],true);
                this.CalculationType = propObj.CalculationType;

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

        if (obj instanceof FlowBox)
        {

            if ( (<FlowBox>obj).ResultDataJsonString != '')
            {
                let flowBox = <FlowBox>obj;
                
                let id = this.cboDatatable.selectedItem;
    
                let jobj = JSON.parse(flowBox.ResultDataJsonString);
    
                // console.log(jobj[id]);
    
                this.dsflowResult = jobj[id];
            }
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnWriteResult_Click(){
        
        let obj = <FlowBox>this.finCanvas.GetCurrentBox();

        let re : any = {};

        re[obj.Id] = obj.ResultDataJsonString; 

        console.log(JSON.parse(obj.ResultDataJsonString));
        console.log( JSON.stringify(re) );


    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnViewInputData_Click(){
        
        var re = await this.service.SetPreviousResult(this.finCanvas.objects, this.finCanvas.GetCurrentObject().Id);
        var re2 = await this.service.SetPreviousResultJson(this.finCanvas.objects, this.finCanvas.GetCurrentObject().Id);

        console.log(re2);
        console.log(JSON.stringify(re));

        var prebox = this.finCanvas.GetPreviousBox();

        console.log(prebox);

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnSetCalculationType_Click(){
        this.CalculationType = this.grdCalculation.instance.getSelectedRowKeys()[0]['CalType'];
    }

   
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    popupSetDataInfo_Cancel_Click(){
        this.popupVisible_popupSetDataInfo = false;
    }
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    popupSetDataInfo_OK_Click(){

        this.targetDataSource =  this.previousBox.find(i=>i.Title == this.cboTargetSource.selectedItem).ID ;
        this.targetDataSourceName = this.cboTargetSource.selectedItem;
        this.targetTable = this.cboTargetTable.selectedItem;
        this.targetColumn = this.cboTargetColumn.selectedItem;
        
        this.popupVisible_popupSetDataInfo = false;
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnSetDataInfo_Click()
    {
        this.dsTargetTable = new Array();
        this.dsTargetColumn = new Array();
        this.dsTargetSource = new Array();

        let flowbox  = <FlowBox> this.finCanvas.GetCurrentBox();
        
        this.inputData = await this.service.SetPreviousResult(this.finCanvas.objects, flowbox.Id);
        

        for ( var i of this.previousBox)
        {
            console.log(i);
            this.dsTargetSource.push(i.Title);
        }

        // for (var k1 in preData)
        // {
        //     var obj2 = JSON.parse( preData[k1]);

        //     for(var k2 in obj2 )
        //     {
        //         this.dsTargetTable.push(k2);
        //     }

        //     for (var k3 in obj2[k2][0])
        //     {
        //         this.dsTargetColumn.push(k3);
        //     }
        // }

        this.popupVisible_popupSetDataInfo = true;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnViewProperty_Click()
    {
        var box = <FlowBox>this.finCanvas.GetCurrentBox();
        console.log(box.GetProperty());
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    MenuItem_Click(data) {

       console.log(data.itemData.name);

       switch(data.itemData.name)
       {
           case "New":{
                this.NewFlow();
                break;
           }
           case "Save":{
                this.SaveFlow_Click();
                break;
           }
           case "Open":{
                this.OpenFlow();
                break;
           }
           case "Copy Flow":{
                this.CopyFlow_Click();
                break;
           }
           case "Add Box":{
                this.AddFlow();
               break;
           }
           case "Run":{
               this.Run_Click();
               break;
           }
       }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    ContextMenuItem_Click(e) {
        console.log(e.itemData.text);

        switch(e.itemData.text)
        {

            case "Property":{
                this.btnProperty_Click();
                break;
            }
            case "Property Info":{
                this.btnViewProperty_Click();
                break;
            }
            case "Result Data":{
                this.btnWriteResult_Click();
                break;
            }
            case "Input Data":{
                this.btnViewInputData_Click();
                break;
            }
           
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    cboTargetSource_Change(){

        this.dsTargetTable = new Array();
        this.dsTargetColumn = new Array();


        console.log(this.cboTargetSource.selectedItem);

        let id = this.previousBox.find(i=> i.Title == this.cboTargetSource.selectedItem ).ID;

        console.log(id);

        console.log(this.inputData);

        for ( var k in JSON.parse( this.inputData[id]))
        {
            console.log(k);
            this.dsTargetTable.push(k);
        }

        this.cboTargetTable_Change();

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    cboTargetTable_Change(){

        this.dsTargetColumn = new Array();

        let id = this.previousBox.find(i=> i.Title == this.cboTargetSource.selectedItem ).ID;

        let obj = JSON.parse( this.inputData[id])[this.cboTargetTable.selectedItem];

        console.log(obj);

        for ( var k in obj[0])
        {
            this.dsTargetColumn.push(k);
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    InputPopup_OnShown(){
        if (this.inputBoxType == InputType.CopyFlow )
        {
            this.txtTitle.nativeElement.value = this.title;
        }
        else
        {
            this.txtTitle.nativeElement.value = "";
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Numerator_Click(){

        //분자클릭
        this.numeratorColumn = this.cboTargetColumn.selectedItem;
    }
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Denominator_Click(){
        //분모클릭
        this.denominatorColumn = this.cboTargetColumn.selectedItem;
    }


    
}//class
//############################################################################################################################################################################################################################################################




