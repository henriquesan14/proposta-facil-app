import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'btn-pesquisar',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './btn-pesquisar.component.html',
  styleUrl: './btn-pesquisar.component.css'
})
export class BtnPesquisarComponent {
  
}
