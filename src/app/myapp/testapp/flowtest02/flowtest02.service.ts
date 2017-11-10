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

        let obj  = <FlowBox[]>Objects.filter(i=> i instanceof FlowBox);
    
        console.log('RunProc Start');

        let obj2 = obj.sort(i=>i.Seq);

        let prop;
        for (let f of obj2)
        {
            prop = f.GetProperty();

            console.log(prop);

            switch(prop.Type)
            {
                case "DataSet":{
                    if(prop.UseExistData == false || f.ResultDataJsonString == '' )
                    {
                        await this.Run_DataSet(f);
                    }
                    else
                    {
                        console.log('no run');
                        console.log(f.ResultDataJsonString);
                    }
                    
                    break; 
                }
            }
        }

        console.log('RunProc End');
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    async Run_DataSet(flow : FlowBox)  {
        
        let re;

        switch(flow.GetProperty().DataSetType)
        {
            case "Stock":{

                let url = "https://insallwayspythonfunctionapp.azurewebsites.net/api/GetStockListPrice?code=ohJFAuVFYt8GIEivr3S6Nmj5lPPaCzboKQebcZcnxfc6jgwIgUHbrQ==";
                let itemlist = new Array();

                flow.GetProperty().MyData.forEach(i => {
                    itemlist.push(i.ItemCode);
                });

                console.log('Run_DataSet Start');

                console.log(JSON.stringify(itemlist));

                re = await this.CallServiceAwait(url,JSON.stringify(itemlist) );

                flow.ResultDataJsonString = JSON.stringify(re);

                console.log(re);

                // console.log(flow.ResultDataJsonString);

                console.log('Run_DataSet End');
                
                break;
            }
        }

    }
        

}//class