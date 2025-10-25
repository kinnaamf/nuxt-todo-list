export interface Task {
  id: string;
  title: string;
  done: boolean;
  originalTitle?: string;
  editable?: boolean;
}

export interface NewTask {
  title: string;
  done: boolean;
}