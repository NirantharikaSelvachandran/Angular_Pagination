import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PagingConfig } from '../paging';

@Component({
  selector: 'app-studentcrud',
  templateUrl: './studentcrud.component.html',
  styleUrls: ['./studentcrud.component.css']
})
export class StudentcrudComponent implements OnInit {

  StudentArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  Stname: string = "";
  Course: string = "";
  Fee: string = "";
  currentStudentId = "";

  //paging
  currentPage:number  = 1; //Represents the current page number
  itemsPerPage: number = 2; //Represents the number of items to display per page
  totalItems: number = 0; //Represents the total number of items in your dataset
  tableSize: number[] = [5, 10, 15, 20]; //An array that contains options for the number of items to display on a page (e.g., [5, 10, 15, 20])
  pagingConfig: PagingConfig = {} as PagingConfig; //An object of type PagingConfig that stores the current pagination configuration, including itemsPerPage, currentPage, and totalItems

  constructor(private http: HttpClient) { 
    this.pagingConfig = {
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      totalItems: this.totalItems
    }
  }

  ngOnInit(): void {
    this.getAllStudent();
  }

  //Fetches the data from the server based on the current pagination configuration. It calculates the startIndex and endIndex to request only the relevant portion of data. The sliced data is then assigned to this.StudentArray.
  getAllStudent() {
    this.http.get("http://localhost:5000/api/student").subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.StudentArray = resultData.data;  
      this.pagingConfig.totalItems = resultData.length;
    });
  }

  //This function is called when the user changes the page using the pagination controls. It updates the currentPage in pagingConfig and calls getAllStudent() to fetch the data for the new page
  onTableDataChange(event:any){
    this.pagingConfig.currentPage  = event;
    this.getAllStudent();
  }
  //This function is called when the user changes the number of items per page. It updates the itemsPerPage in pagingConfig, sets currentPage to 1, and calls getAllStudent() to fetch the data with the new configuration.
  onTableSizeChange(event:any): void {
    this.pagingConfig.itemsPerPage = event.target.value;
    this.pagingConfig.currentPage = 1;
    this.getAllStudent();
  }

  register() {
    let bodyData = {
      "Stname": this.Stname,
      "Course": this.Course,
      "Fee": this.Fee
    };

    this.http.post("http://localhost:5000/api/student/add", bodyData).subscribe((resultData: any) => {
      alert("Student Registered Successfully");
      this.getAllStudent();
    });
  }

  setUpdate(data: any) {
    this.Stname = data.Stname;
    this.Course = data.Course;
    this.Fee = data.Fee;

    this.currentStudentId = data.Id;
  }

  updateRecords() {
    let bodyData = {
      "Stname": this.Stname,
      "Course": this.Course,
      "Fee": this.Fee
    };

    this.http.put("http://localhost:5000/api/student/update" + "/" + this.currentStudentId, bodyData).subscribe((resultData) => {
      alert("Student Details Updated Successfully");
      this.getAllStudent();
    });
  }

  save() {
    if (this.currentStudentId === '') {
      this.register();
    } else {
      this.updateRecords();
    }
  }

  setDelete(data: any) {
    this.http.delete("http://localhost:5000/api/student/delete" + "/" + data.Id).subscribe((resultData: any) => {
      alert("Student Details Deleted Successfully");
      this.getAllStudent();
    });
  }
}
