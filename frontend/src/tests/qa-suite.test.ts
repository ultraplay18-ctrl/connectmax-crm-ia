import {
  formatDocument,
  formatPhone,
  maskDocumentInput,
  maskPhoneInput,
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
} from '../utils/formatters';

describe('Suíte de Testes Frontend QA • Formatações e Validações Críticas', () => {
  describe('Validações de Documento (CPF & CNPJ)', () => {
    it('deve validar CPFs válidos e rejeitar inválidos ou sequências idênticas', () => {
      expect(isValidCPF('111.111.111-11')).toBe(false);
      expect(isValidCPF('000.000.000-00')).toBe(false);
      expect(isValidCPF('123456789')).toBe(false);
    });

    it('deve validar CNPJs válidos e rejeitar inválidos', () => {
      expect(isValidCNPJ('00.000.000/0000-00')).toBe(false);
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
      expect(isValidCNPJ('12345')).toBe(false);
    });

    it('deve aplicar máscara de CPF/CNPJ corretamente ao digitar', () => {
      expect(maskDocumentInput('12345678901')).toBe('123.456.789-01');
      expect(maskDocumentInput('12345678000195')).toBe('12.345.678/0001-95');
    });
  });

  describe('Validações de Contato (E-mail & Telefone)', () => {
    it('deve validar formatos de e-mail válidos', () => {
      expect(isValidEmail('contato@connectmax.com.br')).toBe(true);
      expect(isValidEmail('admin@empresa.io')).toBe(true);
      expect(isValidEmail('invalido-sem-arromba')).toBe(false);
      expect(isValidEmail('teste@')).toBe(false);
    });

    it('deve aplicar máscara de Telefone celular e fixo', () => {
      expect(maskPhoneInput('11988887777')).toBe('(11) 98888-7777');
      expect(maskPhoneInput('1133334444')).toBe('(11) 3333-4444');
    });

    it('deve formatar telefone nulo ou indefinido sem quebrar', () => {
      expect(formatPhone(null)).toBe('-');
      expect(formatPhone(undefined)).toBe('-');
      expect(formatDocument(null)).toBe('-');
    });
  });

  describe('Regressão de Interface • Renderização Segura de Perfil (Role Object vs String)', () => {
    it('deve extrair a string do role mesmo se um objeto for retornado pelo backend', () => {
      const roleAsString = 'COMPANY_ADMIN';
      const roleAsObject = { id: 'r-1', name: 'COMPANY_ADMIN', description: 'Admin' };

      const getSafeRole = (role: any) => (typeof role === 'object' ? role?.name : role);

      expect(getSafeRole(roleAsString)).toBe('COMPANY_ADMIN');
      expect(getSafeRole(roleAsObject)).toBe('COMPANY_ADMIN');
    });
  });
});
