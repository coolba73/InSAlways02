import { Injectable } from '@angular/core';

export class Menu {
    id: string;
    name: string;
    iconSrc?: string;
    price?: number;
    disabled?: boolean;
    items?: Menu[];
}

var menus: Menu[] = 
[
    {
        id: "1",
        name: "",
        iconSrc:"menu",
        items: [
                    {
                        id: "1_1"
                        ,name: "New"
                        ,iconSrc:"add"
                    } 
                    ,{
                        id: "1_2"
                        ,name: "Save"
                        ,iconSrc:"floppy"
                    }
                    ,{
                        id: "1_3"
                        ,name: "Open"
                        ,iconSrc:"folder"
                    }
                    ,{
                        id: "1_4"
                        ,name: "Copy Flow"
                    }
                    ,{
                        id:"1_5"
                        ,name:'Set Property'
                        ,items:[
                            {
                                id:'1_5_1'
                                ,name :"Set All Object Do not use UseExistData"
                            },
                            {
                                id:'1_5_2'
                                ,name :"Set All Object use UseExistData"
                            }
                            ,{
                                id:'1_5_3'
                                ,name:'Clear Run Status'
                            }
                        ]
                    }
                    ,{
                        id:'1_6'
                        ,name:"Full Screen"
                    }
                ]
    }
    // ,{
    //     id:"2"
    //     ,name:"Add Box"
    //     ,iconSrc:"add"
    // }
    // ,{
    //     id:"3"
    //     ,name:"Run"
    //     ,iconSrc:"spinnext"
    // }
];

@Injectable()
export class MenuService {
    getMenus(): Menu[] {
        return menus;
    }
}
