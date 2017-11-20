import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { promised } from "q";

@Injectable()
export class FlowTest2Service{

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(private http : Http ){}

    previousResult : any = {};
    previousResult2 : any = {};

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetFlowList() {
        let re;

        re = [
                 { id : '1' ,title:"test1"}
                ,{ id : '2' ,title:"test1"}
                ,{ id : '3' ,title:"test1"}
                ,{ id : '4' ,title:"test1"}
                ,{ id : '5' ,title:"test1"}
                ,{ id : '6' ,title:"test1"}
                ,{ id : '7' ,title:"test1"}
                ,{ id : '8' ,title:"test1"}
                ,{ id : '9' ,title:"test1"}
                ,{ id : '10' ,title:"test1"}
                ,{ id : '11' ,title:"test1"}
                ,{ id : '12' ,title:"test1"}
                ,{ id : '13' ,title:"test1"}
                ,{ id : '14' ,title:"test1"}
                ,{ id : '15' ,title:"test1"}
                ,{ id : '16' ,title:"test1"}
                ,{ id : '17' ,title:"test1"}
                ,{ id : '18' ,title:"test1"}
                ,{ id : '19' ,title:"test1"}
                ,{ id : '20' ,title:"test1"}
                ,{ id : '21' ,title:"test1"}
                ,{ id : '22' ,title:"test1"}

            ]
            

        return re ;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    CallService( url : string, body:string  = "")
    {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        console.log('pot start');
        return this.http.post(url, body, options).map(res=>res.json());
       
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async CallServiceAwait(url:string, body:string = ""){
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        // return this.http.post(url, body, options).map(res=>res.json());

        const response = await this.http.post(url, body, options).map(res=>res.json()).toPromise();

        return response;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async RunProc( Objects : BaseObject[] )  {


        try
        {
            let obj  = <FlowBox[]>Objects.filter(i=> i instanceof FlowBox);
            
            console.log('RunProc Start');
    
            let obj2 = obj.sort(i=>i.Seq);
            obj2 = obj2.reverse();
    
            let prop;
            for (let f of obj2)
            {
                prop = f.GetProperty();
    
                if (prop == '') return;
    
                console.log("seq : " + f.Seq);
                console.log(prop);
                console.log(this.previousResult);
    
                this.SetPreviousResult(Objects, f.Id);
                this.SetPreviousResultJson(Objects, f.Id);
    
                if(prop.UseExistData == false || f.ResultDataJsonString == '' ){
                    switch(prop.Type)
                    {
                        case "DataSet":{
                            
                            console.log('run dataset');
                            await this.Run_DataSet(f);
                            break; 
                        }
        
                        case "Calculation":{
                            await this.Run_Calculation(f);
                            break;
                        }
                    }
                }
                else
                {
                    console.log("Use Exist data, No Run");
                }
                
            }

            console.log('RunProc End');
        }
        catch(e)
        {
            alert('error');
            console.log('RunProc Error');
            console.log((<Error>e).message);
        }

        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Run_DataSet(flow : FlowBox)  {
        
        let re;

        switch(flow.GetProperty().DataSetType)
        {
            case "Stock":{

                let url = "https://insallwayspythonfunctionapp.azurewebsites.net/api/GetStockListPrice2?code=HzS6Upr4/OIibFB2a/e5sCVodvT1tRRyWlRtoHTsNEZsZZyVaAJ3/g==";
                let itemlist = new Array();

                flow.GetProperty().MyData.forEach(i => {
                    itemlist.push(i.ItemCode);
                });

                console.log('Run_DataSet Start');

                console.log(JSON.stringify(itemlist));

                re = await this.CallServiceAwait(url,JSON.stringify(itemlist) );

                // console.log(re);

                flow.ResultDataJsonString = JSON.stringify(re);

                // console.log(flow.ResultDataJsonString);

                console.log('Run_DataSet End');
                
                break;
            }
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Run_Calculation(flow:FlowBox){
        
        console.log('run calculation');

        let url = '';

        let prop = flow.GetProperty();

        let body:any;

        console.log("run " + prop.CalculationType);

        switch( prop.CalculationType){

            case "Log 수익률":{
                console.log('Log 수익률 Start');
                url = "https://insallwayspythonfunctionapp.azurewebsites.net/api/CalLogYield?code=6mkdavqlohaKeNXWwjthvIJDVjWI1WgjghPTgBRBEFKXSdfimY0opg==";
                body = this.previousResult;
                break;
            }

            case "베타계산":{
                console.log("베타계산")
                url = "https://insallwayspythonfunctionapp.azurewebsites.net/api/CalBeta?code=AS1qZx7/vaV8jMGDG9KXRgTGBtz0kzqGiHfWy0OQrEu8S9WgIjQ2OQ==";
                body = this.previousResult;
                break;
            }

            case"평균계산":{

                console.log("평균계산");

                let targetTable = flow.GetProperty().TargetTable;
                let targetColumn = flow.GetProperty().TargetColumn;

                console.log(targetColumn);

                let sum = 0;
                let avg = 0;

                for(var k1 in this.previousResult)
                {
                    let obj2 = JSON.parse( this.previousResult[k1]);
                    let obj3 = obj2[targetTable];

                    for (var i=0 ; i < obj3.length ; i++)
                    {
                        // console.log(obj3[i][targetColumn]); 
                        sum += obj3[i][targetColumn];
                    }

                    avg = sum / obj3.length;

                }
                
                // console.log(sum);
                // console.log(avg);

                let re = {};
                let ary = [{"average":avg}];
                re["result"] = ary;

                console.log(re);
                console.log(JSON.stringify(re));

                flow.ResultDataJsonString = JSON.stringify(re);

                break;
            }

            case "데이터빼기":
            case "데이터곱" :{

                url = "https://insallwayspythonfunctionapp.azurewebsites.net/api/CalProc?code=w5OoF/jtgHPWOqe042Alb3D4kKFe4tLsCtTJc/qnw3Su8EbzZDDoVw==";

                // console.log(this.previousResult);

                let para = {};

                if (prop.CalculationType == "데이터빼기") para["CalType"] = "Minus";
                else if (prop.CalculationType == "데이터곱") para["CalType"] = "Multiply";

                para["TargetDataSource"] = prop.TargetDataSource;
                para["TargetTable"] = prop.TargetTable;
                para["TargetColumn"] = prop.TargetColumn;
                para["ResultColumnName"] = prop.ResultColumnName;
                para["InputData"] = this.previousResult;

                console.log(para);

                console.log(JSON.stringify(para));

                body = para;

                break;
            }
            case "데이터나누기":{

                let para = {};
                url = 'https://insallwayspythonfunctionapp.azurewebsites.net/api/CalRowByRow?code=tGxoY55sNxIF4RhW0atbyYjMFgNmCRZioeniCqnxnyFPnVFG1haMAA==';

                if (prop.CalculationType == "데이터나누기") para["CalType"] = "division";

                para["CalKeyColumn"] = prop.CalKeyColumn;
                para["DenominatorColumn"] = prop.DenominatorColumn;
                para["NumeratorColumn"] = prop.NumeratorColumn;
                para["ResultColumnName"] = prop.ResultColumnName;

                para["InputData"] = this.previousResult2;

                body = para;

                break;
            }

        }//end switch

        console.log(body);
        console.log(JSON.stringify(body));

        if (url != '')
        {
            let re = await this.CallServiceAwait(url, body);
            console.log("Cal run Complete");
            flow.ResultDataJsonString = JSON.stringify(re);
        }

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async SetPreviousResult(Objects : BaseObject[], id : string){

        // console.log('GetPreviousResult start');

        this.previousResult = {};

        let lines = (<LineBase[]>Objects.filter(i=> i instanceof LineBase)).filter(i=>i.Box_2_ID == id);

        for(let line of lines){
            
            let box = <FlowBox>Objects.find(i=> i.Id == line.Box_1_ID);
            this.previousResult[box.Id] = box.ResultDataJsonString;

        }

        // console.log('previous result end')
        // console.log(this.previousResult);
        
        return this.previousResult;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async SetPreviousResultJson(Objects : BaseObject[],id : string){
        
        // console.log('GetPreviousResult start');

        this.previousResult2 = {};
        

        let lines = (<LineBase[]>Objects.filter(i=> i instanceof LineBase)).filter(i=>i.Box_2_ID == id);

        for(let line of lines){
            
            let box = <FlowBox>Objects.find(i=> i.Id == line.Box_1_ID);
            this.previousResult2[box.Id] =  JSON.parse(box.ResultDataJsonString);
        }

        // console.log('previous result end')
        // console.log(this.previousResult);
        
        return this.previousResult2;

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async OpenFlowObject (id : string)
    {

        let url = "https://insalwaysfuncapp01.azurewebsites.net/api/GetFlowObjects?code=AnQbG0imlisWYBVpp8RU0QuijtGO8139GH7sagfUtarl8yit2aaGRA==";

        let para = JSON.stringify({
            id : id
        });

        var re = await this.CallServiceAwait(url,para);

        return re;

    }
        

}//class