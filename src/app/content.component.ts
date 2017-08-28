import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Row, TableService} from './table.service';
import {MenuItem} from 'primeng/primeng';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-content',
  templateUrl: 'content.component.html',
  styleUrls: ['content.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TableService, DatePipe]
})
export class ContentComponent {
  filename = 'ISP National APHT Report: ';
  cols: any[];
  row: Row = new Row();
  curRows: Row[];
  selectedRow: Row;
  menuItems: MenuItem[];
  displayDialog: boolean;
  newRow: boolean;
  tables: Row[][];
  curTab = 0;

  constructor(private rowsService: TableService, private datePipe: DatePipe) {
    this.filename += this.datePipe.transform(Date.now(), 'fullDate');
    this.cols = this.rowsService.getTableCols();
    this.tables = this.rowsService.getTables();
    this.menuItems = [
      {label: 'Modify', icon: 'fa-edit', command: (event) => this.modifyRow()},
      {label: 'Delete', icon: 'fa-remove', command: (event) => this.deleteRow()}
    ];
    this.curRows = this.tables[0];
  }

  showDialogToAdd() {
    this.newRow = true;
    this.row = new Row();
    this.displayDialog = true;
  }

  modifyRow(): void {
    this.newRow = false;
    this.row = this.cloneRow(this.selectedRow);
    this.displayDialog = true;
  }

  deleteRow(): void {
    const index = this.curRows.indexOf(this.selectedRow);
    this.tables[this.curTab] = this.tables[this.curTab].filter((val,i) => i!=index);
    this.curRows = this.tables[this.curTab];
    this.selectedRow = null;
  }

  onTabChange(event) {
    this.curRows = this.tables[event.index];
    this.curTab = event.index;
  }

  cloneRow(r: Row): Row {
    const row = new Row();
    for(const prop in r) {
      row[prop] = r[prop];
    }
    return row;
  }

  save() {
    let index = this.tables[this.curTab].indexOf(this.selectedRow);;
    let rows: Row[] = [...this.tables[this.curTab]];
    if(this.newRow)
      rows.push(this.row);
    else {
      rows[index] = this.row;
    }
    this.tables[this.curTab] = rows;
    this.curRows = this.tables[this.curTab];
    this.row = null;
    this.displayDialog = false;
  }

  rowBgColor(row: Row) {
    let bgStyleClass: string;
    if (row.curTier > 10)
      bgStyleClass = 'red-highlighting';
    else if (row.curTier >= 8)
      bgStyleClass = 'green-highlighting';
    return bgStyleClass;
  }

  exportTableToExcel() {
    alert('export');
  }
}
