import { Component,ViewChild, OnInit, ViewEncapsulation, AfterViewInit, Inject } from "@angular/core";
import { DrawCanvasComponent } from "../../core/material/drawcanvas/drawcanvas.component";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { UUID }                from "angular2-uuid";
import { FlowTest2Service } from "./flowtest02.service";
import { DxDataGridComponent } from "devextreme-angular";
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
    customers: Customer[];
    title : string = '';
    id : string = '';
    popupVisible = false;
    @ViewChild('txtTitle') txtTitle : any;
    loadingVisible = false;
    popupVisible_FlowList = false;

    @ViewChild('grdFlowList') grdFlowList : DxDataGridComponent;
    @ViewChild('grdDataSource') grdDataSource : DxDataGridComponent;

    dsMyDataSource = new Array();

    dsFlowList : any[];

    dsFlowList2:string;

    inputBoxTitle:string='Input Box';
    inputBoxType : InputType = InputType.None;

    popupVisible_BoxProperty = false;

    popupVisible_popupStepper = false;

    dsDataSource : any[];
    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    @ViewChild("fcvs") finCanvas : DrawCanvasComponent;

    constructor(  private service : FlowTest2Service , private http : Http ){
        this.SetData();
    }

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
    OpenFlow(){

        this.service.CallService("https://insalwaysfuncapp01.azurewebsites.net/api/GetFlowList?code=ZynursoTea6fTDXGX4aTTX24Iayme/yZx6p/HgHllLUoWzh6K6Qb1Q==")
        .subscribe(
            data =>
            {
                this.dsFlowList = data;
            },
            error =>
            {
                alert('error');
            }
        );

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
    SetData(){
        
        this.customers = [{
            "ID": 1,
            "CompanyName": "Super Mart of the West",
            "Address": "702 SW 8th Street",
            "City": "Bentonville",
            "State": "Arkansas",
            "Zipcode": 72716,
            "Phone": "(800) 555-2797",
            "Fax": "(800) 555-2171",
            "Website": "http://www.nowebsitesupermart.com"
        }, {
            "ID": 2,
            "CompanyName": "Electronics Depot",
            "Address": "2455 Paces Ferry Road NW",
            "City": "Atlanta",
            "State": "Georgia",
            "Zipcode": 30339,
            "Phone": "(800) 595-3232",
            "Fax": "(800) 595-3231",
            "Website": "http://www.nowebsitedepot.com"
        }, {
            "ID": 3,
            "CompanyName": "K&S Music",
            "Address": "1000 Nicllet Mall",
            "City": "Minneapolis",
            "State": "Minnesota",
            "Zipcode": 55403,
            "Phone": "(612) 304-6073",
            "Fax": "(612) 304-6074",
            "Website": "http://www.nowebsitemusic.com"
        }, {
            "ID": 4,
            "CompanyName": "Tom's Club",
            "Address": "999 Lake Drive",
            "City": "Issaquah",
            "State": "Washington",
            "Zipcode": 98027,
            "Phone": "(800) 955-2292",
            "Fax": "(800) 955-2293",
            "Website": "http://www.nowebsitetomsclub.com"
        }, {
            "ID": 5,
            "CompanyName": "E-Mart",
            "Address": "3333 Beverly Rd",
            "City": "Hoffman Estates",
            "State": "Illinois",
            "Zipcode": 60179,
            "Phone": "(847) 286-2500",
            "Fax": "(847) 286-2501",
            "Website": "http://www.nowebsiteemart.com"
        }, {
            "ID": 6,
            "CompanyName": "Walters",
            "Address": "200 Wilmot Rd",
            "City": "Deerfield",
            "State": "Illinois",
            "Zipcode": 60015,
            "Phone": "(847) 940-2500",
            "Fax": "(847) 940-2501",
            "Website": "http://www.nowebsitewalters.com"
        }, {
            "ID": 7,
            "CompanyName": "StereoShack",
            "Address": "400 Commerce S",
            "City": "Fort Worth",
            "State": "Texas",
            "Zipcode": 76102,
            "Phone": "(817) 820-0741",
            "Fax": "(817) 820-0742",
            "Website": "http://www.nowebsiteshack.com"
        }, {
            "ID": 8,
            "CompanyName": "Circuit Town",
            "Address": "2200 Kensington Court",
            "City": "Oak Brook",
            "State": "Illinois",
            "Zipcode": 60523,
            "Phone": "(800) 955-2929",
            "Fax": "(800) 955-9392",
            "Website": "http://www.nowebsitecircuittown.com"
        }, {
            "ID": 9,
            "CompanyName": "Premier Buy",
            "Address": "7601 Penn Avenue South",
            "City": "Richfield",
            "State": "Minnesota",
            "Zipcode": 55423,
            "Phone": "(612) 291-1000",
            "Fax": "(612) 291-2001",
            "Website": "http://www.nowebsitepremierbuy.com"
        }, {
            "ID": 10,
            "CompanyName": "ElectrixMax",
            "Address": "263 Shuman Blvd",
            "City": "Naperville",
            "State": "Illinois",
            "Zipcode": 60563,
            "Phone": "(630) 438-7800",
            "Fax": "(630) 438-7801",
            "Website": "http://www.nowebsiteelectrixmax.com"
        }, {
            "ID": 11,
            "CompanyName": "Video Emporium",
            "Address": "1201 Elm Street",
            "City": "Dallas",
            "State": "Texas",
            "Zipcode": 75270,
            "Phone": "(214) 854-3000",
            "Fax": "(214) 854-3001",
            "Website": "http://www.nowebsitevideoemporium.com"
        }, {
            "ID": 12,
            "CompanyName": "Screen Shop",
            "Address": "1000 Lowes Blvd",
            "City": "Mooresville",
            "State": "North Carolina",
            "Zipcode": 28117,
            "Phone": "(800) 445-6937",
            "Fax": "(800) 445-6938",
            "Website": "http://www.nowebsitescreenshop.com"
        }];
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
                    console.log(error);
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
    Open_Click(){

        let sel = this.grdFlowList.instance.getSelectedRowKeys();

        this.title = sel[0]["title"];
        let sel2 = this.dsFlowList.find(i=> i["title"] == this.title );
        let objString = sel2["drawobject"];
        this.id = sel2["id"];

        console.log("title:" + this.title);
        console.log("id:" + this.id);

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
    Run_Click(){

        let obj  = <BoxBase[]>this.finCanvas.objects.filter(i=> i instanceof BoxBase);

        this.finCanvas.RunStatusClear();
        
        for ( var  i= 1 ; i <= obj.length ; i++)
        {
            obj.filter(k=> (<BoxBase>k).Seq == i ).forEach(k=>
                {
                    k.RunStatus = true;
                    k.RunOK = true;
                    k.RunSeq = i;
                    
                });
        }

        this.finCanvas.Draw();

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
        
        if (obj instanceof FlowBox){
            let flowBox = <FlowBox>obj;
            $('#summernote').summernote('code',flowBox.document);
        }
        else{
            $('#summernote').summernote('code','');
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    BoxProperty_Cancel_Click(){
        this.popupVisible_BoxProperty = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    BoxProperty_OK_Click(){
        this.popupVisible_BoxProperty = false;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    btnProperty_Click(){
        this.popupVisible_BoxProperty = true;
        // this.popupVisible_popupStepper = true;
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
    SearchDataSource(){

        /**
         * 주식 리스트 조회
         */

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/GetStockItemList?code=3tHzRH4nf9nBnmgEVnm0qclWox9M8ayzScvzRPXk5vtAaMksHdJSBg==";

        this.dsDataSource = [];

        this.service.CallService(url).subscribe(
            data=>{
                this.dsDataSource = data;
            },
            error =>
            {

            }
        );


    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    AddMyDataSource(){
        let sel = this.grdDataSource.instance.getSelectedRowKeys();

        let d : any = {};

        d.ItemCode = sel[0]["ItemCode"];
        d.ItemName = sel[0]["ItemName"];

        
        this.dsMyDataSource.push(d);

        console.log(this.dsMyDataSource);

        
    }
    
}//class
//############################################################################################################################################################################################################################################################

export class Customer {
    ID: number;
    CompanyName: string;
    Address: string;
    City: string;
    State: string;
    Zipcode: number;
    Phone: string;
    Fax: string;
    Website: string;
}//class customer


