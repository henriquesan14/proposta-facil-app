import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LocalstorageService } from '../services/local-storage.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input('hasRole') permittedRole: string = '';
  private sub!: Subscription;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private localStorageService: LocalstorageService
  ) { }

  ngOnInit() {
    this.sub = this.localStorageService.user$.subscribe(user => {
      const userRole = user?.tenantImpersonate ? 'AdminTenant' : user?.role;
      const hasPermission = userRole === this.permittedRole;

      if (hasPermission) {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', '');
      } else {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}