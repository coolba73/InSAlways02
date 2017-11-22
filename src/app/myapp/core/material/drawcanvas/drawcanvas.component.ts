import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/pairWise';
import 'rxjs/add/operator/switchMap';

import { BaseObject } from "../../drawobject/BaseObject";
import { BoxBase } from "../../drawobject/BoxBase";
import { LineBase } from "../../drawobject/LineBase";
import { SelectBox } from "../../drawobject/SelectBox";
import { UUID } from "angular2-uuid";


@Component({
	selector: 'drawcanvas',
	templateUrl: 'drawcanvas.component.html',
	styleUrls: ['drawcanvas.component.css']
})
export class DrawCanvasComponent implements OnInit {


	// Variable
	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
	
    @ViewChild("myCanvas") myCanvasRef : ElementRef;
    
    @Output()
    MouseUp : EventEmitter<any> = new EventEmitter<any>();

    @Input() MyId : string;

    pre_x : number;
    pre_y : number;
    currentObj : BaseObject;

    myCanvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

    objects : BaseObject[] = [];

    message : string = '';
    xpoint : number;
    ypoint : number;

    YesMouseDown : boolean = false;

    saveobject : string;

    yesAddLine : boolean = false;

    KeyDownMessage : string = "";

    YesCanvasMouseOver : boolean = false;

    yesDrawSelectBox : boolean = false;

    selectBox : SelectBox;

    CanvasScale : number = 1;

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
	constructor() { }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
	ngOnInit() { }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
	ngAfterViewInit(){
		this.ctx = this.myCanvasRef.nativeElement.getContext("2d");
		this.myCanvas = <HTMLCanvasElement>this.myCanvasRef.nativeElement;
		this.captureEvents(this.myCanvas);
    }
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetCtx() : CanvasRenderingContext2D{
        return this.ctx;
    }

    
	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    captureEvents(canvasEl:HTMLCanvasElement){
        
        let rect = canvasEl.getBoundingClientRect();

        Observable.fromEvent(canvasEl,'mousemove').subscribe( (res:MouseEvent)=>{

            var re = this.calPoint(canvasEl, res);
            this.Canvas_MouseMove(re.rex, re.rey);

        });

        Observable.fromEvent(canvasEl,'mousedown').subscribe( (res:MouseEvent)=>{

            var re = this.calPoint(canvasEl, res);
            this.YesCanvasMouseOver = true;
            this.Canvas_MouseDown(re.rex, re.rey);

        });

        Observable.fromEvent(canvasEl,'mouseup').subscribe( (res:MouseEvent)=>{

            var re = this.calPoint(canvasEl, res);
            this.Canvas_MouseUp(re.rex, re.rey);
        });

        Observable.fromEvent(canvasEl,'mouseout').subscribe(()=> {
            this.YesCanvasMouseOver = false;
        });

        Observable.fromEvent(canvasEl,'mouseover').subscribe(()=> {
        });


        Observable.fromEvent(document,'keydown').subscribe((e:KeyboardEvent)=>{
            this.Canvas_KeyDown(e);
        });


    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_KeyDown(e : KeyboardEvent){

        let deleteLines : LineBase[] = [];
        let deleteBoxIdList : string[] = [];
        let deleteObjList : BaseObject[] = [];


        if (this.YesCanvasMouseOver)
        {
            if (e.ctrlKey && e.keyCode == 65 )
            {
                this.objects.forEach(i=>i.YesSelected = true);
                this.Draw();
                return;
            }

            switch(e.keyCode)
            {
                //delete key
                case 46:{

                    console.log('delete');

                    for (let i of this.objects){
                        if (i.YesSelected)
                        {
                            if (i instanceof BoxBase )
                            {
                                deleteBoxIdList.push(i.Id);
                            }

                            deleteObjList.push(i);
                        }
                    }

                    for (let i of deleteBoxIdList){
                        this.objects.forEach(obj => {
                            if (obj instanceof LineBase && (obj.Box_1_ID === i || obj.Box_2_ID === i))
                            {
                                deleteLines.push(obj);
                            }
                        });
                    }

                    for (let i of deleteObjList){
                        this.DeleteObject(i);
                    }

                    for (let i of deleteLines ){
                        this.DeleteObject(i);
                    }

                    this.Draw();

                    break;
                }
                //ESC key
                case 27:{
                    
                    if (this.yesAddLine){

                        let line:LineBase = <LineBase>this.currentObj;
                        this.yesAddLine = false;
                        let index = this.objects.indexOf(line);
                        if (index > -1) this.objects.splice(index,1);
                        this.yesDrawSelectBox = false;
                        this.YesMouseDown  = false;

                    }
                    break;
                }
            }
        }
            
    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    DeleteObject(obj:BaseObject){

        let index = this.objects.indexOf(obj);
        if (index > -1) this.objects.splice(index,1);
    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    calPoint (canvasEl:HTMLCanvasElement ,res:MouseEvent)  {

        let rect = canvasEl.getBoundingClientRect();

        var rex = res.clientX - rect.left;
        var rey = res.clientY - rect.top;

        return {rex,rey};


        // var rex;
        // var rey;

        
        // if (res.pageX || res.pageY) { 
        //     // rex = res.pageX + document.getElementById("canvas_container").scrollLeft ;
        //     // rey = res.pageY + document.getElementById("canvas_container").scrollTop;
        //     rex = res.pageX + document.getElementById(this.MyId).scrollLeft ;
        //     rey = res.pageY + document.getElementById(this.MyId).scrollTop;
        // }
        // else { 
        //     // rex = res.clientX + document.body.scrollLeft + document.documentElement.scrollLeft + document.getElementById("canvas_container").scrollLeft; 
        //     // rey = res.clientY + document.body.scrollTop + document.documentElement.scrollTop + document.getElementById("canvas_container").scrollTop; 
        //     rex = res.clientX + document.body.scrollLeft + document.documentElement.scrollLeft + document.getElementById(this.MyId).scrollLeft; 
        //     rey = res.clientY + document.body.scrollTop + document.documentElement.scrollTop + document.getElementById(this.MyId).scrollTop; 
        // } 


        // rex -= canvasEl.offsetLeft;
        // rey -= canvasEl.offsetTop;


        // rex = rex / this.CanvasScale;
        // rey = rey / this.CanvasScale;

        // return {rex,rey};
    }


	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_MouseMove(x:number, y:number){

        this.xpoint = x;
        this.ypoint = y;

        if (this.currentObj != undefined){
            this.message = this.currentObj.Title;
        }

        if ( this.YesMouseDown )
        {
            if(this.yesDrawSelectBox && this.selectBox != undefined){
                
                this.selectBox.x2 = x;
                this.selectBox.y2 = y;

                this.objects.forEach(i => {
                    i.YesSelected = false;
                });

                this.objects.forEach(i => {
                    i.CheckSelect(
                        this.selectBox.x1,
                        this.selectBox.y1,
                        this.selectBox.x2,
                        this.selectBox.y2
                    );
                });

            }
            else if(this.currentObj instanceof LineBase && !this.yesAddLine)
            {
                let line : LineBase = <LineBase>this.currentObj;

                if (line.MouseOverLineIndex == 1)
                {
                    // console.log('line select');

                    let dy = this.pre_y - y;

                    line.SetLieDepth(dy);
                }
                
            }
            else if( this.objects.filter(i=>i.YesSelected).length > 1 ){

                let boxlist : BoxBase[] = [];
                this.objects.filter(i=>i.YesSelected && i instanceof BoxBase).forEach(i => {
                    let dx = this.pre_x - x;
                    let dy = this.pre_y - y;
                    (<BoxBase>i).x -= dx;
                    (<BoxBase>i).y -= dy;
                    let circlePoint = (<BoxBase>i).CalMouseOverCirclePoint();
                    boxlist.push(<BoxBase>i);
                });

                boxlist.forEach(box => {
                    this.objects.forEach(i => {
                        if (i instanceof LineBase ){
                            if (i.Box_1_ID === box.Id)
                                i.SetBoxPoint(box, 1);
                            else if(i.Box_2_ID === box.Id)
                                i.SetBoxPoint(box,2);
                        }

                    });    
                });

            }
            else if(this.currentObj != undefined)
            {
                if (this.yesAddLine)
                {
                    this.objects.forEach(i => {
                        i.YesMouseOver = false;
                    });

                    let line : LineBase = <LineBase>this.currentObj;
                    let cirpt;

                    let box = this.objects.filter(i=> i instanceof BoxBase && line.Box_1_ID != i.Id ).find(i=>( 
                            cirpt = (<BoxBase>i).GetConnectPoint2(this.ctx,line.x1, line.y1,x,y)).PointIndex > 0 
                    );

                    if (box != undefined)
                    {
                        line.Box_2_ID = box.Id;
                        line.Box_2_PointIndex = cirpt.PointIndex;
                        line.x2 = cirpt.x;
                        line.y2 = cirpt.y;
                        box.YesMouseOver = true;
                    }
                    else
                    {
                        line.Box_2_ID = '';
                        line.Box_2_PointIndex = 0;
                        line.x2 = x;
                        line.y2 = y;
                    }

                }
                else if ( this.currentObj instanceof BoxBase)
                {
                    let dx = this.pre_x - x;
                    let dy = this.pre_y - y;
                    let box : BoxBase = <BoxBase>this.currentObj;
                    let circlePoint = box.CalMouseOverCirclePoint();

                    (<BoxBase>this.currentObj).x -= dx;
                    (<BoxBase>this.currentObj).y -= dy;

                    this.objects.forEach(i => {
                        if (i instanceof LineBase ){
                            if (i.Box_1_ID === box.Id)
                                i.SetBoxPoint(box, 1);
                            else if(i.Box_2_ID === box.Id)
                                i.SetBoxPoint(box,2);
                        }
                    });
                    
                }
            }
        }
        else{

            this.objects.forEach(i => {

                if (i.CheckMouseOver(this.ctx,x,y))
                {
                    this.message =  "mouse over : " + i.Type;
                }

            });    
        }

        this.pre_x = x;
        this.pre_y = y;
        

        this.Draw();
        
    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_MouseDown(x:number, y:number){

        this.YesMouseDown = true;


        if ( this.objects.filter(i=>i.YesSelected).length > 1 &&  
             this.objects.filter(i=>i.YesSelected).find(i=>i.CheckMouseOver(this.ctx,x,y)) != undefined )
        {

        }
        else
        {
            this.objects.forEach(element => {
                element.YesSelected = false;
            });
            
            this.objects.forEach(i => {

                if ( i instanceof BoxBase && this.yesAddLine === false ){

                    let re = i.CheckCircleMouseOver(this.ctx, x,y);

                    if (re.x >= 0){

                        this.yesAddLine = true;
                        let myline = new LineBase();

                        myline.x1 = re.x;
                        myline.y1 = re.y;
                        myline.x2 = re.x;
                        myline.y2 = re.y;
                        myline.Title = "Line";
                        myline.Box_1_ID = i.Id;
                        myline.Box_1_PointIndex = re.PointIndex;
                        myline.YesDrawEndArrow = true;
                        this.currentObj = myline;

                        this.objects.push(myline);

                        this.message = "circle down ok";

                    }
                    
                }
            });

            if (this.yesAddLine === false){

                this.currentObj = this.objects.find(i=> i.CheckMouseOver(this.ctx,x,y));

                if (this.currentObj != null) 
                {
                    this.currentObj.YesSelected = true;
                    this.message = 'selected : ' + this.currentObj.Type;
                }
                else{

                    this.yesDrawSelectBox = true;
                    this.selectBox = new SelectBox();

                    this.selectBox.x1 = x;
                    this.selectBox.x2 = x;
                    this.selectBox.y1 = y;
                    this.selectBox.y2 = y;

                    this.objects.push(this.selectBox);

                }

            }

            this.pre_x = x;
            this.pre_y = y;

            if (this.currentObj != undefined) this.Draw();
            
        }

    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Canvas_MouseUp(x:number, y:number){

        if (this.yesAddLine)
        {
            let line:LineBase = <LineBase>this.currentObj;

            if (line.Box_2_ID === "")
            {
                let index = this.objects.indexOf(line);
                if (index > -1) this.objects.splice(index,1);
            }
            else{
                this.SetSeq();
            }
        }
        else if(this.yesDrawSelectBox){

            this.objects.filter(i=>i.Type === SelectBox.name).forEach(i => {
                this.DeleteObject(i);    
            });
            
            this.yesDrawSelectBox = false;
        }

        this.YesMouseDown = false;
        this.currentObj = undefined;
        this.yesAddLine = false;

        this.Draw();

        this.MouseUp.emit(null);

    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetCurrentBox() : BoxBase {

        let objs = this.objects.filter(i=> i instanceof BoxBase && i.YesSelected);

        if (objs.length == 1)
            return <BoxBase>objs[0];
        else
            return null;
    }
    

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    private AddBox(){
        
        let myBox = new BoxBase();

        myBox.x = 10;
        myBox.y = 10;
        myBox.FillColor = 'lightblue'
        myBox.Width = 100;
        myBox.Height = 50;
        myBox.Title = "Box "+ this.objects.length.toString();
        
        this.objects.push(myBox);

        this.Draw();

	}
	
	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
	AddObject(obj:BaseObject)
	{
		this.objects.push(obj);
		this.Draw();
	}

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Draw(){

        this.ctx.clearRect(0,0,this.myCanvas.width, this.myCanvas.height);

        for (let obj of this.objects){
          obj.Draw(this.ctx);
        }

    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Clear(){

        this.objects = [];
        this.Draw();
    }


	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Test(){

        // let test1 = 'aaaa';
        // let test2 = '111aaaa';

        // this.message = ( test1 === test2 ? "equal" : "not");

        console.log( document.getElementById("canvas_container").scrollLeft);
        console.log(document.getElementById("canvas_container").scrollTop);

    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetSeq(){

        try
        {
            let lineList = <LineBase[]>this.objects.filter(i=> i instanceof LineBase);
            let rootBoxList : BoxBase[] = [];
    
            this.objects.filter(i=> i instanceof BoxBase).forEach(i => {
    
                (<BoxBase>i).Seq = 1;
    
                if ( lineList.find(i=> i.Box_2_ID === i.Id ) === undefined)
                {
                    rootBoxList.push(<BoxBase>i);
                }
    
            });
    
    
            rootBoxList.forEach(box => {
                lineList.filter(i=> i.Box_1_ID === box.Id ).forEach(i=>{
                    this.Trip(i.Box_2_ID,2);
                });
            });
    
            this.Draw();
        }
        catch(e)
        {

        }
        


    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Trip(boxId:string, index:number){
        
        let box : BoxBase = <BoxBase>this.objects.find(i=> i.Id === boxId);
        let lineList = <LineBase[]>this.objects.filter(i=> i instanceof LineBase);
        let childList : BoxBase[];
        
        box.Seq = Math.max(box.Seq, index);

        lineList.forEach(i => {
            if (i.Box_1_ID === box.Id)
            {
                this.Trip(i.Box_2_ID, index + 1);
            }
        });

    }

	//________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    SetScale(ScaleType:string){
        
        if (ScaleType === 'up')
        {
            this.CanvasScale += 1;
        }
        else{
            this.CanvasScale -= 1;
        }

        this.ctx.scale(2,2);


    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    RunStatusClear(){

        this.objects.filter(i=>i instanceof BoxBase).forEach(i=>{
            (<BoxBase>i).RunOK = false;
            (<BoxBase>i).RunStatus = false;
            (<BoxBase>i).RunSeq = 0;
        })
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetCurrentObject(){
        if (this.objects.filter(i=>i.YesSelected).length == 1)
        {
            return this.objects.find(i=>i.YesSelected);
        }
        else
        {
            return null;
        }
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetPreviousBox(){
        var reArry = new Array();
        var prebox;
        var curbox = this.GetCurrentBox();

        for ( var line of this.objects.filter(i=> i instanceof LineBase && (<LineBase>i).Box_2_ID == curbox.Id ))
        {
            prebox = {};
            prebox["Title"] = (<BoxBase>this.objects.find(i=>i.Id == (<LineBase>line).Box_1_ID)).Title;
            prebox["ID"] = (<LineBase>line).Box_1_ID;

            reArry.push(prebox);
        }

        return reArry;

    }
    


}//class