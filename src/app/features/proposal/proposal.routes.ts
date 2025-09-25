import { Route } from "@angular/router";
import { ListProposal } from "./list-proposal/list-proposal";

export const PROPOSAL_ROUTES: Route[] = [
  {path: 'list', component: ListProposal},
];