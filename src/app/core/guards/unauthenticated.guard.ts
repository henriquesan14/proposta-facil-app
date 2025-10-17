import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { LocalstorageService } from "../../shared/services/local-storage.service";

export const UnauthenticadedGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    const storageService = inject(LocalstorageService);
    const router = inject(Router);
    if (storageService.getUserStorage()) {
        storageService.user$.subscribe(user => {
            user?.role == 'AdminSystem' ? router.navigateByUrl('/tenants/list') : router.navigateByUrl('/users/list');
            return false;
        })
    }
    return true;
}