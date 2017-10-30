import { Component,ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { DrawCanvasComponent } from "../../core/material/drawcanvas/drawcanvas.component";
import { BaseObject }          from "../../core/drawobject/BaseObject";
import { BoxBase }             from "../../core/drawobject/BoxBase";
import { FlowBox }             from "../../core/drawobject/FlowBox";
import { LineBase }            from "../../core/drawobject/LineBase";
import { SelectBox }           from "../../core/drawobject/SelectBox";
import { UUID }                from "angular2-uuid";

declare var $: any;

@Component({
    selector : 'flowtest02',
    templateUrl : './flowtest02.component.html',
    styleUrls : ['./flowtest02.component.css']
})

export class FlowTest02Component implements OnInit, AfterViewInit{
    
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    @ViewChild("fcvs") finCanvas : DrawCanvasComponent;


    ngAfterViewInit(){
         // $ init summernote
         $('#summernote').summernote({
            height:300,
            maxHeight:null,
            minHeight:null
            });
    }
    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    ngOnInit(){
        
        

        // // $ init summernote
        // $('#summernote').summernote({
        // height:300,
        // maxHeight:null,
        // minHeight:null
        // });


        // summernote.change
        //   $('#summernote').on('summernote.change', function(we, contents, $editable) {
        //     console.log('summernote\'s content is changed.');
        //   });

        // var self = this;
        // $('#summernote').on('summernote.change', 
        //     function(){
        //         self.Summernote_Change();
        //     }
        // );
    }    
    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    AddFlow(){
        
        let flowBox = new FlowBox();

        flowBox.x = 10;
        flowBox.y = 10;

        this.finCanvas.AddObject(flowBox);
        
    }

    
}//class