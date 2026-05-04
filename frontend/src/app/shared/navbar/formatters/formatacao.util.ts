export function formatarMoedaBR(valor: number | string | null | undefined): string {
  const numero = normalizarNumero(valor);

  if (numero === null) {
    return '—';
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatarDataBR(valor: string | Date | null | undefined, comHora = false): string {
  if (!valor) {
    return '—';
  }

  const data = valor instanceof Date ? valor : criarDataLocal(valor);

  if (Number.isNaN(data.getTime())) {
    return '—';
  }

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(comHora ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function formatarCpf(valor: string | null | undefined): string {
  const digitos = somenteDigitos(valor);

  if (digitos.length !== 11) {
    return valor || '—';
  }

  return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatarTelefone(valor: string | null | undefined): string {
  const digitos = somenteDigitos(valor);

  if (digitos.length === 10) {
    return digitos.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  if (digitos.length === 11) {
    return digitos.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return valor || '—';
}

function criarDataLocal(valor: string): Date {
  const apenasData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);

  if (apenasData) {
    const [, ano, mes, dia] = apenasData;
    return new Date(Number(ano), Number(mes) - 1, Number(dia));
  }

  return new Date(valor);
}

function somenteDigitos(valor: string | null | undefined): string {
  return (valor || '').replace(/\D/g, '');
}

function normalizarNumero(valor: number | string | null | undefined): number | null {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }

  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : null;
  }

  const limpo = valor
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();

  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : null;
}