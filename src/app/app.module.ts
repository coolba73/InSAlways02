import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MainComponent  } from "./main/main.component";
import { AppRouting } from "./app.routing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { 
         MatCommonModule 
        ,MatButtonModule
        ,MatMenuModule
        ,MatDialogModule
       } from "@angular/material";

@NgModule({
  declarations: [
    AppComponent
    ,MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting,
    BrowserAnimationsModule,
    MatCommonModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
