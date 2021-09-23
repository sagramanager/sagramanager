import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { OrdersComponent } from './_components/orders/orders.component';
import { NewOrderComponent } from './_components/new-order/new-order.component';
import { StockComponent } from './_components/stock/stock.component';
import { StatsComponent } from './_components/stats/stats.component';
import { SettingsComponent } from './_components/settings/settings.component';
import { AboutComponent } from './_components/about/about.component';
import { LoginComponent } from './_components/login/login.component';
import { AuthorizeGuard } from './_guards/authorize.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthorizeGuard] },
  { path: 'new_order', component: NewOrderComponent, canActivate: [AuthorizeGuard] },
  { path: 'stock', component: StockComponent, canActivate: [AuthorizeGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthorizeGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthorizeGuard] },
  { path: 'about', component: AboutComponent },
  { path: "login/:redirect/:extraParam", component: LoginComponent },
  { path: "login/:redirect", component: LoginComponent },
  //
  { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
