
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {


  tasks: { text: string, completed: boolean, isIconBlack: boolean, validDate: string }[] = [];
  completedTasks: { text: string, completed: boolean, isIconBlack: boolean,validDate:string }[] = [];
  newTask: string = '';
  checkNum: any;
  today: Date = new Date();
  task1: any;
  isIconBlack: boolean = false;
  index: any;
  index2: any;
  validDate: string = '';
  trimTask: string = this.newTask.trim();
  ngOnInit(): void {
    this.getData();
    const today = new Date();
    this.validDate = this.todayDate(today);
  }
  todayDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;

  }
  // validateDueDate(control: any): { [key: string]: boolean } | null {
  //   const selectedDate = new Date(control.value);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Set hours to 0 for comparison
  //   if (selectedDate < today) {
  //     return { 'invalidDate': true };
  //   }
  //   return null;
  // }
  form = new FormGroup({
    taskNew: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]'),
      Validators.maxLength(15),
    ]),
    dueDate: new FormControl('', [Validators.required,
    ])
  })

  onSubmit() {
    const newTaskValue: any = this.form.get('taskNew')?.value?.trim();
    const dueDateValue: any = this.form.get('dueDate')?.value;
    if (newTaskValue !== '') {
      this.addTask(newTaskValue, dueDateValue)
      this.form.reset()
    }
  }

  editMode(i: number) {
    this.index = i;
    this.newTask = this.tasks[this.index].text;
  }
  editModeInCompleted(i: number) {
    this.index2 = i
    this.newTask = this.completedTasks[this.index2].text;
  }

  addTask(newTaskValue: string, dueDateValue: string) {
    this.tasks.push({ text: newTaskValue, completed: false, isIconBlack: false, validDate: dueDateValue });
    this.newTask = '';
    this.setData();

  }
  deleteTaskfromPending(index: number) {
    this.tasks.splice(index, 1);
    this.setData();
    this.getData()
  }
  deleteTaskFromCompleted(index: number) {
    this.completedTasks.splice(index, 1);
    this.setData()
    this.getData()
  }
  toggleTaskCompletion(task: { text: string, completed: boolean, isIconBlack: boolean,validDate:string }) {
    task.completed = !task.completed;

    if (task.completed) {
      // Move task to completed list
      this.completedTasks.push(task);
      this.tasks = this.tasks.filter(t => t !== task);
    } else {
      // Move task back to pending list
      this.tasks.push(task);
      this.completedTasks = this.completedTasks.filter(t => t !== task);
    }
    this.setData()
    this.getData()
  }

  toggleIconColor(task: { isIconBlack: boolean }) {

    task.isIconBlack = !task.isIconBlack;
    this.setData()
    this.getData()

  }
  setData() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    localStorage.setItem('completedTasks', JSON.stringify(this.completedTasks));
  }
  getData() {
    const stroredData = localStorage.getItem('tasks');
    const storedDataCompleted = localStorage.getItem('completedTasks');
    if (stroredData) {
      this.tasks = JSON.parse(stroredData);
      this.completedTasks = JSON.parse(storedDataCompleted || "[]");
    }
  }
}
