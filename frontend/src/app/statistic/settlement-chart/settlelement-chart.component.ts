import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration-controller.service';
import { Registration } from '../../models/Registration';

@Component({
  selector: 'app-settlement-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settlement-chart.component.html'
})
export class SettlementChartComponent implements OnInit {
  chartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Кількість заселень',
        data: [],
        backgroundColor: '#4CAF50'
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Статистика заселення за місяцями'
      }
    }
  };

  constructor(private regService: RegistrationService) {}

  ngOnInit(): void {
    this.regService.getAllRegistrations().subscribe((registrations: Registration[]) => {
      const dateCounts: { [month: string]: number } = {};

      registrations.forEach(reg => {
        if (reg.checkInDate) {
          const date = new Date(reg.checkInDate);
          const monthKey = date.toLocaleDateString('uk-UA', {year: 'numeric', month: 'long'});

          if (dateCounts[monthKey]) {
            dateCounts[monthKey]++;
          } else {
            dateCounts[monthKey] = 1;
          }
        }
      });

      this.chartData.labels = Object.keys(dateCounts);
      this.chartData.datasets[0].data = Object.values(dateCounts);
    });
  }
}
