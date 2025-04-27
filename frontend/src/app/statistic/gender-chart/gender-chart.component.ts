import { Component, OnInit } from '@angular/core';
import { StatisticsService } from '../../services/gender-count.service';
import { GenderCountDto } from '../../models/GenderCountDto';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, Chart, registerables, ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-gender-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './gender-chart.component.html',
  styleUrls: ['./gender-chart.component.css'] // Додайте, якщо ще не підключено
})
export class GenderChartComponent implements OnInit {
  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#f5607f', '#3675d7']
      }
    ]
  };
  pieChartType: any = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true, // Діаграма адаптується до розмірів контейнера
    maintainAspectRatio: false // Дозволяє ігнорувати пропорції
  };

  constructor(private statsService: StatisticsService) {}

  ngOnInit(): void {
    this.statsService.getGenderStats().subscribe((data: GenderCountDto[]) => {
      this.pieChartData = {
        labels: data.map(d => d.gender ? 'Чоловіки' : 'Жінки'),
        datasets: [
          {
            data: data.map(d => d.studentCount),
            backgroundColor: ['#fd6383', '#638efd']
          }
        ]
      };
    });
  }
}
