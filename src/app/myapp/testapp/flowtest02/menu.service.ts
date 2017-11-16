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
        name: "File",
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
                ]
    }
    ,{
        id:"2"
        ,name:"Add Box"
        ,iconSrc:"add"
    }
    ,{
        id:"3"
        ,name:"Run"
        ,iconSrc:"spinnext"
    }
];

@Injectable()
export class MenuService {
    getMenus(): Menu[] {
        return menus;
    }
}
