/*!
 * Landing Black Friday — Ecofoodpack
 * config.js — tudo o que muda com frequência fica aqui: imagens, links, data da campanha e produtos.
 * Nenhuma lógica de interface neste arquivo.
 */
window.EFP_CONFIG = (function () {
  'use strict';
  /* =========================================================
     IMAGENS — links das imagens (vazio = marcador tracejado)
     ========================================================= */
  var IMG = {
    logo:     'https://i.postimg.cc/xCkhhdWJ/LOGO-ECOFOODPACK-HORIZONTAL-BRANCA.png',
    selo:     'https://i.postimg.cc/d1G5PTtH/SELO-BLACK-FRIDAY-ECOFOOD-2026.png',
    caixa:    'https://i.postimg.cc/Mp1tNQP7/caixa-transparente.png',
    kraft:    'https://i.postimg.cc/t47nVQPF/papel-kraft-4k.jpg',
    banner:   'https://i.postimg.cc/FHpqTK98/image.png',
    chef:     'https://i.postimg.cc/J7P21Z59/magnific-colocar-essa-personagem-com-roupa-de-chefe-de-cozi-11162.png',
    mult1000: 'https://images.tcdn.com.br/img/img_prod/808246/embalagem_1000ml_promo_100_unidades_1_20261116171119_f2afa06e647a.jpg',
    mult850:  'https://images.tcdn.com.br/img/img_prod/808246/embalagem_850ml_promo_100_unidades_1_20261116171053_aaddb08a7477.jpg',
    sacola:   'https://images.tcdn.com.br/img/img_prod/808246/sacola_de_papel_kraft_02_natal_50_unidades_1_20251212084321_3a5132fcdcbc.png',
    etiqueta: 'https://images.tcdn.com.br/img/img_prod/808246/etiqueta_lacre_de_seguranca_g_verde_1000_unidades_507_1_ea51248da7ec69d4459277e37cecc881_20220127120407.jpg',
    hamburguer: 'https://images.tcdn.com.br/img/img_prod/808246/embalagem_para_hamburguer_p_kraft_light_200_unidades_503_3_d9b994850457d79ab621d93fffb5c6f4_20220127120436.jpg',
    pouch:    'https://images.tcdn.com.br/img/img_prod/808246/copia_saco_stand_up_pouch_com_visor_16_x_23_x_6cm_50_unidades_1100_8_daf26de377cb1a8b6a6ed7731f8d1292.jpg'
  };

  /* =========================================================
     LINKS — WhatsApp e páginas de compra
     ========================================================= */
  var WHATSAPP = 'https://wa.me/5521960142258';
  var FIM_CAMPANHA = '2026-12-04T23:59:59-03:00';

  /* =========================================================
     PRODUTOS
     ========================================================= */
  var LOJA = 'https://www.ecofoodpack.com.br/';
  var OUTLET = LOJA + 'outlet';

  /* Personagens da família (aparecem no hero, origem, superpoderes, oferta e "próximo") */
  var PRODUTOS = [
    { nick: 'O Grandão', name: 'Embalagem 1000ml promo | 100 unidades', img: 'mult1000', de: 'R$ 159,00', por: 'R$ 97,00', pix: 'R$ 95,06', link: LOJA + 'outlet/embalagem-1000ml-promo-100-unidades',
      origin: 'Aquele delivery em família de sexta pode virar uma experiência inesquecível. Imagina! Seu prato chegando lindo no destino! Como se fosse no restaurante. Com a Ecofood isso é possível.',
      supers: [['CABE TUDO', 'Mil mililitros para a refeição completa, sem segunda embalagem.'], ['FECHA FIRME', 'Tampa que segura o caminho todo até a porta do cliente.'], ['CARA DE RESTAURANTE', 'Apresentação que valoriza qualquer prato do seu cardápio.']] },
    { nick: 'O Certinho', name: 'Embalagem 850ml promo | 100 unidades', img: 'mult850', de: 'R$ 135,00', por: 'R$ 82,00', pix: 'R$ 80,36', link: LOJA + 'outlet/embalagem-850ml-promo-100-unidades',
      origin: 'Prato individual pedia pote individual. Nem gigante meio vazio, nem apertado que amassa tudo. Ele chegou e resolveu em silêncio. Ninguém comenta. Todo mundo repete o pedido.',
      supers: [['NA MEDIDA', 'Tamanho certo para porções individuais e executivos.'], ['EMPILHA E VAI', 'Organiza a bancada e a bag de entrega.'], ['MESMA FAMÍLIA', 'Combina com a de 1000ml para uma linha padronizada.']] },
    { nick: 'A Parceira', name: 'Sacola de papel kraft 02 Natal - 50 unidades', img: 'sacola', de: 'R$ 75,00', por: 'R$ 52,50', pix: 'R$ 51,45', link: LOJA + 'sacolas/sacola-kraft/sacola-de-papel-kraft-02-natal-50-unidades',
      origin: 'O pedido saiu perfeito da cozinha. Faltava chegar inteiro e com clima de festa. Ela entra no fim da história, leva tudo junto e entrega como se fosse presente de Natal.',
      supers: [['EDIÇÃO NATAL', 'Estampa natalina que deixa o pedido com clima de festa.'], ['KRAFT NATURAL', 'Visual sustentável que combina com a proposta Ecofoodpack.'], ['VITRINE DA MARCA', 'A primeira coisa que o cliente vê quando o pedido chega.']] },
    { nick: 'O Guardião', name: 'Etiqueta lacre de segurança G verde - 1000 unidades', img: 'etiqueta', de: 'R$ 102,00', por: 'R$ 63,00', pix: 'R$ 61,74', link: LOJA + 'acessorios-e-lacres/etiqueta-lacre-de-seguranca-g-verde-1000-unidades',
      origin: 'O cliente quer ter certeza de que ninguém mexeu no pedido. O dono do delivery também. Ele fica ali, quietinho, fechando a sacola, e só sai de cena quando o cliente rasga com vontade.',
      supers: [['LACRE SEGURO', 'Mostra ao cliente que o pedido chegou intacto.'], ['MIL DE UMA VEZ', '1000 unidades prontas para a correria do balcão.'], ['VERDE OU VERMELHA', 'Duas cores para combinar com a identidade do seu delivery.']] }
  ];

  /* PRODUTOS QUE NUNCA DEVEM APARECER NA GRADE (mesmo que estejam na categoria). Use um trecho do link. */
  var EXCLUIR = ['embalagem-para-quiche-natural'];

  /* Lista de RESERVA: a grade é montada automaticamente a partir da categoria /outlet da loja.
     Esta lista só aparece se a leitura automática falhar (ex.: teste local no VS Code). */
  /* Todos os produtos da Black Friday (grade "Toda a família em oferta")
     Preços copiados da loja em 18/11/2026 — se mudarem na Tray, atualize aqui. */
  var GRADE = [
    ['Embalagem 1000ml promo | 100 unidades', 'R$ 159,00', 'R$ 97,00', 'R$ 95,06', 'outlet/embalagem-1000ml-promo-100-unidades', 'embalagem_1000ml_promo_100_unidades_1_20261116171119_f2afa06e647a.jpg'],
    ['Embalagem 850ml promo | 100 unidades', 'R$ 135,00', 'R$ 82,00', 'R$ 80,36', 'outlet/embalagem-850ml-promo-100-unidades', 'embalagem_850ml_promo_100_unidades_1_20261116171053_aaddb08a7477.jpg'],
    ['Sacola de papel kraft 02 Natal - 50 unidades', 'R$ 75,00', 'R$ 52,50', 'R$ 51,45', 'sacolas/sacola-kraft/sacola-de-papel-kraft-02-natal-50-unidades', 'sacola_de_papel_kraft_02_natal_50_unidades_1_20251212084321_3a5132fcdcbc.png'],
    ['Etiqueta lacre de segurança G verde - 1000 unidades', 'R$ 102,00', 'R$ 63,00', 'R$ 61,74', 'acessorios-e-lacres/etiqueta-lacre-de-seguranca-g-verde-1000-unidades', 'etiqueta_lacre_de_seguranca_g_verde_1000_unidades_507_1_ea51248da7ec69d4459277e37cecc881_20220127120407.jpg'],
    ['Etiqueta lacre de segurança G vermelha - 1000 unidades', 'R$ 102,00', 'R$ 63,00', 'R$ 61,74', 'acessorios-e-lacres/etiqueta-lacre-de-seguranca-g-vermelha-1000-unidades', 'etiqueta_lacre_de_seguranca_g_vermelha_1000_unidades_509_1_c7bb773ff17bfb8be93726100936d916_20220127120410.jpg'],
    ['Saco Stand Up Pouch com visor - 14 x 20 x 6cm | 50 unidades', 'R$ 38,00', 'R$ 30,40', 'R$ 29,79', 'sacos-e-sacolas/saco-stand-up-pouch-com-visor-14-x-20-x-6cm-50-unidades', 'saco_stand_up_pouch_com_visor_14_x_20_x_6cm_50_unidades_1098_5_49030c4ac048f08688ee3c464b5c06cf.jpg'],
    ['Saco Stand Up Pouch com visor - 16 x 23 x 6cm | 50 unidades', 'R$ 47,00', 'R$ 37,60', 'R$ 36,85', 'sacos-e-sacolas/copia-saco-stand-up-pouch-com-visor-16-x-23-x-6cm-50-unidades', 'copia_saco_stand_up_pouch_com_visor_16_x_23_x_6cm_50_unidades_1100_8_daf26de377cb1a8b6a6ed7731f8d1292.jpg'],
    ['Saco Stand Up Pouch com visor - 18 x 26 x 6cm | 50 unidades', 'R$ 72,00', 'R$ 57,60', 'R$ 56,45', 'sacos-e-sacolas/saco-stand-up-pouch-com-visor-18-x-26-x-6cm-50-unidades', 'saco_stand_up_pouch_com_visor_18_x_26_x_6cm_50_unidades_1102_8_0227ce5f5ff90844bd3f0ea718e197e6.jpg'],
    ['Embalagem para Hambúrguer P kraft | 200 unidades', 'R$ 117,00', 'R$ 99,45', 'R$ 97,46', 'linha-secos/embalagem-para-hamburguer-p-kraft-light-200-unidades', 'embalagem_para_hamburguer_p_kraft_light_200_unidades_503_3_d9b994850457d79ab621d93fffb5c6f4_20220127120436.jpg'],
    ['Embalagem delivery kraft 12 x 12 x 6,5cm | 250 unidades', 'R$ 212,50', 'R$ 180,60', 'R$ 176,99', 'linha-secos/linha-kraft-para-alimentos-secos/embalagem-delivery-kraft-12-x-12-x-6-5cm-250-unidades', 'embalagem_delivery_kraft_12_x_12_x_65cm_250_unida_1_20251211134838_f574b956bc14.png'],
    ['Embalagem delivery kraft 13,5 x 8 x 5,5 | 500 unidades', 'R$ 272,00', 'R$ 231,20', 'R$ 226,58', 'linha-secos/linha-kraft-para-alimentos-secos/embalagem-delivery-kraft-13-5-x-8-x-5-5-500-unidades', 'embalagem_delivery_kraft_13_5_x_8_x_5_5_500_unidades_1284_3_83af9f76b69ac5d2b3d53d3a49b9bf0b.jpg'],
    ['Embalagem delivery kraft 9 x 5 x 10,7cm | 500 unidades', 'R$ 187,00', 'R$ 158,95', 'R$ 155,77', 'linha-secos/linha-kraft-para-alimentos-secos/embalagem-delivery-kraft-9-x-5-x-10-7cm-500-unidades', 'embalagem_delivery_kraft_9_x_5_x_107cm_500_unidad_1_20251211143312_d3d7a9352af6.png'],
    ['Sacola premium Natal P - 10 unidades', 'R$ 39,50', 'R$ 33,50', 'R$ 32,83', 'sacolas/sacola-premium-natal-p-10-unidades', 'sacola_premium_natal_p_10_unidades_1041_4_050a6e216cf1fe0ab337ecf07d7c0c15.jpg'],
    ['Embalagem kraft para batata M | 500 unidades', 'R$ 144,50', 'R$ 122,80', 'R$ 120,34', 'linha-secos/linha-kraft-para-alimentos-secos/embalagem-kraft-para-batata-m-500-unidades', 'embalagem_kraft_para_batata_m_500_unidades_1_20251211145739_24beab62caa1.png'],
    ['Embalagem para batata G | 500 unidades', 'R$ 170,00', 'R$ 144,50', 'R$ 141,61', 'linha-secos/linha-kraft-para-alimentos-secos/embalagem-para-batata-g-500-unidades-1294', 'embalagem_para_batata_g_500_unidades_1_20251211150711_627021f69fe1.png'],
    ['Gaveta com luva PP preta | 200 unidades', '', 'R$ 378,00', 'R$ 370,44', 'linha-preta/gaveta-com-luva-delivery-pp-100-unidades', 'gaveta_com_luva_pp_200_unidades_1_20251211155706_0d002026467d.png'],
    ['Gaveta com luva PP branca | 200 unidades', 'R$ 378,00', 'R$ 264,50', 'R$ 259,21', 'linha-branca/gaveta-com-luva-delivery-100-unidades', 'gaveta_com_luva_pp_200_unidades_1_20251211155517_033342a3b1f9.png'],
    ['Sacola mini natal M 02 - 50 unidades', 'R$ 196,00', 'R$ 98,00', 'R$ 96,04', 'presentes/mini-sacolas/sacola-mini-natal-m-02-50-unidades', 'sacola_mini_natal_m_02_50_unidades_1432_1_9a09f614e54f16c0676bf0db9e908a31.jpg']

  ].map(function (g) { return { name: g[0], de: g[1], por: g[2], pix: g[3], link: LOJA + g[4], src: g[5] ? 'https://images.tcdn.com.br/img/img_prod/808246/' + g[5] : '' }; });

  /* Selos da campanha (PNG) que caem no rodapé */
  var SELOS = [
    { src: 'https://i.postimg.cc/QCY0ZFzt/selo-bf-10-outlet.png', txt: 'Outlet' },
    { src: 'https://i.postimg.cc/3J6nLDpj/selo-bf-11-mega-oferta.png', txt: 'Mega oferta' },
    { src: 'https://i.postimg.cc/JhCK8Vpc/selo-bf-12-super-desconto.png', txt: 'Super desconto' },
    { src: 'https://i.postimg.cc/Y9bxQ4MY/selo-bf-14-imperdivel.png', txt: 'Imperdível' },
    { src: 'https://i.postimg.cc/Y2D39mdT/selo-bf-15-aproveite.png', txt: 'Aproveite' },
    { src: 'https://i.postimg.cc/NfWk8vvv/selo-bf-16-garanta-ja.png', txt: 'Garanta já' },
    { src: 'https://i.postimg.cc/VNF9cSSZ/selo-bf-17-estoque-limitado.png', txt: 'Estoque limitado' },
    { src: 'https://i.postimg.cc/tTShYLNx/selo-bf-18-desconto-pix.png', txt: 'Desconto no Pix' },
    { src: 'https://i.postimg.cc/Gt4vYqMt/selo-bf-20-preco-baixo.png', txt: 'Preço baixo' },
    { src: 'https://i.postimg.cc/wMnLkLPN/selo-bf-28-qualidade.png', txt: 'Qualidade' }
  ];

  return {
    IMG: IMG, WHATSAPP: WHATSAPP, FIM_CAMPANHA: FIM_CAMPANHA, LOJA: LOJA, OUTLET: OUTLET,
    PRODUTOS: PRODUTOS, EXCLUIR: EXCLUIR, GRADE: GRADE, SELOS: SELOS
  };
})();
