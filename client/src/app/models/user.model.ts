export interface UserInterface {
  id: string;
  name: string;
  surname: string;
  token: string;
  userId: string;
  querys: Array<{ query: string; _id: string }>;
  searchQuerys: Array<{ query: string; _id: string }>;
}
