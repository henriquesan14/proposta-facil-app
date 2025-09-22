import { Component, EventEmitter, Output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'btn-limpar',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './btn-limpar.component.html',
  styleUrl: './btn-limpar.component.css'
})
export class BtnLimparComponent {
  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();

  limpar(){
    this.clickEvent.emit();
  }
}
