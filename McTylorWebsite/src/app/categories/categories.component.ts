import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Category } from '../../../../shared/Models/Category'
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-categories',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, AfterViewInit{

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nameFormControl = new FormControl('', [Validators.required]);

  displayedColumns: string[] = ['id', 'name', 'delete'];

  categories: Category [] =[];

  dataSource = new MatTableDataSource<Category>();

  isShown: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getCategories() : void {
    this.http
    .get<Category[]>('https://localhost:44391/Main/GetCategories')
    .subscribe(response =>{
      this.categories = response;
      this.dataSource.data = response;
    });
  }

  deleteCategory(id: number) : void{
    this.http
      .delete<any>('https://localhost:44391/Main/DeleteCategory/' + id)
      .subscribe(response=>{
        this.getCategories();
      });
  }

  toggle() : void {
    this.isShown = !this.isShown;
  }

  insertCategory() : void {
    console.log(this.nameFormControl.value);
    const categoryName = this.nameFormControl.value;
    this.http.post('https://localhost:44391/Main/AddCategory/' + categoryName, null)
      .subscribe(response => {
        this.getCategories();
      });
  }
}
