import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {RoomWithFreePlacesService} from '../../../services/RoomWithFreePlaces.service';
import {RoomWithFreePlaces} from '../../../models/RoomWithFreePlaces';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-room-with-free-places-table',
  templateUrl: './room-with-free-places-table.component.html',
  styleUrls: ['../../../../styles/tables.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RoomWithFreePlacesTableComponent implements OnInit {
  data: RoomWithFreePlaces[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;


  constructor(private roomWithFreePlacesService: RoomWithFreePlacesService, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadRoomsWithFreePlaces();
  }

  loadRoomsWithFreePlaces(): void {
    this.roomWithFreePlacesService.getRoomsWithFreePlaces(this.currentPage, this.pageSize).subscribe(response => {
      console.log('Server response:', response);
      this.data = response.roomsWithFreePlaces.map(roomWithFreePlaces => ({
        ...roomWithFreePlaces,
        expanded: false
      }));
      this.totalItems = response.total ?? 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }, error => {
      console.error('Error loading rooms:', error);
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadRoomsWithFreePlaces();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadRoomsWithFreePlaces();
    }
  }

  toggleDetails(item: RoomWithFreePlaces): void {
    item.expanded = !item.expanded;
  }

  downloadPdf(): void {
    const doc = new jsPDF();


    doc.text('List of the room with free places', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['Room number', 'Total places', 'Reserved places', 'Free places']],
      body: this.data.map(item => [
        item.roomNumber,
        item.totalPlaces,
        item.occupiedPlaces,
        item.freePlaces
      ])
    });

    doc.save('rooms_with_free_places.pdf');
  }

  downloadJson(): void {
    const json = JSON.stringify(this.data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'rooms_with_free_places.json');
  }


}
