import { BoxBase } from "./BoxBase";

export class FlowBox extends BoxBase{
    
    document : string = '';
    MyProperty : string = '';
    ResultDataJsonString : string = "";
    InputDataJsonString : string = "";
    

    

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    constructor(){
        super();
        this.Type = FlowBox.name;
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    GetProperty(){

        if (this.MyProperty == '')
        {
            return '';
        }
        else
        {
            return JSON.parse(this.MyProperty);
        }
        
    }

    //________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
    Draw(ctx:CanvasRenderingContext2D){
        super.Draw(ctx);


        if (this.GetProperty().UseExistData == true )
        {
            let img = new Image();
            img.src = '/assets/img/useexistdata.png';
            ctx.drawImage(img, this.x+10, this.y-20);
        }
        


    }
    

}//class