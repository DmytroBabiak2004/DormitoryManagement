import { Component } from '@angular/core';
import {GenderChartComponent} from '../../statistic/gender-chart/gender-chart.component';
import {SettlementChartComponent} from '../../statistic/settlement-chart/settlelement-chart.component';

@Component({
  selector: 'app-reports-components',
  imports: [
    GenderChartComponent,
    SettlementChartComponent
  ],
  templateUrl: './reports-page.component.html',
  standalone: true,
  styleUrl: './reports-page.component.scss'
})

export class ReportsComponent {
}
