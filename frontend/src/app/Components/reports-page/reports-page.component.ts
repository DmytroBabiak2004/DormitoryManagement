import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration-controller.service';
import { StatisticsService } from '../../services/gender-count.service';
import { Registration } from '../../models/Registration';
import { GenderCountDto } from '../../models/GenderCountDto';
import jsPDF from 'jspdf';
import { GenderChartComponent } from '../../statistic/gender-chart/gender-chart.component';
import { SettlementChartComponent } from '../../statistic/settlement-chart/settlelement-chart.component';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [GenderChartComponent, SettlementChartComponent], // Видалено BaseChartDirective
  templateUrl: './reports-page.component.html',
  styleUrls: ['../../../styles/tables.scss']
})
export class ReportsComponent implements OnInit {
  genderData: GenderCountDto[] = [];
  settlementData: { month: string; count: number }[] = [];

  constructor(
    private regService: RegistrationService,
    private statsService: StatisticsService
  ) {}

  ngOnInit(): void {
    // Завантаження даних для гендерної статистики
    this.statsService.getGenderStats().subscribe((data: GenderCountDto[]) => {
      this.genderData = data;
    });

    // Завантаження даних для статистики заселень
    this.regService.getAllRegistrations().subscribe((registrations: Registration[]) => {
      const dateCounts: { [month: string]: number } = {};
      registrations.forEach(reg => {
        if (reg.checkInDate) {
          const date = new Date(reg.checkInDate);
          const monthKey = date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' });
          dateCounts[monthKey] = (dateCounts[monthKey] || 0) + 1;
        }
      });
      this.settlementData = Object.keys(dateCounts).map(month => ({
        month,
        count: dateCounts[month]
      }));
    });
  }

  // Генерація PDF
  generatePDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Dormitory Statistics', 10, 10);

    // Gender Statistics
    doc.setFontSize(12);
    doc.text('Student Gender Statistics', 10, 20);
    this.genderData.forEach((item, index) => {
      const gender = item.gender ? 'Male' : 'Female';
      doc.text(`${gender}: ${item.studentCount} students`, 10, 30 + index * 10);
    });

    // Settlement Statistics
    doc.text('Settlement Statistics by Month', 10, 50 + this.genderData.length * 10);
    this.settlementData.forEach((item, index) => {
      doc.text(`${item.month}: ${item.count} settlements`, 10, 60 + this.genderData.length * 10 + index * 10);
    });

    // Save PDF
    doc.save('statistics-report.pdf');
  }

  // Генерація JSON
  generateJSON(): void {
    const data = {
      genderStatistics: this.genderData.map(item => ({
        gender: item.gender ? 'Чоловіки' : 'Жінки',
        studentCount: item.studentCount
      })),
      settlementStatistics: this.settlementData.map(item => ({
        month: item.month,
        count: item.count
      }))
    };

    // Створення JSON і виклик завантаження
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statistics-report.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
