import { Route } from "@angular/router";
import { ListUsersComponent } from "./list-users/list-users.component";

export const USER_ROUTES: Route[] = [
  {path: 'list', component: ListUsersComponent},
];