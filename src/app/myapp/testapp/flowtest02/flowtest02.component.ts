import { 
    Component
    , ViewChild
    , OnInit
    , ViewEncapsulation
    , AfterViewInit
    , Inject 
    , Directive
    , Input
} from "@angular/core";

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
    ,SetTitle
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
    calKeyColumn = '';
    yesFullScreen = false;
    yesResetSummernote = true;
    NewTitle = '';
    NewID = '';
    TextBoxValue = '';
    propCutRateAColumnInfo = {};
    propCutRateBColumnInfo = {};
    strColumnInfo = "";
    
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    loadingVisible = false;
    popupVisible_FlowList = false;
    popupVisible_BoxProperty = false;
    popupVisible_popupStepper = false;
    popupVisible = false;
    popupVisible_popupSetDataInfo = false;
    popupVisible_TextBox = false;

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
    @ViewChild("cboCutRateAColumn") cboCutRateAColumn : DxSelectBoxComponent;


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
    dsCutRateColumn_A = new Array();


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(  private service : FlowTest2Service , private http : Http , menuService : MenuService){

        //----------------------------
        // 계산 타입 설정
        //----------------------------
        this.dsCalculation = 
        [
             {'CalType':'Log 수익률'}
            ,{'CalType':'베타계산'}
            ,{'CalType':'평균계산'}
            ,{'CalType':'데이터곱'}
            ,{'CalType':'데이터빼기'}
            ,{'CalType':'데이터나누기'}
            ,{'CalType':'데이터더하기'}
            ,{'CalType':'Set Ranking'}
            ,{'CalType':'표준편차'}
            ,{'CalType':'자산위험계산'}
            ,{'CalType':'자산교차위험계산'}
            ,{'CalType':'절사율 A 계산'}
            ,{'CalType':'절사율 B 계산'}

        ];

        this.menus = menuService.getMenus();

        //----------------------------
        // context menu list set
        //----------------------------
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
                                        , { text: 'Error'}

                                ]
                                }
                                ,{
                                    text:'Set Title'
                                }
                                
                            ];

        //----------------------------
        // 절사율 계산 A column set
        //----------------------------
        this.dsCutRateColumn_A.push("초과수익률");
        this.dsCutRateColumn_A.push("베타j : 각종목의 베타");
        this.dsCutRateColumn_A.push("시그마j : 각종목의 위험");
        this.dsCutRateColumn_A.push("i : 종목 랭킹");


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
    AddFlow_Click(){

        this.inputBoxTitle = "Add Flow Box";
        this.inputBoxType = InputType.AddBox;

        this.TextBoxValue = '';
        this.popupVisible_TextBox = true;

        // this.popupVisible = true;
        // this.txtTitle.nativeElement.value = '';
        
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
        $('#canvas_container2').toggleClass('fullscreen'); 

        this.yesFullScreen = !this.yesFullScreen;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    BottomDivInit(){
        this.ngAfterViewInit();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    OK_Click(aTitle : string){
    
        if (this.inputBoxType === InputType.NewFlow)
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
        else if (this.inputBoxType === InputType.AddBox)
        {
            let flowBox = new FlowBox();
            
            flowBox.x = 10;
            flowBox.y = 10;
            flowBox.Title = aTitle;
    
            this.finCanvas.AddObject(flowBox);            
        }
        else if (this.inputBoxType === InputType.CopyFlow)
        {
            this.copyFlowTitle = aTitle;
            this.loadingVisible = true;
        
            this.CopyFlow().subscribe(
                data => {
                    this.title = this.NewTitle;
                    this.id = this.NewID;
                    this.loadingVisible = false;
                }, 
                error => {
                    this.loadingVisible = false;
                    alert("Error");
                });
        }
        else if ( this.inputBoxType === InputType.SetTitle){
            this.finCanvas.GetCurrentBox().Title = this.txtTitle.nativeElement.value;
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
        let sel2 = this.dsFlowList.find(i=> i["title"] === this.title );

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

        // if (this.finCanvas.objects.length == 0) return;

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

        this.NewTitle = this.copyFlowTitle;
        this.NewID = UUID.UUID();

        let body = JSON.stringify({
            title : this.NewTitle,
            id : this.NewID,
            flowobject : JSON.stringify(this.finCanvas.objects)
        });

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/SaveFlow?code=ZcN2ZGHPkpqy6EVxPUaMfx6goOAhbNGahobgkGsYDQBaL0Kd801lBA==";
        return this.service.CallService(url, body)

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Run_Click(){


        this.loadingVisible = true;

        for (var f of this.finCanvas.objects.filter( i=> i instanceof FlowBox))
        {
            (<FlowBox>f).RunStatus = false;
            (<FlowBox>f).ErrorMessage = '';
            (<FlowBox>f).RunEnd = false;
        }

        this.finCanvas.Draw();

        console.log('run start');

        this.finCanvas.RunStatusClear();
        this.finCanvas.Draw();
        
        // await this.service.RunProc(this.finCanvas.objects);
        await this.RunProc(this.finCanvas.objects);

        this.loadingVisible = false;
        console.log('run end');

        this.finCanvas.Draw();

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async RunProc( Objects : BaseObject[] )  {
        
        
        let runFlow : FlowBox;

        try
        {
            let obj  = <FlowBox[]>Objects.filter(i=> i instanceof FlowBox);
            
            console.log('RunProc Start');
    
            let obj2 = obj.sort((n1,n2) => n1.Seq - n2.Seq);
    
            let prop;

            for (let f of obj2  )
            {
                runFlow = f;

                prop = f.GetProperty();
    
                if (prop === '') return;
    
                console.log("seq : " + f.Seq + ` (${f.Title})`);
                // console.log(prop);
                // console.log(this.previousResult);
    
                this.service.SetPreviousResult(Objects, f.Id);
                this.service.SetPreviousResultJson(Objects, f.Id);
    
                if(prop.UseExistData === false || f.ResultDataJsonString === '' )
                {
                    f.RunStatus = true;
                    f.RunEnd = false;
                    await this.finCanvas.Draw();

                    switch(prop.Type)
                    {
                        case "DataSet":{
                            
                            console.log('run dataset');
                            await this.service.Run_DataSet(f);
                            break; 
                        }
        
                        case "Calculation":{
                            await this.service.Run_Calculation(f);
                            break;
                        }
                    }

                    f.RunOK = true;
                    f.RunEnd = true;
                    f.ErrorMessage = '';
                    await this.finCanvas.Draw();

                }
                else
                {
                    console.log("Use Exist data, No Run");
                }
                
               

            }//end for

            console.log('RunProc End');
        }
        catch(e)
        {
            runFlow.RunEnd = true;
            runFlow.RunOK = false;
            runFlow.ErrorMessage = (<Error>e).message;

            // alert('error');
            // console.log('RunProc Error');
            // console.log((<Error>e).message);
        }

        await this.finCanvas.Draw();

        
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

        if (flowProperty.Type === "Calculation")
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
            flowProperty.DenominatorColumn = this.denominatorColumn;
            flowProperty.CalKeyColumn = this.calKeyColumn;

        }
        else
        {
            flowProperty.MyData = this.dsMyDataSource;
            flowProperty.DataSetType = this.DataSetType;
        }

        flowProperty["propCutRateAColumnInfo"] = this.propCutRateAColumnInfo;

        (<FlowBox>this.finCanvas.GetCurrentBox()).MyProperty = JSON.stringify(flowProperty);

        this.popupVisible_BoxProperty = false;

        // console.log(flowProperty);

        this.finCanvas.Draw();


    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnProperty_Click(){

        if (this.finCanvas.GetCurrentBox() === null) 
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
        this.calKeyColumn = '';

        this.popupVisible_BoxProperty = true;

        let prop = (<FlowBox>this.finCanvas.GetCurrentBox()).MyProperty;

        if (prop != "")
        {
            let propObj = JSON.parse(prop);
            
            this.BoxPropertyType = propObj.Type;
            this.dsMyDataSource = propObj.MyData;
            this.DataSetType = propObj.DataSetType;
            this.UseExistData = propObj.UseExistData;

            this.propCutRateAColumnInfo = propObj["propCutRateAColumnInfo"];
            
            if (this.propCutRateAColumnInfo === undefined) this.propCutRateAColumnInfo = {};

            this.resultColumnName = propObj.ResultColumnName;

            this.targetDataSource = propObj.TargetDataSource;

            if (this.targetDataSource != undefined && this.targetDataSource != '')
                this.targetDataSourceName =  this.previousBox.find(i=>i.ID === this.targetDataSource).Title ;

            this.targetTable = propObj.TargetTable;
            this.targetColumn = propObj.TargetColumn;

            this.numeratorColumn = propObj.NumeratorColumn;
            this.denominatorColumn = propObj.DenominatorColumn;

            this.calKeyColumn = propObj.CalKeyColumn;

            if (this.BoxPropertyType === "Calculation"){
                
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
        // console.log(JSON.stringify(re));

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

        
        this.targetDataSource =  this.previousBox.find(i=>i.Title === this.cboTargetSource.selectedItem).ID ;
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

        this.propCutRateAColumnInfo = flowbox.GetProperty()["propCutRateAColumnInfo"];
        this.SetCurRateAColumnInfoString();

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
                // this.AddFlow();
               break;
           }
           case "Run":{
               this.Run_Click();
               break;
           }
           case "Set All Object Do not use UseExistData":{
                this.SetAllObjectUseexistData(false)
                break;
           }
           case "Set All Object use UseExistData":{
                this.SetAllObjectUseexistData(true)
                break;
           }
           case 'Clear Run Status':{
               for ( var obj of this.finCanvas.objects.filter(i => i instanceof FlowBox))
               {
                    (<FlowBox>obj).RunStatus = false;
               }
               this.finCanvas.Draw();

               break;

           }
           case 'Full Screen':{

               this.FullScreen();
               break;
           }
       }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetAllObjectUseexistData( arg:boolean)
    {
        for ( var i of  this.finCanvas.objects.filter(i=>i instanceof FlowBox))
        {
            var prop = (<FlowBox>i).GetProperty();
            prop["UseExistData"] = arg;
            (<FlowBox>i).MyProperty = JSON.stringify(prop);
            // console.log(prop);
        }

        this.finCanvas.Draw();
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
            case "Set Title":{
                this.SetBoxTitle();             
                break;
            }
            case "Error":{
                console.log(this.finCanvas.GetCurrentBox().ErrorMessage);
                break;
            }
           
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetBoxTitle(){
        this.inputBoxType = InputType.SetTitle;
        this.inputBoxTitle = "Set Title";
        // this.popupVisible = true;
        this.TextBoxValue = this.finCanvas.GetCurrentBox().Title;
        this.popupVisible_TextBox = true;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    cboTargetSource_Change(){

        this.dsTargetTable = new Array();
        this.dsTargetColumn = new Array();


        console.log(this.cboTargetSource.selectedItem);

        let id = this.previousBox.find(i=> i.Title === this.cboTargetSource.selectedItem ).ID;

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

        let id = this.previousBox.find(i=> i.Title === this.cboTargetSource.selectedItem ).ID;

        let obj = JSON.parse( this.inputData[id])[this.cboTargetTable.selectedItem];

        console.log(obj);

        for ( var k in obj[0])
        {
            this.dsTargetColumn.push(k);
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    InputPopup_OnShown(){
        // if (this.inputBoxType == InputType.CopyFlow )
        // {
        //     this.txtTitle.nativeElement.value = this.title;
        // }
        // else if(this.inputBoxType == InputType.SetTitle)
        // {
        //     this.txtTitle.nativeElement.value = this.finCanvas.GetCurrentBox().Title;
        // }
        // else
        // {
        //     
        // }

        this.txtTitle.nativeElement.value = "";

        switch(this.inputBoxType)
        {
            case InputType.CopyFlow:{
                this.txtTitle.nativeElement.value = this.title;
                break;
            }
            case InputType.SetTitle:{
                this.txtTitle.nativeElement.value = this.finCanvas.GetCurrentBox().Title;
                break;
            }
            
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

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetKeyColumn_Click(){
        this.calKeyColumn = this.cboTargetColumn.selectedItem;
    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Test_Click(){
        this.popupVisible_TextBox = true;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    TextBox_Cancel_Click(){

        this.popupVisible_TextBox = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    TextBox_OK_Click(){

        this.popupVisible_TextBox = false;

        if (this.inputBoxType === InputType.AddBox)
        {
            let flowBox = new FlowBox();
            
            flowBox.x = 10;
            flowBox.y = 10;
            flowBox.Title = this.TextBoxValue;
    
            this.finCanvas.AddObject(flowBox);

            this.finCanvas.Draw();
        }
        else if ( this.inputBoxType === InputType.SetTitle){

            this.finCanvas.GetCurrentBox().Title = this.TextBoxValue;
            console.log(this.TextBoxValue);

            this.finCanvas.Draw();
        }
    }
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnCutRateAColumnSet_Click(){

        switch(this.cboCutRateAColumn.selectedItem){
            case "초과수익률":{
                this.propCutRateAColumnInfo["Over_TargetSource"] = this.previousBox.find(i=>i.Title === this.cboTargetSource.selectedItem ).ID ;
                this.propCutRateAColumnInfo["Over_TargetTable"] = this.cboTargetTable.selectedItem;
                this.propCutRateAColumnInfo["Over_TargetColumn"] = this.cboTargetColumn.selectedItem;
                break;
            }
            case "베타j : 각종목의 베타":{
                this.propCutRateAColumnInfo["Beta_TargetSource"] = this.previousBox.find(i=>i.Title === this.cboTargetSource.selectedItem ).ID;
                this.propCutRateAColumnInfo["Beta_TargetTable"] = this.cboTargetTable.selectedItem;
                this.propCutRateAColumnInfo["Beta_TargetColumn"] = this.cboTargetColumn.selectedItem;
                break;
            }
            case "시그마j : 각종목의 위험":{
                this.propCutRateAColumnInfo["Sigma_TargetSource"] = this.previousBox.find(i=>i.Title === this.cboTargetSource.selectedItem ).ID;
                this.propCutRateAColumnInfo["Sigma_TargetTable"] = this.cboTargetTable.selectedItem;
                this.propCutRateAColumnInfo["Sigma_TargetColumn"] = this.cboTargetColumn.selectedItem;
                break;
            }
            case "i : 종목 랭킹":{
                this.propCutRateAColumnInfo["Rank_TargetSource"] = this.previousBox.find(i=>i.Title === this.cboTargetSource.selectedItem ).ID;
                this.propCutRateAColumnInfo["Rank_TargetTable"] = this.cboTargetTable.selectedItem;
                this.propCutRateAColumnInfo["Rank_TargetColumn"] = this.cboTargetColumn.selectedItem;
                break;
            }
        }

        this.SetCurRateAColumnInfoString();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetCurRateAColumnInfoString(){

        try{

            let SetCurRateColumnInfoString = "" ;
            let over_source = "";
            let over_column = "";
            let beta_source = "";
            let beta_column = ""
            let sigma_source = "";
            let sigma_column = "";
            let rank_source = "";
            let rank_column = "";

            if (this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Over_TargetSource"]) != null)
            {
                over_source = this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Over_TargetSource"])["Title"];
                over_column = this.propCutRateAColumnInfo["Over_TargetColumn"];
            }
    
            if ( this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Beta_TargetSource"]) != null)
            {
                beta_source=this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Beta_TargetSource"])["Title"];
                beta_column = this.propCutRateAColumnInfo["Beta_TargetColumn"];
            }
            
            if (this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Sigma_TargetSource"]) != null)
            {
                sigma_source=this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Sigma_TargetSource"])["Title"];
                sigma_column = this.propCutRateAColumnInfo["Sigma_TargetColumn"];
            }

            if ( this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Rank_TargetSource"]) != null)
            {
                rank_source=this.previousBox.find(i=>i.ID === this.propCutRateAColumnInfo["Rank_TargetSource"])["Title"];
                rank_column = this.propCutRateAColumnInfo["Rank_TargetColumn"];
            }
    
            SetCurRateColumnInfoString += `초과수익률 - ${over_source} - ${over_column} \n` ;
            SetCurRateColumnInfoString += `베타j : 각종목의 베타 - ${beta_source} - ${beta_column} \n` ;
            SetCurRateColumnInfoString += `시그마j : 각종목의 위험 - ${sigma_source} - ${sigma_column} \n` ;
            SetCurRateColumnInfoString += `i : 종목 랭킹 - ${rank_source} - ${rank_column} \n` ;
    
            this.strColumnInfo = SetCurRateColumnInfoString;
            console.log(this.propCutRateAColumnInfo);

        }
        catch(Error){
            console.log(Error);
        }
        

    }
    
    
   

    
}//class
//############################################################################################################################################################################################################################################################


@Directive({
    selector:'[ngInit]'
})
export class NgInit implements OnInit {
    @Input() ngInit;

    ngOnInit(){
        if ( this.ngInit) this.ngInit();
    }
}
