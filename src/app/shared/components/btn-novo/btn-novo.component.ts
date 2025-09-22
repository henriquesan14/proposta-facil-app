import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'btn-novo',
  standalone: true,
  imports: [NzIconModule, NzButtonModule],
  templateUrl: './btn-novo.component.html',
  styleUrl: './btn-novo.component.css'
})
export class BtnNovoComponent {
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();
  @Input({required: true}) title!: string;

  novo(){
    this.clickEvent.emit();
  }
}
