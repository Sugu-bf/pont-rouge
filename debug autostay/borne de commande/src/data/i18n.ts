export type Lang = 'fr' | 'en' | 'de'

export const LANGUAGES: { id: Lang; label: string; flag: string }[] = [
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'en', label: 'English', flag: '🇬🇧' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

const translations = {
  // Welcome
  'welcome.title': {
    fr: 'Bienvenue chez',
    en: 'Welcome to',
    de: 'Willkommen bei',
  },
  'welcome.touch': {
    fr: 'Touchez pour commander',
    en: 'Touch to order',
    de: 'Berühren zum Bestellen',
  },
  'welcome.homemade': {
    fr: 'Fait Maison',
    en: 'Homemade',
    de: 'Hausgemacht',
  },

  // Order type
  'orderType.title': {
    fr: 'Où mangez-vous\naujourd\'hui ?',
    en: 'Where will you be\neating today?',
    de: 'Wo möchten Sie\nheute essen?',
  },
  'orderType.eatIn': {
    fr: 'Sur Place',
    en: 'Eat In',
    de: 'Hier Essen',
  },
  'orderType.takeOut': {
    fr: 'À Emporter',
    en: 'Take Out',
    de: 'Mitnehmen',
  },

  // Menu
  'menu.search': {
    fr: 'Rechercher',
    en: 'Search',
    de: 'Suchen',
  },
  'menu.popular': {
    fr: 'Populaires',
    en: 'Popular',
    de: 'Beliebt',
  },

  // Categories
  'cat.burgers': {
    fr: 'Burgers',
    en: 'Burgers',
    de: 'Burgers',
  },
  'cat.burgers-speciaux': {
    fr: 'Spéciaux',
    en: 'Specials',
    de: 'Spezial',
  },
  'cat.bowls-tasty': {
    fr: 'Bowls Tasty',
    en: 'Tasty Bowls',
    de: 'Tasty Bowls',
  },
  'cat.bowls-healthy': {
    fr: 'Bowls Healthy',
    en: 'Healthy Bowls',
    de: 'Healthy Bowls',
  },
  'cat.extras': {
    fr: 'Extras',
    en: 'Extras',
    de: 'Extras',
  },
  'cat.enfant': {
    fr: 'Enfants',
    en: 'Kids',
    de: 'Kinder',
  },
  'cat.desserts': {
    fr: 'Desserts',
    en: 'Desserts',
    de: 'Desserts',
  },
  'cat.boissons': {
    fr: 'Boissons',
    en: 'Drinks',
    de: 'Getränke',
  },

  // Product modal
  'product.protein': {
    fr: 'Choix de la viande',
    en: 'Choose your protein',
    de: 'Wählen Sie Ihr Fleisch',
  },
  'product.required': {
    fr: 'Obligatoire',
    en: 'Required',
    de: 'Pflicht',
  },
  'product.beef': {
    fr: 'Boeuf',
    en: 'Beef',
    de: 'Rind',
  },
  'product.chicken': {
    fr: 'Poulet',
    en: 'Chicken',
    de: 'Hähnchen',
  },
  'product.veggie': {
    fr: 'Végétarien',
    en: 'Vegetarian',
    de: 'Vegetarisch',
  },
  'product.vegan': {
    fr: 'Vegan',
    en: 'Vegan',
    de: 'Vegan',
  },
  'product.withFrites': {
    fr: 'Avec frites',
    en: 'With fries',
    de: 'Mit Pommes',
  },
  'product.withoutFrites': {
    fr: 'Sans frites',
    en: 'Without fries',
    de: 'Ohne Pommes',
  },
  'product.supplements': {
    fr: 'Suppléments',
    en: 'Extras',
    de: 'Extras',
  },
  'product.chooseSauce': {
    fr: 'Choisissez votre sauce',
    en: 'Choose your sauce',
    de: 'Wählen Sie Ihre Sauce',
  },
  'product.noSauce': {
    fr: 'Sans sauce',
    en: 'No sauce',
    de: 'Ohne Sauce',
  },
  'product.apply': {
    fr: 'Ajouter',
    en: 'Add to Order',
    de: 'Hinzufügen',
  },

  // Upsell
  'upsell.frites.title': {
    fr: 'Envie de frites ?',
    en: 'Want fries with that?',
    de: 'Pommes dazu?',
  },
  'upsell.frites.subtitle': {
    fr: 'Ajoutez des frites à votre commande',
    en: 'Add fries to your order',
    de: 'Pommes zur Bestellung hinzufügen',
  },
  'upsell.boisson.title': {
    fr: 'Une boisson ?',
    en: 'Add a drink?',
    de: 'Ein Getränk dazu?',
  },
  'upsell.boisson.subtitle': {
    fr: 'Complétez votre repas',
    en: 'Complete your meal',
    de: 'Vervollständigen Sie Ihre Mahlzeit',
  },
  'upsell.yes': {
    fr: 'Oui, j\'en veux !',
    en: 'Yes, please!',
    de: 'Ja, bitte!',
  },
  'upsell.no': {
    fr: 'Non merci',
    en: 'No thanks',
    de: 'Nein danke',
  },

  // Cart
  'cart.title': {
    fr: 'Ma\nCommande',
    en: 'My\nOrder',
    de: 'Meine\nBestellung',
  },
  'cart.eatIn': {
    fr: 'Sur Place',
    en: 'Eat In',
    de: 'Hier Essen',
  },
  'cart.takeOut': {
    fr: 'À Emporter',
    en: 'Take Out',
    de: 'Mitnehmen',
  },
  'cart.empty': {
    fr: 'Votre panier est vide',
    en: 'Your cart is empty',
    de: 'Ihr Warenkorb ist leer',
  },
  'cart.total': {
    fr: 'Total',
    en: 'Total',
    de: 'Gesamt',
  },
  'cart.checkout': {
    fr: 'Commander',
    en: 'Checkout',
    de: 'Bestellen',
  },
  'cart.edit': {
    fr: 'Modifier',
    en: 'Edit',
    de: 'Bearbeiten',
  },
  'cart.remove': {
    fr: 'Supprimer',
    en: 'Remove',
    de: 'Entfernen',
  },
  'cart.back': {
    fr: 'Retour',
    en: 'Back',
    de: 'Zurück',
  },
  'cart.addMore': {
    fr: 'Ajouter des articles',
    en: 'Add more items',
    de: 'Weitere Artikel',
  },

  // Checkout
  'checkout.title': {
    fr: 'Paiement',
    en: 'Payment',
    de: 'Bezahlung',
  },
  'checkout.card': {
    fr: 'Carte Bancaire',
    en: 'Card Payment',
    de: 'Kartenzahlung',
  },
  'checkout.cardDesc': {
    fr: 'Visa, Mastercard',
    en: 'Visa, Mastercard',
    de: 'Visa, Mastercard',
  },
  'checkout.twint': {
    fr: 'TWINT',
    en: 'TWINT',
    de: 'TWINT',
  },
  'checkout.twintDesc': {
    fr: 'Paiement mobile Suisse',
    en: 'Swiss mobile payment',
    de: 'Schweizer Mobile Payment',
  },
  'checkout.counter': {
    fr: 'En Caisse',
    en: 'At Counter',
    de: 'An der Kasse',
  },
  'checkout.counterDesc': {
    fr: 'Payer au comptoir',
    en: 'Pay at the counter',
    de: 'An der Kasse bezahlen',
  },
  'checkout.summary': {
    fr: 'Récapitulatif',
    en: 'Summary',
    de: 'Zusammenfassung',
  },
  'checkout.tva': {
    fr: 'TVA',
    en: 'VAT',
    de: 'MwSt',
  },
  'checkout.paymentMethod': {
    fr: 'Mode de paiement',
    en: 'Payment method',
    de: 'Zahlungsart',
  },

  // Confirmation
  'confirm.thanks': {
    fr: 'Merci !',
    en: 'Thank you!',
    de: 'Danke!',
  },
  'confirm.orderPlaced': {
    fr: 'Votre commande a été enregistrée',
    en: 'Your order has been placed',
    de: 'Ihre Bestellung wurde aufgegeben',
  },
  'confirm.orderNumber': {
    fr: 'Numéro de commande',
    en: 'Order number',
    de: 'Bestellnummer',
  },
  'confirm.eatInMsg': {
    fr: 'Installez-vous, votre commande arrive',
    en: 'Please take a seat, your order is on its way',
    de: 'Bitte setzen Sie sich, Ihre Bestellung kommt',
  },
  'confirm.takeOutMsg': {
    fr: 'Récupérez votre commande au comptoir',
    en: 'Pick up your order at the counter',
    de: 'Holen Sie Ihre Bestellung an der Theke ab',
  },
  'confirm.printing': {
    fr: 'Votre ticket est en cours d\'impression',
    en: 'Your receipt is being printed',
    de: 'Ihr Beleg wird gedruckt',
  },
  'confirm.newOrder': {
    fr: 'Touchez pour une nouvelle commande',
    en: 'Touch to start a new order',
    de: 'Berühren für eine neue Bestellung',
  },
} as const

type TranslationKey = keyof typeof translations

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.['fr'] ?? key
}
