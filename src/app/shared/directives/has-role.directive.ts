import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { LocalstorageService } from '../services/local-storage.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input('hasRole') permittedRole: string = '';

  constructor(private elementRef: ElementRef, private renderer: Renderer2, private localStorageService: LocalstorageService) { }

  ngOnInit() {
    const userRole = this.localStorageService.getUserStorage().role;

    const hasPermission: boolean = userRole == this.permittedRole;

    if (!hasPermission) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
      this.renderer.removeChild(this.elementRef.nativeElement.parentElement, this.elementRef.nativeElement);
    }
  }
}