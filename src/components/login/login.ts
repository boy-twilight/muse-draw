export interface LoginForm {
  account: string;
  password: string;
}

export interface FormItem {
  label: string;
  field: string;
  placeholder: string;
  showColon?: boolean;
  hideAsterisk?: boolean;
}
