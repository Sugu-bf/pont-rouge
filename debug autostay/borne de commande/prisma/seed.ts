import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.auditLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.supplement.deleteMany()
  await prisma.sauce.deleteMany()
  await prisma.site.deleteMany()
  await prisma.adminUser.deleteMany()

  // ═══════════════════════════════════════
  // ADMIN USERS
  // ═══════════════════════════════════════
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.adminUser.create({
    data: {
      email: 'admin@fryburger.ch',
      password: adminPassword,
      name: 'Admin FryBurger',
      role: 'admin',
    },
  })
  console.log('✅ Admin user created (admin@fryburger.ch / admin123)')

  // ═══════════════════════════════════════
  // SITES — avec infos légales et TVA
  // ═══════════════════════════════════════
  const sites = [
    { slug: 'bulle', name: 'FryBurger Bulle', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue de la Gare 12', postalCode: '1630', city: 'Bulle', phone: '+41 26 000 00 00', email: 'bulle@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'fribourg', name: 'FryBurger Fribourg', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue de Romont 5', postalCode: '1700', city: 'Fribourg', phone: '+41 26 000 00 01', email: 'fribourg@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'lausanne', name: 'FryBurger Lausanne', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Avenue de la Gare 8', postalCode: '1003', city: 'Lausanne', phone: '+41 21 000 00 00', email: 'lausanne@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'geneve', name: 'FryBurger Genève', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue du Mont-Blanc 15', postalCode: '1201', city: 'Genève', phone: '+41 22 000 00 00', email: 'geneve@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'bern', name: 'FryBurger Bern', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Marktgasse 20', postalCode: '3011', city: 'Bern', phone: '+41 31 000 00 00', email: 'bern@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'neuchatel', name: 'FryBurger Neuchâtel', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue du Seyon 3', postalCode: '2000', city: 'Neuchâtel', phone: '+41 32 000 00 00', email: 'neuchatel@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'montreux', name: 'FryBurger Montreux', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Grand-Rue 45', postalCode: '1820', city: 'Montreux', phone: '+41 21 000 00 01', email: 'montreux@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'sion', name: 'FryBurger Sion', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue de Lausanne 10', postalCode: '1950', city: 'Sion', phone: '+41 27 000 00 00', email: 'sion@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'yverdon', name: 'FryBurger Yverdon', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue du Lac 7', postalCode: '1400', city: 'Yverdon', phone: '+41 24 000 00 00', email: 'yverdon@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
    { slug: 'vevey', name: 'FryBurger Vevey', legalName: 'FryBurger SA', cheNumber: 'CHE-000.000.000', address: 'Rue du Simplon 22', postalCode: '1800', city: 'Vevey', phone: '+41 21 000 00 02', email: 'vevey@fryburger.ch', tvaSurPlace: 0.081, tvaEmporter: 0.026 },
  ]
  for (const site of sites) {
    await prisma.site.create({ data: site })
  }
  console.log(`✅ ${sites.length} sites created`)

  // ═══════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════
  const categories = [
    { slug: 'burgers', name: 'Burgers', nameFr: 'Burgers', nameEn: 'Burgers', nameDe: 'Burgers', icon: '🍔', description: 'Boeuf, poulet ou végétarien - Fait maison', sortOrder: 1 },
    { slug: 'burgers-speciaux', name: 'Spéciaux', nameFr: 'Spéciaux', nameEn: 'Specials', nameDe: 'Spezial', icon: '⭐', description: 'Nos burgers signature', sortOrder: 2 },
    { slug: 'bowls-tasty', name: 'Bowls Tasty', nameFr: 'Bowls Tasty', nameEn: 'Tasty Bowls', nameDe: 'Tasty Bowls', icon: '🍟', description: "Fry' Bowl - Fait maison", sortOrder: 3 },
    { slug: 'bowls-healthy', name: 'Bowls Healthy', nameFr: 'Bowls Healthy', nameEn: 'Healthy Bowls', nameDe: 'Healthy Bowls', icon: '🥗', description: 'Healthy - Frais et équilibré', sortOrder: 4 },
    { slug: 'extras', name: 'Extras', nameFr: 'Extras', nameEn: 'Extras', nameDe: 'Extras', icon: '🍗', description: 'Tenders, nuggets, wings & plus', sortOrder: 5 },
    { slug: 'enfant', name: 'Enfants', nameFr: 'Enfants', nameEn: 'Kids', nameDe: 'Kinder', icon: '👶', description: 'Junior Gourmet - Avec cadeau', sortOrder: 6 },
    { slug: 'desserts', name: 'Desserts', nameFr: 'Desserts', nameEn: 'Desserts', nameDe: 'Desserts', icon: '🍦', description: 'Glaces & douceurs', sortOrder: 7 },
    { slug: 'boissons', name: 'Boissons', nameFr: 'Boissons', nameEn: 'Drinks', nameDe: 'Getränke', icon: '🥤', description: 'Soft drinks & eaux', sortOrder: 8 },
  ]

  const catMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat })
    catMap[cat.slug] = created.id
  }
  console.log(`✅ ${categories.length} categories created`)

  // ═══════════════════════════════════════
  // SUPPLEMENTS
  // ═══════════════════════════════════════
  const supplements = [
    { slug: 'cheddar', name: 'Supplément cheddar', price: 3.10, sortOrder: 1 },
    { slug: 'gruyere-raclette', name: 'Supplément gruyère ou raclette', price: 3.40, sortOrder: 2 },
    { slug: 'chevre', name: 'Supplément chèvre', price: 3.50, sortOrder: 3 },
    { slug: 'lard', name: 'Supplément lard', price: 3.30, sortOrder: 4 },
    { slug: 'double-viande', name: 'Double boeuf/poulet/végé', price: 5.60, sortOrder: 5 },
  ]
  for (const s of supplements) {
    await prisma.supplement.create({ data: s })
  }
  console.log(`✅ ${supplements.length} supplements created`)

  // ═══════════════════════════════════════
  // SAUCES
  // ═══════════════════════════════════════
  const sauces = [
    { slug: 'cocktail', name: 'Cocktail maison', price: 0.60, sortOrder: 1 },
    { slug: 'sweet-spicy', name: 'Sweet & Spicy', price: 0.60, sortOrder: 2 },
    { slug: 'teriyaki', name: 'Teriyaki', price: 0.60, sortOrder: 3 },
    { slug: 'huile-olive', name: "Huile d'olive & Balsamique", price: 0.60, sortOrder: 4 },
  ]
  for (const s of sauces) {
    await prisma.sauce.create({ data: s })
  }
  console.log(`✅ ${sauces.length} sauces created`)

  // ═══════════════════════════════════════
  // PRODUCTS
  // ═══════════════════════════════════════
  const products = [
    // BURGERS
    { slug: 'classique', name: 'Classique', description: 'Sauce cocktail, salade, tomate, oignon caramélisé', price: 9.90, priceWithFrites: 14.40, categorySlug: 'burgers', hasProteinChoice: true, veganAvailable: true, hasSupplements: true, sortOrder: 1 },
    { slug: 'mexicaine', name: 'Mexicaine', description: 'Sauce à la mexicaine, salade, tomate, oignon caramélisé', price: 12.90, priceWithFrites: 17.40, categorySlug: 'burgers', hasProteinChoice: true, veganAvailable: true, hasSupplements: true, sortOrder: 2 },
    { slug: 'satay-thai', name: 'Satay Thai', description: 'Sauce satay thai, salade, tomate, oignon caramélisé', price: 12.90, priceWithFrites: 17.40, categorySlug: 'burgers', hasProteinChoice: true, veganAvailable: true, hasSupplements: true, sortOrder: 3 },
    { slug: 'extra-hot-spicy', name: 'Extra Hot & Spicy', description: 'Sauce extra forte maison, salade, tomate, oignons, cheddar', price: 13.90, priceWithFrites: 18.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, sortOrder: 4 },
    { slug: 'raclette-gourmet', name: 'Raclette Gourmet', description: "Fromage raclette, sauce à l'ancienne, salade, cornichons", price: 15.90, priceWithFrites: 20.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, isGourmet: true, sortOrder: 5 },
    { slug: 'chevrette', name: 'Chevrette', description: 'Fromage de chèvre, salade, tomate, oignon caramélisé', price: 15.90, priceWithFrites: 20.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, isGourmet: true, sortOrder: 6 },
    { slug: 'cheeseburger', name: 'Cheeseburger', description: 'Cheddar, sauce cocktail, salade, tomate, oignon caramélisé', price: 11.90, priceWithFrites: 16.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, sortOrder: 7 },
    { slug: 'a-lancienne', name: "À l'Ancienne", description: "Moutarde à l'ancienne, salade, tomate, oignon caramélisé", price: 12.80, priceWithFrites: 17.30, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, sortOrder: 8 },
    { slug: 'gruyere-gourmet', name: 'Gruyère Gourmet', description: 'Fromage gruyère, sauce tartare, bacon grillé, salade rucola', price: 15.90, priceWithFrites: 20.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, isGourmet: true, sortOrder: 9 },
    { slug: 'californian-gourmet', name: 'Californian Gourmet', description: 'Bacon grillé, omelette avec maïs, cheddar, oignons rouges, sauce barbecue', price: 16.90, priceWithFrites: 21.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, isGourmet: true, sortOrder: 10 },
    { slug: 'double-cheese-bacon', name: 'Double Cheese Bacon', description: '2x Steak, bacon, cheddar, sauce cocktail, salade, tomate, oignon caramélisé', price: 19.90, priceWithFrites: 24.40, categorySlug: 'burgers', hasProteinChoice: true, hasSupplements: true, isNew: true, sortOrder: 11 },

    // BURGERS SPÉCIAUX
    { slug: 'saumon-burger', name: 'Saumon Burger', description: 'Filet de saumon, sauce tartare maison, cheddar, rucola', price: 15.90, priceWithFrites: 20.40, categorySlug: 'burgers-speciaux', hasSupplements: true, sortOrder: 1 },
    { slug: 'tender-burger', name: 'Tender Burger', description: 'Poulet croustillant, sauce tender, oignon caramélisé, salade, fromage', price: 11.90, priceWithFrites: 16.40, categorySlug: 'burgers-speciaux', hasSupplements: true, sortOrder: 2 },
    { slug: 'philly-burger', name: 'Philly Burger', description: "Lamelles d'entrecôte de boeuf, poivron, oignons rouges, gruyère, raclette, sauce à l'ancienne", price: 19.90, priceWithFrites: 24.40, categorySlug: 'burgers-speciaux', hasSupplements: true, isGourmet: true, sortOrder: 3 },

    // BOWLS TASTY
    { slug: 'nugget-bowl', name: 'Nugget Bowl', description: 'Chicken Nuggets, frites, sauce fromagère', price: 12.90, categorySlug: 'bowls-tasty', hasSauceChoice: true, includesFrites: true, sortOrder: 1 },
    { slug: 'tender-bowl', name: 'Tender Bowl', description: 'Chicken Tenders, frites, sauce fromagère, sauce maison', price: 13.90, categorySlug: 'bowls-tasty', hasSauceChoice: true, includesFrites: true, sortOrder: 2 },
    { slug: 'poulet-tasty', name: 'Poulet Tasty', description: 'Filet de poulet grillé, frites, sauce fromagère, sauce maison', price: 14.90, categorySlug: 'bowls-tasty', hasSauceChoice: true, includesFrites: true, sortOrder: 3 },
    { slug: 'vegetarien-bowl', name: 'Végétarien Bowl', description: 'Steak végétarien maison, frites, sauce fromagère, sauce maison', price: 14.90, categorySlug: 'bowls-tasty', hasSauceChoice: true, includesFrites: true, sortOrder: 4 },
    { slug: 'philly-bowl', name: 'Philly Bowl', description: "Lamelle d'entrecôte de boeuf, poivron grillé, oignon rouge grillé, frites, raclette, gruyère, sauce fromagère, sauce maison", price: 23.90, categorySlug: 'bowls-tasty', hasSauceChoice: true, includesFrites: true, isGourmet: true, sortOrder: 5 },

    // BOWLS HEALTHY
    { slug: 'saumon-bowl', name: 'Saumon Bowl', description: 'Saumon grillé, avocat, riz noir, lentilles vertes, quinoa, salade mixte', price: 18.90, categorySlug: 'bowls-healthy', hasSauceChoice: true, sortOrder: 1 },
    { slug: 'crevette-bowl', name: 'Crevette Bowl', description: 'Crevette, avocat, riz noir, lentilles vertes, quinoa, salade mixte', price: 18.90, categorySlug: 'bowls-healthy', hasSauceChoice: true, sortOrder: 2 },
    { slug: 'poulet-healthy', name: 'Poulet Healthy', description: 'Filet de poulet grillé, avocat, riz noir, lentilles vertes, quinoa, salade mixte', price: 17.90, categorySlug: 'bowls-healthy', hasSauceChoice: true, sortOrder: 3 },
    { slug: 'vegan-bowl', name: 'Vegan Bowl', description: 'Steak de légumes mixte maison, avocat, riz noir, lentilles vertes, quinoa, salade mixte', price: 18.90, categorySlug: 'bowls-healthy', hasSauceChoice: true, veganAvailable: true, sortOrder: 4 },

    // EXTRAS
    { slug: 'salade-poulet', name: 'Salade de Poulet', description: 'Suprême de poulet, salade verte, fromage de gruyère', price: 8.90, priceWithFrites: 13.40, categorySlug: 'extras', sortOrder: 1 },
    { slug: 'chicken-tenders', name: 'Chicken Tenders 3 pièces', description: 'Tenders de poulet croustillants faits maison', price: 9.90, priceWithFrites: 14.40, categorySlug: 'extras', sortOrder: 2 },
    { slug: 'chicken-nuggets', name: 'Chicken Nuggets 6 pièces', description: 'Nuggets de poulet croustillants', price: 8.70, priceWithFrites: 13.20, categorySlug: 'extras', sortOrder: 3 },
    { slug: 'chicken-wings', name: 'Chicken Wings 6 pièces', description: 'Ailes de poulet croustillantes', price: 9.90, priceWithFrites: 14.40, categorySlug: 'extras', sortOrder: 4 },
    { slug: 'perche-panier', name: 'Perche au Panier', description: 'Filets de perche croustillants', price: 13.90, priceWithFrites: 18.40, categorySlug: 'extras', sortOrder: 5 },
    { slug: 'portion-frites', name: 'Portion de Frites', description: 'Frites fraîches et croustillantes', price: 6.90, categorySlug: 'extras', includesFrites: true, sortOrder: 6 },

    // ENFANT
    { slug: 'junior-nuggets', name: 'Junior Gourmet Nuggets', description: 'Chicken Nuggets avec frite, Capri Sun et cadeau', price: 9.40, categorySlug: 'enfant', includesFrites: true, sortOrder: 1 },
    { slug: 'junior-cheeseburger', name: 'Junior Gourmet Cheeseburger', description: 'Cheeseburger avec frite, Capri Sun et cadeau', price: 9.40, categorySlug: 'enfant', includesFrites: true, sortOrder: 2 },
    { slug: 'junior-classique', name: 'Junior Gourmet Classique', description: 'Hamburger classique avec frite, Capri Sun et cadeau', price: 9.40, categorySlug: 'enfant', includesFrites: true, sortOrder: 3 },

    // DESSERTS
    { slug: 'mousse-mangue', name: 'Mousse de Mangue', description: 'Mousse de mangue fait maison', price: 4.50, categorySlug: 'desserts', sortOrder: 1 },
    { slug: 'donut', name: 'Donut', description: 'Donut frais', price: 2.90, categorySlug: 'desserts', sortOrder: 2 },
    { slug: 'glace-choco-cornet', name: 'Glace Choco (cornet)', description: 'Glace chocolat en cornet - Suisse', price: 3.80, categorySlug: 'desserts', sortOrder: 3 },
    { slug: 'glace-fraise-cornet', name: 'Glace Fraise (cornet)', description: 'Glace fraise en cornet - Suisse', price: 3.80, categorySlug: 'desserts', sortOrder: 4 },
    { slug: 'glace-vanille-cornet', name: 'Glace Vanille (cornet)', description: 'Glace vanille en cornet - Suisse', price: 3.80, categorySlug: 'desserts', sortOrder: 5 },
    { slug: 'glace-choquello', name: 'Glace Choquello', description: 'Glace Choquello - Suisse', price: 3.00, categorySlug: 'desserts', sortOrder: 6 },
    { slug: 'glace-fusee', name: 'Glace Fusée', description: 'Glace Fusée - Suisse', price: 2.00, categorySlug: 'desserts', sortOrder: 7 },
    { slug: 'glace-almond', name: 'Glace Almond', description: 'Glace amande - Suisse', price: 3.80, categorySlug: 'desserts', sortOrder: 8 },
    { slug: 'glace-choco-bol', name: 'Glace Choco (bol)', description: 'Glace chocolat en bol - Suisse', price: 4.00, categorySlug: 'desserts', sortOrder: 9 },
    { slug: 'glace-caramel-bol', name: 'Glace Caramel (bol)', description: 'Glace caramel en bol - Suisse', price: 4.00, categorySlug: 'desserts', sortOrder: 10 },
    { slug: 'glace-cafe-bol', name: 'Glace Café (bol)', description: 'Glace café en bol - Suisse', price: 4.00, categorySlug: 'desserts', sortOrder: 11 },

    // BOISSONS
    { slug: 'coca-cola', name: 'Coca-Cola', description: 'Coca-Cola 33cl', price: 3.90, categorySlug: 'boissons', sortOrder: 1 },
    { slug: 'coca-zero', name: 'Coca-Cola Zero', description: 'Coca-Cola Zero 33cl', price: 3.90, categorySlug: 'boissons', sortOrder: 2 },
    { slug: 'fanta', name: 'Fanta', description: 'Fanta Orange 33cl', price: 3.90, categorySlug: 'boissons', sortOrder: 3 },
    { slug: 'sprite', name: 'Sprite', description: 'Sprite 33cl', price: 3.90, categorySlug: 'boissons', sortOrder: 4 },
    { slug: 'ice-tea', name: 'Ice Tea', description: 'Ice Tea pêche 33cl', price: 3.90, categorySlug: 'boissons', sortOrder: 5 },
    { slug: 'eau-minerale', name: 'Eau Minérale', description: 'Eau minérale 50cl', price: 3.50, categorySlug: 'boissons', sortOrder: 6 },
    { slug: 'eau-gazeuse', name: 'Eau Gazeuse', description: 'Eau gazeuse 50cl', price: 3.50, categorySlug: 'boissons', sortOrder: 7 },
    { slug: 'capri-sun', name: 'Capri Sun', description: 'Capri Sun 20cl', price: 2.50, categorySlug: 'boissons', sortOrder: 8 },
  ]

  for (const p of products) {
    const { categorySlug, ...data } = p
    await prisma.product.create({
      data: {
        ...data,
        categoryId: catMap[categorySlug],
      },
    })
  }
  console.log(`✅ ${products.length} products created`)

  console.log('\n🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
