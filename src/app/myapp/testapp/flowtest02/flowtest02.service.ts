import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";

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
        return this.http.post(url, body, options).map(res=>res.json());
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    RunProc( Objects : BaseObject[] ){

        let obj  = <FlowBox[]>Objects.filter(i=> i instanceof FlowBox);
        
        for ( var  i= 0 ; i <= obj.length ; i++)
        {
            obj.filter(k=> (<FlowBox>k).Seq == i ).forEach(k=>
                {
                    if ( k.GetProperty().Type == "DataSet")
                    {
                        console.log(k.GetProperty().Type)
                    }
                });
        }
    }
        

}//class