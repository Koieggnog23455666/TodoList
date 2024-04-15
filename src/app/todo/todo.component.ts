import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormControl,FormGroup,ValidatorFn,Validators,} from '@angular/forms';
interface task {
  text: string;
  completed: boolean;
  isIconBlack: boolean;
  validDate: string;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  tasks: task[] = [];
  completedTasks: task[] = [];
  newTask: string = '';
  today: Date = new Date();
  task1: any;
  isIconBlack: boolean = false;
  index: any;
  index2: any;
  index3: any;
  validDate: string = '';
  mode: string = 'Add';
  editTask: task | null = null; //for creating task objects when task is selected for editing
  trimTask: string = this.newTask.trim();

  ngOnInit(): void {

    const today = new Date();
    this.validDate = this.todayDate(today);
    this.getData();
  }

  todayDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  form = new FormGroup({
    taskNew: new FormControl('', [
      Validators.required,
      Validators.pattern('\\s*[a-zA-Z]+(\\s*[a-zA-Z]+)*\\s*'),
      this.maxLengthWithoutWhitespace(15),
      
    ]),
    dueDate: new FormControl('', [Validators.required, this.validateDueDate]),
  });
  validateDueDate(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      return { invalidDate: true };
    }
    return null;
  }
  maxLengthWithoutWhitespace(maxLength: number): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      const value = control.value?.replace(/\s/g, ''); // Remove whitespace
      if (value.length > maxLength) {
        return { maxlength: true };
      }
      return null;
    };
  }
  
  editMode(task: task) {
    this.mode = 'Update';
    this.editTask = task;
    this.form.get('taskNew')?.setValue(task.text); // Set the form control value to the task text
    this.form.get('dueDate')?.setValue(task.validDate); // Set the form control value to the task text
    this.setData();
  }
  addTask() {
    const newTaskValue = this.form.get('taskNew')?.value?.trim();
    const dueDateValue = this.form.get('dueDate')?.value;

    if (this.mode === 'Update') {
      const newTask: task = {
        text: newTaskValue || '',
        validDate: dueDateValue || '',
        completed: this.editTask?.completed || false,
        isIconBlack: this.editTask?.isIconBlack || false,
      };
      if (
        this.editTask !== null &&
        newTask.text !== '' &&
        newTask.validDate !== ''
      ) {
        const findIndexComplete = this.completedTasks.indexOf(this.editTask);
        const findIndex = this.tasks.indexOf(this.editTask);

        if (newTask.completed == true) {
          this.completedTasks.splice(findIndexComplete, 1, newTask);
        } else {
          this.tasks.splice(findIndex, 1, newTask);
        }
        this.setData()
      }
      this.mode = "Add"
      this.form.get('dueDate')?.reset()
      this.form.reset()
    } 
    else {
      if (this.form.valid && newTaskValue && dueDateValue) {
        const newTask: task = {
          text: newTaskValue,
          validDate: dueDateValue,
          completed: false,
          isIconBlack: false,
        };
        this.tasks.push(newTask);
        this.setData()
        this.form.get('dueDate')?.reset()
        this.form.reset()
      }
      this.newTask = '';
      this.form.get('dueDate')!.reset();
      this.mode = 'Add';
      this.setData();
      
    }
    this.setData();
  }
  deleteTaskfromPending(index: number) {
    this.tasks.splice(index, 1);
    this.setData();
    this.getData();
  }
  deleteTaskFromCompleted(index: number) {
    this.completedTasks.splice(index, 1);
    this.setData();
    this.getData();
  }
  toggleTaskCompletion(task: task) {
    task.completed = !task.completed;

    if (task.completed) {
      // Move task to completed list
      this.completedTasks.push(task);
      this.tasks = this.tasks.filter((t) => t !== task);
    } else {
      // Move task back to pending list
      this.tasks.push(task);
      this.completedTasks = this.completedTasks.filter((t) => t !== task);
    }
    this.setData();
    this.getData();
  }

  toggleIconColor(task: { isIconBlack: boolean }) {
    task.isIconBlack = !task.isIconBlack;
    this.setData();
    this.getData();
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
      this.completedTasks = JSON.parse(storedDataCompleted || '[]');
    }
  }
}
