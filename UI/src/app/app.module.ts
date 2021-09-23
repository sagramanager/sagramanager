import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './_components/home/home.component';
import { OrdersComponent } from './_components/orders/orders.component';
import { NewOrderComponent } from './_components/new-order/new-order.component';
import { StockComponent } from './_components/stock/stock.component';
import { StatsComponent } from './_components/stats/stats.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { AboutComponent } from './_components/about/about.component';
import { LoginComponent } from './_components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrdersComponent,
    NewOrderComponent,
    StockComponent,
    StatsComponent,
    SettingsComponent,
    AboutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
