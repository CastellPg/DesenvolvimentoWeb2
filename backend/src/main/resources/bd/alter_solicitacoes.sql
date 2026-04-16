
ALTER TABLE solicitacoes MODIFY COLUMN funcionario_responsavel_id BIGINT NULL;

ALTER TABLE solicitacoes ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;
