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
    

}//class