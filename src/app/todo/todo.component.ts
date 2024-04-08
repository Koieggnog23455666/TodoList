import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  ngOnInit(): void {
    this.getData();
  }
  tasks: { text: string, completed: boolean, isIconBlack: boolean }[] = [];
  completedTasks: { text: string, completed: boolean, isIconBlack: boolean }[] = [];
  newTask: string = '';
  today: Date = new Date();
  isIconBlack: boolean = false;
  

  
  addTask() {
    
      if (this.newTask.trim() !== '') {
        this.tasks.push({ text: this.newTask.trim(), completed: false, isIconBlack: false });
        this.newTask = '';
        this.setData();
      }
   
    
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
  toggleTaskCompletion(task: { text: string, completed: boolean, isIconBlack: boolean }) {
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
