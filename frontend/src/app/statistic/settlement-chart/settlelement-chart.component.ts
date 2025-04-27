import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { RegistrationService } from '../../services/registration-controller.service';
import { Registration } from '../../models/Registration';

// Реєструємо всі контролери Chart.js, включаючи "bar"
Chart.register(...registerables);

@Component({
  selector: 'app-settlement-chart',
  standalone: true,
  imports: [BaseChartDirective], // Використовуємо BaseChartDirective замість CommonModule
  templateUrl: './settlement-chart.component.html',
  styleUrls: ['./settlement-chart.component.css'] // Додаємо файл стилів
})
export class SettlementChartComponent implements OnInit {
  chartData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [
      {
        label: 'Кількість заселень',
        data: [],
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Дозволяє діаграмі адаптуватися до розмірів контейнера
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Статистика заселення за місяцями'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Місяць'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Кількість заселень'
        }
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
          const monthKey = date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' });

          dateCounts[monthKey] = (dateCounts[monthKey] || 0) + 1;
        }
      });

      this.chartData = {
        labels: Object.keys(dateCounts),
        datasets: [
          {
            label: 'Кількість заселень',
            data: Object.values(dateCounts),
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
            borderWidth: 1
          }
        ]
      };
    });
  }
}
