import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { Category } from '../../../../shared/Models/Category'
import { FormControl, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../Services/category.service';


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
  categoryService = inject(CategoryService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nameFormControl = new FormControl('', [Validators.required]);

  displayedColumns: string[] = ['id', 'name', 'delete'];

  categories: Category [] =[];

  dataSource = new MatTableDataSource<Category>();

  isShown: boolean = false;

  isLoading = true;

  constructor() {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.getCategories();
  }

  getCategories() : void {
    this.categoryService.getCategories().subscribe(categories =>{
      this.categories = categories;
      this.dataSource.data = categories;
      this.isLoading = false;
    })
  }

  deleteCategory(id: number) : void{
    this.categoryService.deleteCategory(id).subscribe(response =>{
      this.getCategories();
    })
  }

  toggle() : void {
    this.isShown = !this.isShown;
  }

  insertCategory() : void {
    const categoryName = this.nameFormControl.value ? this.nameFormControl.value : " ";
    this.categoryService.insertCategory(categoryName).subscribe(response =>{
      this.getCategories();
    })
  }
}
