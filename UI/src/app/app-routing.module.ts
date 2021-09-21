import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
//import { OrdersComponent } from './_components/orders/orders.component';
import { NewOrderComponent } from './_components/new-order/new-order.component';
import { StockComponent } from './_components/stock/stock.component';
import { StatsComponent } from './_components/stats/stats.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { AboutComponent } from './_components/about/about.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
//  { path: 'orders', component: OrdersComponent },
  { path: 'new_order', component: NewOrderComponent },
  { path: 'stock', component: StockComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  //
  { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
