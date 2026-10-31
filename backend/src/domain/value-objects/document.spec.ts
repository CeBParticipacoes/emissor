import { Document } from './document.js';

describe('Document', () => {
  it('aceita um CPF válido e identifica o tipo', () => {
    const document = Document.parse('529.982.247-25');

    expect(document.digits).toBe('52998224725');
    expect(document.type).toBe('CPF');
  });

  it('aceita um CNPJ válido e identifica o tipo', () => {
    const document = Document.parse('11.222.333/0001-81');

    expect(document.digits).toBe('11222333000181');
    expect(document.type).toBe('CNPJ');
  });

  it('rejeita um CPF com dígitos verificadores inválidos', () => {
    expect(() => Document.parse('529.982.247-24')).toThrow(
      'Documento inválido',
    );
  });

  it('rejeita um CNPJ com dígitos verificadores inválidos', () => {
    expect(() => Document.parse('11.222.333/0001-80')).toThrow(
      'Documento inválido',
    );
  });

  it('rejeita um CPF com todos os dígitos iguais', () => {
    expect(() => Document.parse('111.111.111-11')).toThrow(
      'Documento inválido',
    );
  });

  it('rejeita um CNPJ com todos os dígitos iguais', () => {
    expect(() => Document.parse('11.111.111/1111-11')).toThrow(
      'Documento inválido',
    );
  });

  it('rejeita documentos com quantidade incorreta de dígitos', () => {
    expect(() => Document.parse('123456789')).toThrow(
      'Documento inválido',
    );
  });
});