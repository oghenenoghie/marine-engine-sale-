-- Seed taxonomy + sample stock, mirroring lib/data/*.seed.ts for local dev.
insert into brands (id, slug, name, blurb) values
  ('11111111-1111-1111-1111-111111111101', 'wartsila', 'Wärtsilä', 'Finnish four-stroke medium-speed diesel and dual-fuel engines.'),
  ('11111111-1111-1111-1111-111111111102', 'man', 'MAN', 'Two- and four-stroke marine propulsion from MAN Energy Solutions.'),
  ('11111111-1111-1111-1111-111111111103', 'mak', 'MaK', 'German medium-speed diesel engines, part of the Caterpillar Marine family.'),
  ('11111111-1111-1111-1111-111111111104', 'deutz', 'Deutz', 'Compact high-speed diesels for auxiliary and propulsion duty.'),
  ('11111111-1111-1111-1111-111111111105', 'caterpillar', 'Caterpillar', 'Heavy-duty diesel engines and genuine reman parts.');

insert into engine_models (id, slug, brand_id, name, bore, stroke, config, power_range) values
  ('22222222-2222-2222-2222-222222222201', 'vasa-32', '11111111-1111-1111-1111-111111111101', 'VASA 32', '320 mm', '350 mm', 'In-line 6-9', '2280–4830 kW'),
  ('22222222-2222-2222-2222-222222222202', 'w46', '11111111-1111-1111-1111-111111111101', 'W46', '460 mm', '580 mm', 'In-line / V', '5220–20700 kW'),
  ('22222222-2222-2222-2222-222222222203', 'l20', '11111111-1111-1111-1111-111111111101', 'L20', '200 mm', '280 mm', 'In-line 4-9', '760–1710 kW'),
  ('22222222-2222-2222-2222-222222222204', 'l27-38', '11111111-1111-1111-1111-111111111102', 'L27/38', '270 mm', '380 mm', 'In-line 5-9', '1020–2340 kW'),
  ('22222222-2222-2222-2222-222222222205', '8m32', '11111111-1111-1111-1111-111111111103', '8M32', '320 mm', '480 mm', 'In-line 8', '3840 kW'),
  ('22222222-2222-2222-2222-222222222206', 'bf6m1015', '11111111-1111-1111-1111-111111111104', 'BF6M1015', '132 mm', '145 mm', 'V8', '300–520 kW'),
  ('22222222-2222-2222-2222-222222222207', '3516', '11111111-1111-1111-1111-111111111105', '3516', '170 mm', '215 mm', 'V16', '1865–2525 kW');

insert into part_categories (id, slug, name) values
  ('33333333-3333-3333-3333-333333333301', 'cylinder-head', 'Cylinder head'),
  ('33333333-3333-3333-3333-333333333302', 'crankshaft', 'Crankshaft'),
  ('33333333-3333-3333-3333-333333333303', 'turbocharger', 'Turbocharger'),
  ('33333333-3333-3333-3333-333333333304', 'cylinder-liner', 'Cylinder liner'),
  ('33333333-3333-3333-3333-333333333305', 'complete-engine', 'Complete engine'),
  ('33333333-3333-3333-3333-333333333306', 'fuel-pump', 'Fuel pump'),
  ('33333333-3333-3333-3333-333333333307', 'piston', 'Piston');

insert into drawings (id, slug, title, model_id, asset_key, hotspots) values
  (
    '44444444-4444-4444-4444-444444444401',
    'wartsila-vasa-32-exploded',
    'Wärtsilä VASA 32 — cylinder unit exploded view',
    '22222222-2222-2222-2222-222222222201',
    'drydock/drawings/vasa32-exploded',
    '[
      {"id":"01","x":0.5,"y":0.16,"label":"Cylinder head","stockItemId":null,"inStock":true},
      {"id":"02","x":0.72,"y":0.28,"label":"Turbocharger","stockItemId":null,"inStock":true},
      {"id":"03","x":0.5,"y":0.55,"label":"Cylinder liner","stockItemId":null,"inStock":true},
      {"id":"04","x":0.3,"y":0.42,"label":"Fuel injection pump","stockItemId":null,"inStock":false},
      {"id":"05","x":0.5,"y":0.86,"label":"Crankshaft","stockItemId":null,"inStock":false}
    ]'::jsonb
  );

insert into stock_items
  (sku, slug, title, type, brand_id, model_id, category_id, condition, poa, price, qty, status, oem_numbers, specs, images, drawing_id, description)
values
  ('WRT-32-CH-014', 'wrt-32-ch-014-cylinder-head-wartsila-vasa-32', 'Cylinder head — Wärtsilä VASA 32 / 32LN', 'part',
    '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333301',
    'Reconditioned', false, 8450, 3, 'available', array['131 011', 'PAAE201050'],
    '{"Bore":"320 mm","Material":"Cast iron"}'::jsonb,
    '[{"publicId":"drydock/seed/cylinder-head-1","alt":"Reconditioned VASA 32 cylinder head","isPrimary":true,"type":"photo"}]'::jsonb,
    '44444444-4444-4444-4444-444444444401', 'Fully reconditioned to OEM tolerances, pressure-tested, valve seats renewed.'),
  ('WRT-46-CRK-002', 'wrt-46-crk-002-crankshaft-wartsila-46', 'Crankshaft — Wärtsilä 46', 'part',
    '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', '33333333-3333-3333-3333-333333333302',
    'Used', true, null, 1, 'reserved', array['165 200'],
    '{"Journals":"9","Weight":"5100 kg"}'::jsonb,
    '[{"publicId":"drydock/seed/crankshaft-1","alt":"Wärtsilä 46 crankshaft","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null),
  ('MAN-L2732-TC', 'man-l2732-tc-turbocharger-man-l27-38', 'Turbocharger — MAN L27/38', 'part',
    '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222204', '33333333-3333-3333-3333-333333333303',
    'Reconditioned', false, 12900, 2, 'available', array['NR29/S', '51.09100-7566'],
    '{"Type":"Axial"}'::jsonb,
    '[{"publicId":"drydock/seed/turbo-1","alt":"MAN L27/38 turbocharger","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null),
  ('DEU-BF6M-ENG', 'deu-bf6m-eng-complete-engine-deutz-bf6m1015', 'Complete engine — Deutz BF6M1015', 'engine',
    '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222206', '33333333-3333-3333-3333-333333333305',
    'Used', false, 18500, 1, 'available', array[]::text[],
    '{"Power":"440 kW","RPM":"1800","Hours":"6200"}'::jsonb,
    '[{"publicId":"drydock/seed/engine-1","alt":"Deutz BF6M1015 complete engine","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null),
  ('MAK-8M32-LNR', 'mak-8m32-lnr-cylinder-liner-mak-8m32', 'Cylinder liner — MaK 8M32', 'part',
    '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333304',
    'New', false, 2150, 8, 'available', array['3.1.05.01.010'],
    '{"Bore":"320 mm"}'::jsonb,
    '[{"publicId":"drydock/seed/liner-1","alt":"MaK 8M32 cylinder liner","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null),
  ('CAT-3516-PST', 'cat-3516-pst-piston-assembly-caterpillar-3516', 'Piston assembly — Caterpillar 3516', 'part',
    '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222207', '33333333-3333-3333-3333-333333333307',
    'Reconditioned', false, 1680, 6, 'expected', array['7C-6208'],
    '{}'::jsonb,
    '[{"publicId":"drydock/seed/piston-1","alt":"Caterpillar 3516 piston assembly","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null),
  ('WRT-20-FP-007', 'wrt-20-fp-007-fuel-injection-pump-wartsila-20', 'Fuel injection pump — Wärtsilä 20', 'part',
    '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', '33333333-3333-3333-3333-333333333306',
    'Used', true, null, 0, 'sold', array['213 025'],
    '{}'::jsonb,
    '[{"publicId":"drydock/seed/fuel-pump-1","alt":"Wärtsilä 20 fuel injection pump","isPrimary":true,"type":"photo"}]'::jsonb,
    null, null);
