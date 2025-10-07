import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tag-ativo',
  imports: [NzTagModule, CommonModule],
  templateUrl: './tag-ativo.html',
  styleUrl: './tag-ativo.css'
})
export class TagAtivo {
  @Input({required: true}) status = false;
}
