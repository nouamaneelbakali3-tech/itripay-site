/* Prototype copy for the three directions. Draft — moves to src/strings/*.json in phase B. */
window.ITRI = {
  en: {
    dir: 'ltr',
    skip: 'Skip to content',
    langLabel: 'Language',
    starLabel: 'The ItriPay star: four points, four values',
    spinLabel: 'Spin the star',
    nav: { how: 'How it works', features: 'Features', pricing: 'Pricing', faq: 'FAQ' },
    cta: 'Join the waitlist',
    cta2: 'See how it works',
    hero: {
      eyebrow: 'Itri means star',
      title: 'Your phone is<br>the terminal.',
      sub: 'ItriPay turns the Android phone a Moroccan merchant already owns into a payment terminal: tap to get paid, a digital credit carnet, daily sales figures. 49 MAD a month, no extra device.',
      note: 'Pre-launch. We are looking for a licensed payment partner.'
    },
    valuesHead: { eyebrow: 'Four points, four values', title: 'One star. Four promises.', sub: 'Every point of the star stands for something we hold ourselves to. Touch one.' },
    values: [
      { name: 'Connection', line: 'Merchant and customer, one tap apart.', body: 'The customer taps a card or phone on the merchant’s phone. The receipt goes out on WhatsApp. The app speaks Darija, Tamazight, French and English.' },
      { name: 'Speed', line: 'Enter the amount. Hand over the phone. Done.', body: 'Nothing to plug in, nothing to pair. A sale is three steps, and the day’s total is always current.' },
      { name: 'Security', line: 'The customer sees the amount before they tap.', body: 'Staff accounts with their own permissions. Every payment and refund on the record. Money will move only through a licensed payment partner.' },
      { name: 'Innovation', line: 'The carnet, without the carnet.', body: 'A digital credit notebook with SMS reminders, sales reports that export to PDF or Excel, receipts with your own logo.' }
    ],
    problem: {
      eyebrow: 'The problem', title: 'A terminal is one more thing to rent.',
      sub: 'A neighbourhood shop runs on a phone, a cash drawer and a notebook. Card payments ask for a fourth thing.',
      items: [
        ['device', 'The box on the counter', 'A payment terminal is a second device to rent, charge and keep track of.'],
        ['book', 'The paper carnet', 'Who owes what lives in a notebook that can be lost, and nobody adds up the total.'],
        ['chart', 'The numbers nobody has', 'At closing time, the day’s sales are a guess.']
      ]
    },
    how: {
      eyebrow: 'How it works', title: 'Three steps. One phone.',
      steps: [
        ['Enter the amount', 'Type the price on the keypad, the way you would on a calculator.'],
        ['Hand over the phone', 'The customer sees the amount and taps a card or phone on yours.'],
        ['Done', 'A receipt, printed or shared on WhatsApp. The sale is already in your records.']
      ]
    },
    features: {
      eyebrow: 'Features', title: 'Everything a shop needs. Nothing it doesn’t.',
      items: [
        ['tap', 'Tap to pay', 'The phone the merchant already owns takes the payment.'],
        ['book', 'Credit carnet', 'Each customer, each debt, each payment against it, with SMS reminders sent when you decide.'],
        ['chart', 'Sales analytics', 'Daily, monthly and yearly reports. Export to PDF or Excel.'],
        ['receipt', 'Your own receipt', 'Your logo and shop name, printed or shared on WhatsApp.'],
        ['users', 'Staff accounts', 'Add employees and choose what each one may do.'],
        ['globe', 'Four languages', 'Darija, Tamazight, French and English, chosen on the first screen.']
      ]
    },
    who: {
      eyebrow: 'Who it is for', title: 'Made for the shop on the corner.',
      items: [
        ['shop', 'Neighbourhood grocers', 'The hanout that already keeps a credit notebook for half the street.'],
        ['cup', 'Cafés and snack bars', 'Small tickets, many of them, all day.'],
        ['basket', 'Market and street vendors', 'No counter, no socket, just a phone in your pocket.'],
        ['scissors', 'Small shops and services', 'Hairdressers, tailors, repair shops: anyone who gets paid in person.']
      ]
    },
    pricing: {
      eyebrow: 'Pricing', title: 'One plan. Everything included.',
      cur: 'MAD', per: '/ month', nodevice: 'No extra device',
      nodeviceSub: 'The phone you own is the terminal.',
      rule: 'Free if you don’t reach 500 MAD revenue in 30 days.',
      how: 'Activate for free, use everything. If your revenue exceeds 500 MAD in 30 days, 49 MAD is deducted automatically.',
      incTitle: 'All features included',
      inc: ['Transactions: all payments and refunds', 'Sales and analytics: daily, monthly and yearly reports', 'Export PDF / Excel', 'Multi-user: employees with permissions', 'Credit: track debts, SMS alerts', 'Custom receipt with your logo and shop name']
    },
    partners: {
      eyebrow: 'Partners', title: 'We are looking for a licensed payment partner.',
      body: 'ItriPay is the merchant’s app: the terminal on the phone, the carnet, the reports. To move money it needs a licensed payment institution or acquiring bank behind it. We are not licensed ourselves, and we do not claim to be.',
      points: ['A working Android app in four languages', 'Built around the neighbourhood shop, not adapted to it', 'Open to payment institutions, acquirers and banks in Morocco'],
      cta: 'Talk to us about partnering'
    },
    name: {
      eyebrow: 'The name', title: 'Itri means star.',
      body: 'ⵉⵜⵔⵉ, itri, is the Tamazight word for star. Long before maps, traders crossed this country by the stars. We took the name for the same reason: a fixed point a merchant can count on.',
      foot: 'Four points, four promises.'
    },
    faq: {
      eyebrow: 'FAQ', title: 'Questions, answered plainly.',
      items: [
        ['Do I need a card reader or any extra device?', 'No. ItriPay runs on an Android phone with NFC. There is nothing else to buy or rent.'],
        ['How much does it cost?', '49 MAD a month, everything included. It is free in any 30 days where your revenue stays under 500 MAD.'],
        ['Can I take payments with it today?', 'Not yet. ItriPay is pre-launch and we are looking for a licensed payment partner. Join the waitlist and we will write to you when it opens.'],
        ['Is ItriPay a bank or a payment institution?', 'No. ItriPay is software. Payments will be processed by a licensed partner.'],
        ['Which languages does the app speak?', 'Darija, Tamazight, French and English.'],
        ['What is the credit carnet?', 'The notebook of who owes what, kept on the phone: each customer, each debt, each payment, and a total that is always current.']
      ]
    },
    join: {
      eyebrow: 'Waitlist and contact', title: 'Be there when it opens.',
      body: 'Merchants who want in early, payment partners, investors: write to us here. We answer from the same inbox.',
      alt: 'Or email us directly:',
      segLabel: 'What would you like to do?', seg: ['Join the waitlist', 'Contact us'],
      fName: 'Your name', fEmail: 'Your email', fMsg: 'Message', optional: 'optional',
      send: ['Join the waitlist', 'Send'],
      invalid: 'Please enter your name and a valid email address.',
      invalidMsg: 'Please write a message too.',
      proto: 'Prototype: nothing was sent. The live form posts to Web3Forms.'
    },
    footer: { tag: 'The payment terminal in your pocket.', note: '© 2026 ItriPay. Made in Morocco.', contact: 'Contact' },
    app: {
      shop: 'Épicerie Al Amal', cur: 'DH', amount: 'Amount', pay: 'Pay now', nfc: 'Hold the card or phone near', paid: 'Paid',
      receipt: 'Receipt', date: 'Date', dateV: '16 Sep, 14:32', method: 'Method', methodV: 'Tap to pay', ref: 'Ref.', thanks: 'Thank you for your visit',
      credit: 'Credit', total: 'Total', sms: 'SMS reminder sent',
      c: [['Y. Bennani', 'Bread, milk · today', '86.00'], ['F. Ouazzani', 'Paid 150.00 · yesterday', '240.50'], ['K. Idrissi', 'Gas bottle · 12 Sep', '55.00'], ['S. Tazi', 'Groceries · 9 Sep', '461.00']]
    }
  },

  fr: {
    dir: 'ltr',
    skip: 'Aller au contenu',
    langLabel: 'Langue',
    starLabel: 'L’étoile ItriPay : quatre pointes, quatre valeurs',
    spinLabel: 'Faire tourner l’étoile',
    nav: { how: 'Fonctionnement', features: 'Fonctionnalités', pricing: 'Tarif', faq: 'FAQ' },
    cta: 'Rejoindre la liste d’attente',
    cta2: 'Voir le fonctionnement',
    hero: {
      eyebrow: 'Itri veut dire étoile',
      title: 'Votre téléphone<br>est le terminal.',
      sub: 'ItriPay transforme le téléphone Android que le commerçant marocain possède déjà en terminal de paiement : paiement sans contact, carnet de crédit numérique, chiffres de vente du jour. 49 MAD par mois, sans appareil en plus.',
      note: 'Avant lancement. Nous cherchons un partenaire de paiement agréé.'
    },
    valuesHead: { eyebrow: 'Quatre pointes, quatre valeurs', title: 'Une étoile. Quatre promesses.', sub: 'Chaque pointe de l’étoile porte un engagement. Touchez-en une.' },
    values: [
      { name: 'Connexion', line: 'Commerçant et client, à un geste l’un de l’autre.', body: 'Le client approche sa carte ou son téléphone de celui du commerçant. Le reçu part sur WhatsApp. L’application parle darija, amazigh, français et anglais.' },
      { name: 'Rapidité', line: 'Saisir le montant. Tendre le téléphone. C’est fait.', body: 'Rien à brancher, rien à appairer. Une vente tient en trois gestes, et le total du jour est toujours à jour.' },
      { name: 'Sécurité', line: 'Le client voit le montant avant de payer.', body: 'Des comptes employés avec leurs propres droits. Chaque paiement et chaque remboursement est conservé. L’argent ne circulera que par un partenaire de paiement agréé.' },
      { name: 'Innovation', line: 'Le carnet, sans le carnet.', body: 'Un carnet de crédit numérique avec rappels SMS, des rapports de vente exportables en PDF ou Excel, des reçus à votre logo.' }
    ],
    problem: {
      eyebrow: 'Le problème', title: 'Un terminal, c’est une chose de plus à louer.',
      sub: 'Une épicerie de quartier tourne avec un téléphone, une caisse et un carnet. Le paiement par carte en demande une quatrième.',
      items: [
        ['device', 'Le boîtier sur le comptoir', 'Un terminal de paiement est un second appareil à louer, à charger et à surveiller.'],
        ['book', 'Le carnet papier', 'Qui doit quoi tient dans un cahier qui peut se perdre, et personne ne fait le total.'],
        ['chart', 'Les chiffres que personne n’a', 'À la fermeture, les ventes du jour sont une estimation.']
      ]
    },
    how: {
      eyebrow: 'Fonctionnement', title: 'Trois gestes. Un téléphone.',
      steps: [
        ['Saisir le montant', 'Tapez le prix sur le clavier, comme sur une calculatrice.'],
        ['Tendre le téléphone', 'Le client voit le montant et approche sa carte ou son téléphone du vôtre.'],
        ['C’est fait', 'Un reçu, imprimé ou partagé sur WhatsApp. La vente est déjà dans vos comptes.']
      ]
    },
    features: {
      eyebrow: 'Fonctionnalités', title: 'Tout ce qu’il faut à un commerce. Rien de trop.',
      items: [
        ['tap', 'Paiement sans contact', 'Le téléphone que le commerçant possède déjà encaisse le paiement.'],
        ['book', 'Carnet de crédit', 'Chaque client, chaque dette, chaque versement, avec des rappels SMS envoyés quand vous le décidez.'],
        ['chart', 'Statistiques de vente', 'Rapports quotidiens, mensuels et annuels. Export PDF ou Excel.'],
        ['receipt', 'Votre propre reçu', 'Votre logo et le nom de votre commerce, imprimé ou partagé sur WhatsApp.'],
        ['users', 'Comptes employés', 'Ajoutez des employés et choisissez ce que chacun peut faire.'],
        ['globe', 'Quatre langues', 'Darija, amazigh, français et anglais, au choix dès le premier écran.']
      ]
    },
    who: {
      eyebrow: 'Pour qui', title: 'Pensé pour le commerce du coin.',
      items: [
        ['shop', 'Épiceries de quartier', 'Le hanout qui tient déjà un carnet de crédit pour la moitié de la rue.'],
        ['cup', 'Cafés et snacks', 'De petits tickets, nombreux, toute la journée.'],
        ['basket', 'Marchands de souk et ambulants', 'Ni comptoir ni prise : juste un téléphone dans la poche.'],
        ['scissors', 'Petits commerces et services', 'Coiffeurs, tailleurs, réparateurs : tous ceux qui sont payés en personne.']
      ]
    },
    pricing: {
      eyebrow: 'Tarif', title: 'Une formule. Tout est inclus.',
      cur: 'MAD', per: '/ mois', nodevice: 'Sans appareil en plus',
      nodeviceSub: 'Votre téléphone est le terminal.',
      rule: 'Gratuit si vous n’atteignez pas 500 MAD de chiffre d’affaires en 30 jours.',
      how: 'Activez gratuitement, utilisez tout. Si votre chiffre d’affaires dépasse 500 MAD en 30 jours, 49 MAD sont prélevés automatiquement.',
      incTitle: 'Toutes les fonctionnalités incluses',
      inc: ['Transactions : tous les paiements et remboursements', 'Ventes et statistiques : rapports quotidiens, mensuels et annuels', 'Export PDF / Excel', 'Multi-utilisateurs : employés avec droits', 'Crédit : suivi des dettes, alertes SMS', 'Reçu personnalisé à votre logo et au nom du commerce']
    },
    partners: {
      eyebrow: 'Partenaires', title: 'Nous cherchons un partenaire de paiement agréé.',
      body: 'ItriPay est l’application du commerçant : le terminal sur le téléphone, le carnet, les rapports. Pour faire circuler l’argent, il lui faut un établissement de paiement agréé ou une banque acquéreur. Nous ne sommes pas agréés nous-mêmes, et nous ne prétendons pas l’être.',
      points: ['Une application Android fonctionnelle en quatre langues', 'Conçue autour du commerce de quartier, pas adaptée après coup', 'Ouverts aux établissements de paiement, acquéreurs et banques au Maroc'],
      cta: 'Parlons partenariat'
    },
    name: {
      eyebrow: 'Le nom', title: 'Itri veut dire étoile.',
      body: 'ⵉⵜⵔⵉ, itri, est le mot amazigh pour étoile. Bien avant les cartes, les marchands traversaient ce pays en suivant les étoiles. Nous avons choisi ce nom pour la même raison : un point fixe sur lequel un commerçant peut compter.',
      foot: 'Quatre pointes, quatre promesses.'
    },
    faq: {
      eyebrow: 'FAQ', title: 'Des réponses simples.',
      items: [
        ['Faut-il un lecteur de carte ou un autre appareil ?', 'Non. ItriPay fonctionne sur un téléphone Android équipé du NFC. Rien d’autre à acheter ni à louer.'],
        ['Combien ça coûte ?', '49 MAD par mois, tout inclus. C’est gratuit sur toute période de 30 jours où votre chiffre d’affaires reste sous 500 MAD.'],
        ['Puis-je encaisser dès aujourd’hui ?', 'Pas encore. ItriPay est en pré-lancement et nous cherchons un partenaire de paiement agréé. Rejoignez la liste d’attente : nous vous écrirons à l’ouverture.'],
        ['ItriPay est-il une banque ou un établissement de paiement ?', 'Non. ItriPay est un logiciel. Les paiements seront traités par un partenaire agréé.'],
        ['Quelles langues parle l’application ?', 'Darija, amazigh, français et anglais.'],
        ['Qu’est-ce que le carnet de crédit ?', 'Le cahier de qui doit quoi, tenu sur le téléphone : chaque client, chaque dette, chaque versement, et un total toujours à jour.']
      ]
    },
    join: {
      eyebrow: 'Liste d’attente et contact', title: 'Soyez là à l’ouverture.',
      body: 'Commerçants qui veulent en être dès le début, partenaires de paiement, investisseurs : écrivez-nous ici. Nous répondons depuis la même boîte.',
      alt: 'Ou écrivez-nous directement :',
      segLabel: 'Que souhaitez-vous faire ?', seg: ['Liste d’attente', 'Nous contacter'],
      fName: 'Votre nom', fEmail: 'Votre e-mail', fMsg: 'Message', optional: 'facultatif',
      send: ['Rejoindre la liste d’attente', 'Envoyer'],
      invalid: 'Merci d’indiquer votre nom et une adresse e-mail valide.',
      invalidMsg: 'Merci d’écrire aussi un message.',
      proto: 'Prototype : rien n’a été envoyé. Le formulaire final passe par Web3Forms.'
    },
    footer: { tag: 'Le terminal de paiement dans votre poche.', note: '© 2026 ItriPay. Fabriqué au Maroc.', contact: 'Contact' },
    app: {
      shop: 'Épicerie Al Amal', cur: 'DH', amount: 'Montant', pay: 'Payer', nfc: 'Approchez la carte ou le téléphone', paid: 'Payé',
      receipt: 'Reçu', date: 'Date', dateV: '16 sept., 14:32', method: 'Méthode', methodV: 'Sans contact', ref: 'Réf.', thanks: 'Merci de votre visite',
      credit: 'Crédit', total: 'Total', sms: 'Rappel SMS envoyé',
      c: [['Y. Bennani', 'Pain, lait · aujourd’hui', '86.00'], ['F. Ouazzani', 'A payé 150.00 · hier', '240.50'], ['K. Idrissi', 'Bouteille de gaz · 12 sept.', '55.00'], ['S. Tazi', 'Courses · 9 sept.', '461.00']]
    }
  },

  ar: {
    dir: 'rtl',
    skip: 'الانتقال إلى المحتوى',
    langLabel: 'اللغة',
    starLabel: 'نجمة ItriPay: أربعة رؤوس، أربع قيم',
    spinLabel: 'أدِر النجمة',
    nav: { how: 'كيف يعمل', features: 'الميزات', pricing: 'السعر', faq: 'الأسئلة' },
    cta: 'انضم إلى قائمة الانتظار',
    cta2: 'شاهد كيف يعمل',
    hero: {
      eyebrow: 'إيتري تعني النجمة',
      title: 'هاتفك هو<br>جهاز الدفع.',
      sub: 'يحوّل ItriPay هاتف أندرويد الذي يملكه التاجر المغربي أصلاً إلى جهاز دفع: الدفع باللمس، ودفتر ديون رقمي، وأرقام المبيعات اليومية. 49 درهماً في الشهر، من غير أي جهاز إضافي.',
      note: 'قبل الإطلاق. نبحث عن شريك دفع مرخَّص.'
    },
    valuesHead: { eyebrow: 'أربعة رؤوس، أربع قيم', title: 'نجمة واحدة. أربعة وعود.', sub: 'كل رأس من رؤوس النجمة يحمل التزاماً نحاسب أنفسنا عليه. المس واحداً.' },
    values: [
      { name: 'اتصال', line: 'التاجر والزبون، على بُعد لمسة.', body: 'يقرّب الزبون بطاقته أو هاتفه من هاتف التاجر. الإيصال يُرسل عبر واتساب. والتطبيق يتكلم الدارجة والأمازيغية والفرنسية والإنجليزية.' },
      { name: 'سرعة', line: 'أدخل المبلغ. مدّ الهاتف. انتهى.', body: 'لا شيء يوصَل ولا شيء يُقرَن. البيع ثلاث خطوات، ومجموع اليوم محدَّث دائماً.' },
      { name: 'أمان', line: 'الزبون يرى المبلغ قبل أن يدفع.', body: 'حسابات للموظفين بصلاحيات خاصة بكل واحد. كل دفعة وكل استرجاع محفوظ في السجل. ولن تمرّ الأموال إلا عبر شريك دفع مرخَّص.' },
      { name: 'ابتكار', line: 'الدفتر، من غير دفتر.', body: 'دفتر ديون رقمي مع تذكيرات SMS، وتقارير مبيعات تُصدَّر PDF أو Excel، وإيصالات بشعارك.' }
    ],
    problem: {
      eyebrow: 'المشكلة', title: 'جهاز الدفع شيء آخر عليك أن تستأجره.',
      sub: 'بقالة الحيّ تعمل بهاتف وصندوق نقود ودفتر. والدفع بالبطاقة يطلب شيئاً رابعاً.',
      items: [
        ['device', 'الصندوق فوق الطاولة', 'جهاز الدفع جهاز ثانٍ يُستأجر ويُشحن ويُراقَب.'],
        ['book', 'الدفتر الورقي', 'من عليه ماذا مكتوب في دفتر قد يضيع، ولا أحد يجمع المجموع.'],
        ['chart', 'أرقام لا يملكها أحد', 'عند الإغلاق، مبيعات اليوم مجرد تخمين.']
      ]
    },
    how: {
      eyebrow: 'كيف يعمل', title: 'ثلاث خطوات. هاتف واحد.',
      steps: [
        ['أدخل المبلغ', 'اكتب الثمن على لوحة الأرقام، كما تفعل على الآلة الحاسبة.'],
        ['مدّ الهاتف', 'يرى الزبون المبلغ ويقرّب بطاقته أو هاتفه من هاتفك.'],
        ['انتهى', 'إيصال مطبوع أو مُرسل عبر واتساب. والبيع مسجَّل في حساباتك.']
      ]
    },
    features: {
      eyebrow: 'الميزات', title: 'كل ما يحتاجه المحل. ولا شيء زائد.',
      items: [
        ['tap', 'الدفع باللمس', 'الهاتف الذي يملكه التاجر أصلاً يستقبل الدفع.'],
        ['book', 'دفتر الديون', 'كل زبون، كل دين، كل دفعة عليه، مع تذكيرات SMS تُرسل حين تقرر أنت.'],
        ['chart', 'إحصائيات المبيعات', 'تقارير يومية وشهرية وسنوية. تصدير PDF أو Excel.'],
        ['receipt', 'إيصالك الخاص', 'شعارك واسم محلك، مطبوعاً أو مُرسلاً عبر واتساب.'],
        ['users', 'حسابات الموظفين', 'أضف موظفين وحدّد ما يستطيع كل واحد فعله.'],
        ['globe', 'أربع لغات', 'الدارجة والأمازيغية والفرنسية والإنجليزية، تُختار من الشاشة الأولى.']
      ]
    },
    who: {
      eyebrow: 'لمن', title: 'صُنع لمحل الحيّ.',
      items: [
        ['shop', 'بقالات الحيّ', 'الحانوت الذي يحتفظ أصلاً بدفتر ديون لنصف الزنقة.'],
        ['cup', 'المقاهي ومحلات الأكل السريع', 'مبالغ صغيرة، كثيرة، طوال اليوم.'],
        ['basket', 'باعة الأسواق والباعة المتجولون', 'لا طاولة ولا مأخذ كهرباء، فقط هاتف في الجيب.'],
        ['scissors', 'المحلات الصغيرة والخدمات', 'الحلاقون والخياطون ومحلات الإصلاح: كل من يُدفع له وجهاً لوجه.']
      ]
    },
    pricing: {
      eyebrow: 'السعر', title: 'خطة واحدة. كل شيء مشمول.',
      cur: 'درهم', per: '/ شهر', nodevice: 'من غير جهاز إضافي',
      nodeviceSub: 'هاتفك هو جهاز الدفع.',
      rule: 'مجاني إذا لم تبلغ مبيعاتك 500 درهم خلال 30 يوماً.',
      how: 'فعّل مجاناً واستخدم كل شيء. إذا تجاوزت مبيعاتك 500 درهم خلال 30 يوماً، يُخصم 49 درهماً تلقائياً.',
      incTitle: 'كل الميزات مشمولة',
      inc: ['سجل المعاملات: كل المدفوعات والمسترجعات', 'المبيعات والإحصائيات: تقارير يومية وشهرية وسنوية', 'تصدير PDF / Excel', 'تعدد المستخدمين: موظفون بصلاحيات', 'الديون: تتبع الديون وتنبيهات SMS', 'إيصال مخصص بشعارك واسم محلك']
    },
    partners: {
      eyebrow: 'الشركاء', title: 'نبحث عن شريك دفع مرخَّص.',
      body: 'ItriPay هو تطبيق التاجر: جهاز الدفع على الهاتف، والدفتر، والتقارير. ولكي تتحرك الأموال يحتاج إلى مؤسسة أداء مرخَّصة أو بنك مُحصِّل من ورائه. نحن لسنا مرخَّصين، ولا ندّعي ذلك.',
      points: ['تطبيق أندرويد يعمل بأربع لغات', 'مبنيّ حول محل الحيّ، لا مكيَّف له لاحقاً', 'منفتحون على مؤسسات الأداء والمُحصِّلين والبنوك في المغرب'],
      cta: 'حدّثنا عن الشراكة'
    },
    name: {
      eyebrow: 'الاسم', title: 'إيتري تعني النجمة.',
      body: 'ⵉⵜⵔⵉ، إيتري، هي كلمة «نجمة» بالأمازيغية. قبل الخرائط بزمن طويل، كان التجار يعبرون هذه البلاد مهتدين بالنجوم. اخترنا الاسم للسبب نفسه: نقطة ثابتة يعتمد عليها التاجر.',
      foot: 'أربعة رؤوس، أربعة وعود.'
    },
    faq: {
      eyebrow: 'الأسئلة', title: 'أسئلة، وأجوبة واضحة.',
      items: [
        ['هل أحتاج إلى قارئ بطاقات أو أي جهاز إضافي؟', 'لا. يعمل ItriPay على هاتف أندرويد مزوَّد بتقنية NFC. لا شيء آخر تشتريه أو تستأجره.'],
        ['كم يكلّف؟', '49 درهماً في الشهر، وكل شيء مشمول. وهو مجاني في كل 30 يوماً تبقى فيها مبيعاتك دون 500 درهم.'],
        ['هل أستطيع استقبال المدفوعات به اليوم؟', 'ليس بعد. ItriPay في مرحلة ما قبل الإطلاق ونبحث عن شريك دفع مرخَّص. انضم إلى قائمة الانتظار وسنراسلك عند الافتتاح.'],
        ['هل ItriPay بنك أو مؤسسة أداء؟', 'لا. ItriPay برنامج. المدفوعات سيعالجها شريك مرخَّص.'],
        ['ما اللغات التي يتكلمها التطبيق؟', 'الدارجة والأمازيغية والفرنسية والإنجليزية.'],
        ['ما هو دفتر الديون؟', 'دفتر من عليه ماذا، محفوظ على الهاتف: كل زبون، كل دين، كل دفعة، ومجموع محدَّث دائماً.']
      ]
    },
    join: {
      eyebrow: 'قائمة الانتظار والتواصل', title: 'كن حاضراً عند الافتتاح.',
      body: 'تجار يريدون الانضمام مبكراً، شركاء دفع، مستثمرون: اكتبوا لنا هنا. نجيب من البريد نفسه.',
      alt: 'أو راسلنا مباشرة:',
      segLabel: 'ماذا تريد أن تفعل؟', seg: ['قائمة الانتظار', 'تواصل معنا'],
      fName: 'اسمك', fEmail: 'بريدك الإلكتروني', fMsg: 'الرسالة', optional: 'اختياري',
      send: ['انضم إلى قائمة الانتظار', 'إرسال'],
      invalid: 'يرجى إدخال اسمك وبريد إلكتروني صحيح.',
      invalidMsg: 'يرجى كتابة رسالة أيضاً.',
      proto: 'نموذج أولي: لم يُرسل شيء. النموذج النهائي يمرّ عبر Web3Forms.'
    },
    footer: { tag: 'جهاز الدفع في جيبك.', note: '© 2026 ItriPay. صُنع في المغرب.', contact: 'للتواصل' },
    app: {
      shop: 'بقالة الأمل', cur: 'د.م.', amount: 'المبلغ', pay: 'ادفع الآن', nfc: 'قرّب البطاقة أو الهاتف', paid: 'تم الدفع',
      receipt: 'إيصال', date: 'التاريخ', dateV: '16 شتنبر، 14:32', method: 'الطريقة', methodV: 'الدفع باللمس', ref: 'المرجع', thanks: 'شكراً لزيارتكم',
      credit: 'الديون', total: 'الإجمالي', sms: 'تم إرسال تذكير SMS',
      c: [['ي. بناني', 'خبز، حليب · اليوم', '86.00'], ['ف. الوزاني', 'دفع 150.00 · أمس', '240.50'], ['ك. الإدريسي', 'قنينة غاز · 12 شتنبر', '55.00'], ['س. التازي', 'مشتريات · 9 شتنبر', '461.00']]
    }
  }
};
