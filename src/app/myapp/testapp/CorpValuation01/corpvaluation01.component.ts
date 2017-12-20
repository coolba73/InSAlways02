import { Component , ViewChild } from "@angular/core";
import { PuItemListComponent } from "../../popup/puitemlist/puitemlist.component";

import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { UUID }                from "angular2-uuid";
import { DrawCanvasComponent } from "../../core/material/drawcanvas/drawcanvas.component";
import { FlowTest2Service } from "app/myapp/testapp/flowtest02/flowtest02.service";


@Component({
    selector : 'corpvaluation01',
    templateUrl : './corpvaluation01.component.html',
    styleUrls : ['./corpvaluation01.component.css'],
    providers:[FlowTest2Service]
})

export class CorpValuation01Component{

    @ViewChild('popupItemlist') popupItemlist : PuItemListComponent;
    @ViewChild('fcvs') cvs : DrawCanvasComponent;
    

    ItemName = "";
    ItemCode = "";
    Display = "";

    DCF_WACC : number = 0.065;
    DCF_PGR : number = 0.0275; //영구성장률

    ViewLoadPanel = false;

    ResultOK = false;

    dsflowResult : any[] = [];

    ReturnValue : any;

    ChartDs : any[] = [];

    ChartSeries : any[] = [];


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(private service : FlowTest2Service){

    }

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

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async CalDCF()
    {
        this.ViewLoadPanel = true;
        this.ResultOK = false;

        //----------------------------
        // Service Call
        //----------------------------
        let para = {};

        // para["ItemCode"] = "004000" ;
        para["ItemCode"] = this.ItemCode ;
        para["ValuationModel"] = "DCF";
        para["WACC"] = this.DCF_WACC;
        para["PGR"] = this.DCF_PGR;

        // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
        let url = "http://localhost:7071/api/CalCorpValuation";
        
        this.ReturnValue = await this.service.CallServiceAwait(url,JSON.stringify(para));

        console.log(this.ReturnValue);

        this.ResultOK = true;
        this.ViewLoadPanel = false;


        //----------------------------
        // Add Flow
        //----------------------------
        let list : [string,string][] = [];

        list.push(["매출 계산","1"]);
        list.push(["매출원가 계산","1"]);
        list.push(["판관비 계산","1"]);
        list.push(["감상비 계산","1"]);
        list.push(["운전자본 계산","1"]);
        list.push(["기업가치 계산","1"]);

        this.DrawFlow(list);

        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    DrawFlow(list:[string,string][]){

        let flow : FlowBox;
        let preFlow : FlowBox;
        let cnt : number = 0;
        let xstep = 150;
        let line : LineBase;

        for(let i of list)
        {
            cnt++;

            flow = new FlowBox();
            flow.y = 50;
            flow.x = 20 + xstep * (cnt-1);
            flow.Title = i[0];
            this.cvs.AddObject(flow);

            if (cnt > 1)
            {
                line = new LineBase();

                line.Box_1_ID = preFlow.Id;
                line.Box_2_ID = flow.Id;
                line.Box_1_PointIndex = 3;
                line.Box_2_PointIndex = 1;
                line.YesDrawEndArrow = true;
                line.SetBoxPoint(preFlow,1);
                line.SetBoxPoint(flow,2);
                this.cvs.AddObject(line);
            }

            preFlow = flow;
        }

        this.cvs.SetSeq();
        this.cvs.Draw();
        

    }


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    DrawFlow_Old(){
        // var flow = new FlowBox();
        // var preFlow;

        // flow.x = 10;
        // flow.y = 10;
        // flow.Title = "test01";

        // this.cvs.AddObject(flow);

        // preFlow = flow;
        // flow = new FlowBox();
        // flow.x = 200;
        // flow.y = 10;
        // flow.Title = "test02";

        // this.cvs.AddObject(flow);

        // var line = new LineBase();

        // line.Box_1_ID = preFlow.Id;
        // line.Box_2_ID = flow.Id;
        // line.Box_1_PointIndex = 3;
        // line.Box_2_PointIndex = 1;
        // line.YesDrawEndArrow = true;
        // line.SetBoxPoint(preFlow,1);
        // line.SetBoxPoint(flow,2);

        // this.cvs.AddObject(line);
        // this.cvs.SetSeq();
        // this.cvs.Draw();
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_MouseUp(){


        this.MakeChart2();

        let box = <FlowBox>this.cvs.GetCurrentBox();

        this.dsflowResult = [];

        if (box === null) return;

        switch(box.Title)
        {
            case "매출 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jsales"]);
                break;
            }
            case "매출원가 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jCogs"]);
                break;
            }
            case "판관비 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jSellingExp"]);
                break;
            }
            case "감상비 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jDepCap"]);
                break;
            }
            case "운전자본 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jWorkingCap"]);
                break;
            }
            case "영구가치 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jDCF"]);
                break;
            }
            case "기업가치 계산" : {
                this.dsflowResult = this.ToArray(this.ReturnValue["jDCF"]);
                break;
            }

            default:{
                this.dsflowResult = [];
                break;
            }
        }

        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    ToArray(src){
        let arry = [];
        let irow = {};

        for ( var k in src)
        {
            irow[k] = src[k];
        }
        arry.push(irow);
        return arry;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    MakeChart2(){
        
        let obj = this.cvs.GetSelectedBoxes();


        let dsRe = [];
        let item = {};
        let valuecnt = 0;
        let sourcename = "";
        let src :any[];
        this.ChartSeries = [];
        let iseries = {};
        this.ChartDs = [];

        for ( let i=2014; i<= 2019 ; i++)
        {
            item = {};
            item["year"] = i.toString();

            valuecnt=0;

            for(let ibox of obj)
            {
                
                switch(ibox.Title)
                {
                    case"매출 계산":{ src = this.ReturnValue["jsales"] ;  break;}
                    case"매출원가 계산":{ src = this.ReturnValue["jCogs"] ;  break;}
                    case"판관비 계산":{ src = this.ReturnValue["jSellingExp"] ;  break;}
                    case"감상비 계산":{ src = this.ReturnValue["jDepCap"] ;  break;}
                    case"운전자본 계산":{ src = this.ReturnValue["jWorkingCap"] ;  break;}
                    default:{src = []; break;}
                }

                valuecnt++;
                item["value" + valuecnt] = src[i.toString()] ;
                
                if (i===2014){
                    iseries = {};
                    iseries["field"] = "value"+ valuecnt;
                    iseries["name"] = ibox.Title;
                    this.ChartSeries.push(iseries);
                }
                    

            }

            dsRe.push(item);
        }


        console.log(dsRe);

        this.ChartDs = dsRe;
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    MakeChartDs(src, name){


        //----------------------------
        // Set data
        //----------------------------
        let dsRe = [];
        let item = {};

        for ( let i=2014; i<= 2019 ; i++)
        {
            item = {};
            item["year"] = i.toString();
            item["value"] = src[i.toString()] ;
            dsRe.push(item);
        }

        //----------------------------
        // set series
        //----------------------------
        this.ChartSeries = [];
        let iseries = {};

        iseries["field"] = "value";
        iseries["name"] = name;
        this.ChartSeries.push(iseries);


        return dsRe;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    MakeChartDs_Test(src){

        let dsRe = [];
        let item = {}
        let year = 2016 - 2

        item = {}
        item["year"] = year;
        item["value1"] = 10;
        item["value2"] = 20;
        dsRe.push(item);

        item = {}
        item["year"] = year++;
        item["value1"] = 10;
        item["value2"] = 20;
        dsRe.push(item);

        item = {}
        item["year"] = year++;
        item["value1"] = 10;
        item["value2"] = 20;
        dsRe.push(item);

        item = {}
        item["year"] = year++;
        item["value1"] = 10;
        item["value2"] = 20;
        dsRe.push(item);

        item = {}
        item["year"] = year++;
        item["value1"] = 10;
        item["value2"] = 20;
        dsRe.push(item);

        console.log(dsRe);



        this.ChartSeries = [];
        let iseries = {};

        iseries["field"] = "value1";
        iseries["name"] = "값1";
        this.ChartSeries.push(iseries);

        iseries = {};
        iseries["field"] = "value2";
        iseries["name"] = "값2";
        this.ChartSeries.push(iseries);


        return dsRe;
    }


    


}//class