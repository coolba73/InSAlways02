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

    APV_BETA : number = 0.85; //기업베타
    APV_DBRT : number = 1.1894;//부채비율
    APV_TAXRT : number = 0.242;//한계 법인세율
    APV_INTRT : number = 0.017;//무위험 이자율
    APV_MKTPM : number = 0.06;//마켓프리미엄
    APV_PGR : number = 0.0275;//영구성장률

    rim_Dividend_payout_ratio   : number = 0.2521;//배당성향 0.2521
    rim_Net_profit_growth_rate  : number = 0.03  ;//순이익성장률 0.03
    rim_Risk_free_interest_rate : number = 0.028 ;//무위험이자율 0.028
    rim_Market_risk_premium     : number = 0.03  ;//시장위험프리미엄 0.03

    ViewLoadPanel = false;

    ResultOK = false;

    dsflowResult : any[] = [];

    ReturnValue : any;

    ChartDs : any[] = [];

    ChartSeries : any[] = [];

    CalType = '';


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

        try{

            this.CalType = "DCF";

            this.cvs.objects = [];
            this.cvs.Draw();
            this.ChartDs = [];
            this.dsflowResult = [];            
        
            this.ViewLoadPanel = true;
            this.ResultOK = false;
    
            //----------------------------
            // Service Call
            //----------------------------
            let para = {};
    
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "APV";

            para["WACC"] = this.DCF_WACC;
            para["PGR"] = this.DCF_PGR;

            para["APV_BETA"] = this.APV_BETA ; //기업베타
            para["APV_DBRT"] = this.APV_DBRT ; //부채비율  
            para["APV_TAXRT"] = this.APV_TAXRT; //한계 법인세율
            para["APV_INTRT"] = this.APV_INTRT; //무위험 이자율
            para["APV_MKTPM"] = this.APV_MKTPM;//마켓프리미엄
            para["APV_PGR"] = this.APV_PGR  ; //영구성장률

    
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
            let url = "http://localhost:7071/api/CalCorpValuation";
            
    
            console.log(para);
    
            this.ReturnValue = {};
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
        catch(e){
            alert(e);
        }

        this.ViewLoadPanel = false;
        

        
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

        if (this.CalType == "RIM")
        {
            this.RIM_SetGridData();
            this.RIM_MakeChart();
            return;
        }

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
                if (this.CalType = "DCF")
                    this.dsflowResult = this.ToArray(this.ReturnValue["jDCF"]);
                else if (this.CalType = "APV")                    
                    this.dsflowResult = this.ToArray(this.ReturnValue["APV"]);

                break;
            }
            case "기업가치 계산" : {
                if (this.CalType === "DCF")
                    this.dsflowResult = this.ToArray(this.ReturnValue["jDCF"]);
                else if (this.CalType === "APV")
                    this.dsflowResult = this.ToArray(this.ReturnValue["APV"]);

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


    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnDCFExcelDown_Click()
    {

        try{

            this.ViewLoadPanel = true;

            let para = {};
    
            // para["ItemCode"] = "004000" ;
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "DCF_Excel";
            para["WACC"] = this.DCF_WACC;
            para["PGR"] = this.DCF_PGR;

            if (this.ReturnValue != undefined)
                para["CalRe"] = this.ReturnValue;

            console.log(para);

            let url = "http://localhost:7071/api/CalCorpValuation";
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";

            var re = await this.service.CallServiceAwait(url,JSON.stringify(para));

            console.log(re);

            window.location.href = re["uri"];

            // window.location.href = "https://colly.blob.core.windows.net/valuationexcel/%EB%A1%AF%EB%8D%B0%EC%A0%95%EB%B0%80%ED%99%94%ED%95%99_DCF.xlsx";
            //window.location.href = "https://colly.blob.core.windows.net/valuationexcel/롯데정밀화학_DCF.xlsx";


        }
        catch(e){
            alert(e);
        }

        this.ViewLoadPanel = false; 

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnAPVCal_Click(){


        try{

            this.CalType = "APV";

            //----------------------------
            // init
            //----------------------------
            this.cvs.objects = [];
            this.cvs.Draw();
            this.ChartDs = [];
            this.dsflowResult = [];   
            this.ViewLoadPanel = true;

            //----------------------------
            // Call Service
            //----------------------------
            let para = {};
    
            // para["ItemCode"] = "004000" ;
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "APV";

            para["APV_BETA" ] = this.APV_BETA  ; //기업베타
            para["APV_DBRT" ] = this.APV_DBRT  ; //부채비율
            para["APV_TAXRT"] = this.APV_TAXRT ; //한계 법인세율
            para["APV_INTRT"] = this.APV_INTRT ; //무위험 이자율
            para["APV_MKTPM"] = this.APV_MKTPM ; //마켓프리미엄
            para["APV_PGR"  ] = this.APV_PGR   ; //영구성장률

    
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
            let url = "http://localhost:7071/api/CalCorpValuation";
    
            console.log(para);
    
            this.ReturnValue = {};
            this.ReturnValue = await this.service.CallServiceAwait(url,JSON.stringify(para));
    
            console.log(this.ReturnValue);
    
            this.ResultOK = true;
            this.ViewLoadPanel = false;

            //----------------------------
            // Add Flow
            //----------------------------
            let list : [string,string][] = [];

            list.push(["매출 계산"    ,"1"]);
            list.push(["매출원가 계산","1"]);
            list.push(["판관비 계산" ,"1"]);
            list.push(["감상비 계산" ,"1"]);
            list.push(["운전자본 계산","1"]);
            list.push(["기업가치 계산","1"]);

            this.DrawFlow(list);
        }
        catch(e){
            alert(e);
        }
        
        this.ViewLoadPanel = false;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnAPVExcel_Click(){

        try{

            this.CalType = "APV";

            //----------------------------
            // init
            //----------------------------
            this.cvs.objects = [];
            this.cvs.Draw();
            this.ChartDs = [];
            this.dsflowResult = [];   
            this.ViewLoadPanel = true;

            //----------------------------
            // Call Service
            //----------------------------
            let para = {};
    
            // para["ItemCode"] = "004000" ;
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "APV_Excel";

            para["APV_BETA" ] = this.APV_BETA  ; //기업베타
            para["APV_DBRT" ] = this.APV_DBRT  ; //부채비율
            para["APV_TAXRT"] = this.APV_TAXRT ; //한계 법인세율
            para["APV_INTRT"] = this.APV_INTRT ; //무위험 이자율
            para["APV_MKTPM"] = this.APV_MKTPM ; //마켓프리미엄
            para["APV_PGR"  ] = this.APV_PGR   ; //영구성장률

    
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
            let url = "http://localhost:7071/api/CalCorpValuation";
    
            console.log(para);
    
            let re = await this.service.CallServiceAwait(url,JSON.stringify(para));

            this.ResultOK = true;
            this.ViewLoadPanel = false;

            window.location.href = re["uri"];    

           
        }
        catch(e){
            alert(e);
        }
        
        this.ViewLoadPanel = false;
    }

    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async btnRimCal_Click(){

        try{

            this.CalType = "RIM";

            //----------------------------
            // init
            //----------------------------
            this.cvs.objects = [];
            this.cvs.Draw();
            this.ChartDs = [];
            this.dsflowResult = [];   
            this.ViewLoadPanel = true;

            //----------------------------
            // Call Service
            //----------------------------
            let para = {};
    
            // para["ItemCode"] = "004000" ;
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "RIM";

            para["Dividend_payout_ratio"  ] = this.rim_Dividend_payout_ratio   ;//배당성향 0.2521
            para["Net_profit_growth_rate" ] = this.rim_Net_profit_growth_rate  ;//순이익성장률 0.03
            para["Risk_free_interest_rate"] = this.rim_Risk_free_interest_rate ;//무위험이자율 0.028
            para["Market_risk_premium"    ] = this.rim_Market_risk_premium     ;//시장위험프리미엄 0.03

    
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
            let url = "http://localhost:7071/api/CalCorpValuation";
    
            console.log(para);
    
            this.ReturnValue = {};
            this.ReturnValue = await this.service.CallServiceAwait(url,JSON.stringify(para));
    
            console.log(this.ReturnValue);
    
            this.ResultOK = true;
            this.ViewLoadPanel = false;

            //----------------------------
            // Add Flow
            //----------------------------
            let list : [string,string][] = [];

            list.push(["자기자본"   ,"1"]);
            list.push(["당기순이익" ,"1"]);
            list.push(["배당액"    ,"1"]);
            list.push(["ROE"      ,"1"]);
            list.push(["Spread"   ,"1"]);
            list.push(["RI"       ,"1"]);
            list.push(["PV RI"    ,"1"]);
            list.push(["Valuation","1"]);

            this.DrawFlow(list);
        }
        catch(e){
            alert(e);
        }
        
        this.ViewLoadPanel = false;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    RIM_SetGridData(){
        
        let box = <FlowBox>this.cvs.GetCurrentBox();

        this.dsflowResult = [];

        if (box === null) return;

        switch(box.Title)
        {
            case "자기자본":{
                this.dsflowResult = this.RIM_MakeGridDataSet("equity");
                break;
            }
            case "당기순이익":{
                this.dsflowResult = this.RIM_MakeGridDataSet("netincome");
                break;
            }
            case "배당액":{
                this.dsflowResult = this.RIM_MakeGridDataSet("dividend");
                break;
            }
            case "ROE":{
                this.dsflowResult = this.RIM_MakeGridDataSet("roe");
                break;
            }
            case "Spread":{
                this.dsflowResult = this.RIM_MakeGridDataSet("spread");
                break;
            }
            case "RI":{
                this.dsflowResult = this.RIM_MakeGridDataSet("ri");
                break;
            }
            case "PV RI":{
                this.dsflowResult = this.RIM_MakeGridDataSet("ri_discount");
                break;
            }
            case "Valuation":{
                let re = [];
                let item = {};
                
                item["Valueofequity"] = this.ReturnValue["Valueofequity"];
                item["ri_discount_sum"] = this.ReturnValue["ri_discount_sum"];

                re.push(item);

                this.dsflowResult = re;
                
                break;
            }
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    RIM_MakeGridDataSet(column : string){

        let re = [];
        let item = {};

        for ( let i  = 2016 ; i<= 2026 ; i++){
            item[i.toString()] = this.ReturnValue[i.toString() + "_" + column];
        }

        re.push(item);
        return re;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    RIM_MakeChart(){
        
        let obj = this.cvs.GetSelectedBoxes();

        let dsRe = [];
        let item = {};
        let valuecnt = 0;
        let sourcename = "";
        let src :any[];
        this.ChartSeries = [];
        let iseries = {};
        this.ChartDs = [];
        let value:any;

        for ( let i=2016; i<= 2026 ; i++)
        {
            item = {};
            item["year"] = i.toString();

            valuecnt=0;

            for(let ibox of obj)
            {
                
                switch(ibox.Title)
                {
                    case"자기자본":{ value = this.ReturnValue[i.toString()+"_equity"] ;  break;}
                    case"당기순이익":{ value = this.ReturnValue[i.toString()+"_netincome"] ;  break;}
                    case"배당액":{ value = this.ReturnValue[i.toString()+"_dividend"] ;  break;}
                    case"ROE":{ value = this.ReturnValue[i.toString()+"_roe"] ;  break;}
                    case"Spread":{ value = this.ReturnValue[i.toString()+"_spread"] ;  break;}
                    case"RI":{ value = this.ReturnValue[i.toString()+"_ri"] ;  break;}
                    case"PV RI":{ value = this.ReturnValue[i.toString()+"_ri_discount"] ;  break;}
                }

                valuecnt++;
                item["value" + valuecnt] = value ;
                
                if (i===2016){
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
    async btnRimExcel_Click(){

        try{

            this.CalType = "RIM_Excel";

            //----------------------------
            // init
            //----------------------------
            this.cvs.objects = [];
            this.cvs.Draw();
            this.ChartDs = [];
            this.dsflowResult = [];   
            this.ViewLoadPanel = true;

            //----------------------------
            // Call Service
            //----------------------------
            let para = {};
    
            // para["ItemCode"] = "004000" ;
            para["ItemCode"] = this.ItemCode ;
            para["ValuationModel"] = "RIM_Excel";

            para["Dividend_payout_ratio"  ] = this.rim_Dividend_payout_ratio   ;//배당성향 0.2521
            para["Net_profit_growth_rate" ] = this.rim_Net_profit_growth_rate  ;//순이익성장률 0.03
            para["Risk_free_interest_rate"] = this.rim_Risk_free_interest_rate ;//무위험이자율 0.028
            para["Market_risk_premium"    ] = this.rim_Market_risk_premium     ;//시장위험프리미엄 0.03

    
            // let url = "https://insalwaysfuncapp01.azurewebsites.net/api/CalCorpValuation?code=1/gOeF50B1a9zjRvjmc33RNG7Fvuxchcc2ByTfLsysJXR0jDHdyBWQ==";
            let url = "http://localhost:7071/api/CalCorpValuation";
    
            console.log(para);
    
            this.ReturnValue = {};
            let re = await this.service.CallServiceAwait(url,JSON.stringify(para));
    
            this.ResultOK = true;
            this.ViewLoadPanel = false;

            console.log(re);

            window.location.href = re["uri"];
           
        }
        catch(e){
            alert(e);
        }
        
        this.ViewLoadPanel = false;
    }
    


}//class