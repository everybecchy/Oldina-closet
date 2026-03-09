-- Seed de categorias iniciais para a Ondina Closet
-- Execute este script no banco de dados para criar as categorias

INSERT INTO "Category" (id, name, slug, description, "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid()::text, 'Aneis', 'aneis', 'Aneis elegantes para todas as ocasioes', NOW(), NOW()),
  (gen_random_uuid()::text, 'Colares', 'colares', 'Colares sofisticados e delicados', NOW(), NOW()),
  (gen_random_uuid()::text, 'Brincos', 'brincos', 'Brincos que realcam sua beleza', NOW(), NOW()),
  (gen_random_uuid()::text, 'Pulseiras', 'pulseiras', 'Pulseiras para todos os estilos', NOW(), NOW()),
  (gen_random_uuid()::text, 'Conjuntos', 'conjuntos', 'Conjuntos harmoniosos e exclusivos', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
