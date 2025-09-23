import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone', standalone: true })
export class PhonePipe implements PipeTransform {
  transform(numero: string): string {
    if (!numero) return '';

    // Remove tudo que não for número
    const numeroLimpo = numero.replace(/\D/g, '');

    // Define o formato do celular
    const formato = '(00) 00000-0000';
    let resultado = '';
    let indice = 0;

    for (let i = 0; i < formato.length; i++) {
      if (formato[i] === '0') {
        if (indice < numeroLimpo.length) {
          resultado += numeroLimpo[indice];
          indice++;
        } else {
          resultado += ' ';
        }
      } else {
        resultado += formato[i];
      }
    }

    return resultado.trim();
  }
}