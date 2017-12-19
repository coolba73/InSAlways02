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
    styleUrls : ['./corpvaluation01.component.css']
})

export class CorpValuation01Component{

    @ViewChild('popupItemlist') popupItemlist : PuItemListComponent;
    @ViewChild('fcvs') cvs : DrawCanvasComponent;
    

    ItemName = "";
    ItemCode = "";
    Display = "";

    DCF_WACC : number = 0.065;
    DCF_PGR : number = 0.0275; //영구성장률

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
    CalDCF()
    {
        this.cvs.AllowMove = false;
        
        let list : [string,string][] = [];

        list.push(["매출 계산","1"]);
        list.push(["매출원가 계산","1"]);
        list.push(["판관비 계산","1"]);
        list.push(["감상비 계산","1"]);
        list.push(["운전자본 계산","1"]);
        list.push(["영구가치 계산","1"]);
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

}//class