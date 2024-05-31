import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Category } from '../../../../shared/Models/Category';
import { FormControl, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../Services/category.service';
import { UserService } from '../Services/user.service';
import { User } from '../Models/User';

export interface UserExtended extends User {
  isWithinCategory?: boolean
}

@Component({
  selector: 'app-categories',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  categoryService = inject(CategoryService);

  userService = inject(UserService);

  @ViewChild('categoriesPaginator', { read: MatPaginator }) categoriesPaginator!: MatPaginator;

  @ViewChild('usersPaginator', { read: MatPaginator }) usersPaginator!: MatPaginator;

  @ViewChild('allUsersPaginator', { read: MatPaginator }) allUsersPaginator!: MatPaginator;


  nameFormControl = new FormControl('', [Validators.required]);

  nameEditFormControl = new FormControl('', [Validators.required]);

  displayedColumns: string[] = ['id', 'name', 'delete'];

  displayedUsersColumns: string[] = ['username', 'email'];

  displayedAllUsersColumns: string[] = ['username', 'email', 'modify'];

  categories: Category[] = [];

  usersCategory: User[] = [];

  allUsers: UserExtended[] = [];

  dataSource = new MatTableDataSource<Category>();

  dataSourceUsers = new MatTableDataSource<User>();

  dataSourceAllUsers = new MatTableDataSource<UserExtended>();

  isShown: boolean = false;

  isEmailShown: boolean = false;

  isLoading = true;

  selectedRowIndex = -1;

  selectedRowObject!: Category;

  previousRowIndex = -1;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.categoriesPaginator;
    this.getCategories();
    this.getAllUsers();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.dataSource.data = categories;
      this.isLoading = false;
    });
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe((response) => {
      this.getCategories();
    });
  }

  toggle(): void {
    this.isShown = !this.isShown;
  }

  toggleEmail(row: any): void {
    if (this.previousRowIndex === row.id) 
    {
      this.isEmailShown = !this.isEmailShown;
    } 
    else 
    {
      this.isEmailShown = true;
    }
    this.previousRowIndex = row.id;
    this.selectedRowIndex = row.id;
    this.selectedRowObject = row;
    this.getUsersByCategory(row.id);
  }

  insertCategory(): void {
    const categoryName = this.nameFormControl.value
      ? this.nameFormControl.value
      : ' ';
    this.categoryService.insertCategory(categoryName).subscribe((response) => {
      this.getCategories();
    });
  }

  openEmailList(row: any): void {
    this.selectedRowIndex = row.id;
    this.allUsers.map( user => {
      user.isWithinCategory = this.selectedRowIndex == user.categoryId ? true : false;
    });

    this.dataSourceAllUsers.data = this.allUsers;
    console.log(this.dataSourceAllUsers)
  }

  getUsersByCategory(categoryId : number): void {
    this.userService.getUsersByCategory(categoryId).subscribe((response) => {
      this.usersCategory = response;
      this.dataSourceUsers.data = response;
      this.dataSourceUsers.paginator = this.usersPaginator;

    },
    (error) => {
      console.error('Error fetching users:', error);
      if (error.status === 400 && error.error === 'No users found for this category') {
        this.usersCategory = []; 
        this.getAllUsers();
      }
    });
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe((response) => {
      this.allUsers = response;
      this.dataSourceAllUsers.paginator = this.allUsersPaginator;
    });
  }

  editCategory(categoryId: number): void {
    const categoryName = this.nameEditFormControl.value
    ? this.nameEditFormControl.value
    : ' ';
    this.categoryService.editCategoryName(categoryId, categoryName).subscribe((response) =>{
      this.isLoading = true;
      this.toggleEmail(this.selectedRowObject);
      this.getCategories();
    })
  }

  changeUserCategory(row: UserExtended, toRemove: boolean): void {
    const id = toRemove ? null : this.selectedRowObject.id
    this.userService.changeUserCategory(row.id, id).subscribe((response)=>{
      console.log(response);
      location.reload();
    })
  }
}
