
ALTER TABLE solicitacoes MODIFY COLUMN funcionario_responsavel_id BIGINT NULL;

ALTER TABLE solicitacoes ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE solicitacoes ADD COLUMN valor_pago DECIMAL(10,2) NULL;
ALTER TABLE solicitacoes ADD COLUMN pagamento_divergente BOOLEAN NOT NULL DEFAULT FALSE;
