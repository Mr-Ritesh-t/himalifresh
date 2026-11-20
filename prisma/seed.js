const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Himali Fresh database...');

  // 1. Seed Admin User
  const adminEmail = 'admin@himalifresh.com';
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('HimaliFresh@2026!', 10);
    await prisma.adminUser.create({
      data: {
        name: 'Himali Fresh Administrator',
        email: adminEmail,
        passwordHash,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('Created super admin: admin@himalifresh.com (Password: HimaliFresh@2026!)');
  }

  // 2. Seed Business Settings
  await prisma.businessSettings.upsert({
    where: { id: 'default-settings' },
    update: {
      businessName: 'Himali Fresh',
      tagline: 'The Spirit of Himalayas',
      phone: '+91 98320 78728',
      whatsappNumber: '919832078728',
      email: 'info@himalifresh.com',
      address: 'Dagapur, Siliguri, West Bengal, India',
      mapUrl: 'https://maps.google.com/?q=Dagapur+Siliguri',
      logoUrl: '/images/logo.jpg',
      heroImageUrl: '/images/herobanner.png',
      announcement: 'Delivering Authentic Himalayan Products Across India',
      homepageHeading: 'Pure & Authentic Himalayan Products',
      homepageDescription: 'Traditional flavours, organic goodness and handcrafted products from the Himalayas.',
      aboutStory: 'Founded in Siliguri, at the gateway to the Eastern Himalayas, Himali Fresh connects traditional hill communities, organic farmers, and artisan food makers with households across India. We believe in preserving indigenous culinary heritage, sustainably sourcing pure mountain ingredients, and offering direct farmer-to-doorstep authenticity.',
    },
    create: {
      id: 'default-settings',
      businessName: 'Himali Fresh',
      tagline: 'The Spirit of Himalayas',
      phone: '+91 98320 78728',
      whatsappNumber: '919832078728',
      email: 'info@himalifresh.com',
      address: 'Dagapur, Siliguri, West Bengal, India',
      mapUrl: 'https://maps.google.com/?q=Dagapur+Siliguri',
      logoUrl: '/images/logo.jpg',
      heroImageUrl: '/images/herobanner.png',
      announcement: 'Delivering Authentic Himalayan Products Across India',
      homepageHeading: 'Pure & Authentic Himalayan Products',
      homepageDescription: 'Traditional flavours, organic goodness and handcrafted products from the Himalayas.',
      aboutStory: 'Founded in Siliguri, at the gateway to the Eastern Himalayas, Himali Fresh connects traditional hill communities, organic farmers, and artisan food makers with households across India. We believe in preserving indigenous culinary heritage, sustainably sourcing pure mountain ingredients, and offering direct farmer-to-doorstep authenticity.',
    },
  });
  console.log('Business settings initialized.');

  // 3. Seed Categories
  const categoriesData = [
    {
      name: 'Pickles & Traditional Foods',
      slug: 'pickles-traditional-foods',
      description: 'Handcrafted Himalayan pickles, fermented delights, and age-old regional delicacies.',
      imageUrl: '/images/categories/pickles.jpg',
      displayOrder: 1,
    },
    {
      name: 'Titoura & Local Snacks',
      slug: 'titoura-local-snacks',
      description: 'Authentic Himalayan titaura candies, sweet and sour treats, and crunchy hill snacks.',
      imageUrl: '/images/categories/titoura.jpg',
      displayOrder: 2,
    },
    {
      name: 'Spices & Seasonings',
      slug: 'spices-seasonings',
      description: 'Aromatic mountain spices, wild Timur, organic turmeric, and fiery Dalle chillies.',
      imageUrl: '/images/categories/spices.jpg',
      displayOrder: 3,
    },
    {
      name: 'Organic Products',
      slug: 'organic-products',
      description: 'Naturally grown chemical-free forest produce, medicinal mountain herbs, and natural honey.',
      imageUrl: '/images/categories/organic.jpg',
      displayOrder: 4,
    },
    {
      name: 'Beverages & Squashes',
      slug: 'beverages-squashes',
      description: 'Wild Rhododendron squash, artisan Darjeeling teas, and refreshing herbal infusions.',
      imageUrl: '/images/categories/beverages.jpg',
      displayOrder: 5,
    },
    {
      name: 'Rice, Grains & Flours',
      slug: 'rice-grains-flours',
      description: 'High-altitude red rice, Himalayan buckwheat flour, millet grains, and stone-ground cereals.',
      imageUrl: '/images/categories/rice-grains.jpg',
      displayOrder: 6,
    },
    {
      name: 'Dairy Products',
      slug: 'dairy-products',
      description: 'Traditional Yak cheese (Chhurpi), pure mountain butter, and artisanal dairy specialities.',
      imageUrl: '/images/categories/dairy.jpg',
      displayOrder: 7,
    },
    {
      name: 'Noodles & Packaged Foods',
      slug: 'noodles-packaged-foods',
      description: 'Iconic mountain noodles, ready-to-cook traditional meals, and authentic condiments.',
      imageUrl: '/images/categories/noodles.jpg',
      displayOrder: 8,
    },
    {
      name: 'Fresh Vegetables',
      slug: 'fresh-vegetables',
      description: 'Farm-fresh hill vegetables, seasonal squash, fresh bamboo shoots, and green leafy greens.',
      imageUrl: '/images/categories/vegetables.jpg',
      displayOrder: 9,
    },
    {
      name: 'Himalayan Traditional Products',
      slug: 'himalayan-traditional-products',
      description: 'Indigenous Gundruk, Sinki, Kinema, and heritage culinary essentials from the hills.',
      imageUrl: '/images/categories/traditional.jpg',
      displayOrder: 10,
    },
    {
      name: 'Handicrafts & Accessories',
      slug: 'handicrafts-accessories',
      description: 'Handmade mountain crafts, woollen textiles, Dhaka fabrics, and bamboo woven wares.',
      imageUrl: '/images/categories/handicrafts.jpg',
      displayOrder: 11,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log('Categories seeded.');

  // 4. Seed Products
  const productsData = [
    {
      name: 'Bamboo Shoot Pickle',
      slug: 'bamboo-shoot-pickle',
      description: 'Authentic Himalayan fermented bamboo shoot (Tama) pickle crafted in mustard oil with hand-ground mountain spices. Mildly tangy, earthy, and richly aromatic.',
      price: 320.0,
      weight: '400 g',
      mainImageUrl: '/images/products/bamboo-shoot-pickle.jpg',
      categorySlug: 'pickles-traditional-foods',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'King Chilli Pickle',
      slug: 'king-chilli-pickle',
      description: 'Famous round Himalayan firecracker Dalle Khursani chillies steeped in cold-pressed mustard oil with fenugreek and secret hill spices. Intense heat with tantalizing flavor.',
      price: 380.0,
      weight: '200 g',
      mainImageUrl: '/images/products/king-chilli-pickle.jpg',
      categorySlug: 'pickles-traditional-foods',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Mixed Pickle',
      slug: 'mixed-pickle',
      description: 'Traditional home-style Himalayan mixed vegetable and wild fruit pickle with rich notes of whole mustard, ginger, and garlic.',
      price: 280.0,
      weight: '400 g',
      mainImageUrl: '/images/products/mixed-pickle.jpg',
      categorySlug: 'pickles-traditional-foods',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Turmeric Powder',
      slug: 'turmeric-powder',
      description: 'Pure high-curcumin Lakadong & Himalayan mountain turmeric. Grown organically without synthetic fertilizers, freshly ground to preserve natural essential oils.',
      price: 160.0,
      weight: '250 g',
      mainImageUrl: '/images/products/turmeric-powder.jpg',
      categorySlug: 'spices-seasonings',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Organic Rice',
      slug: 'organic-rice',
      description: 'Heritage high-altitude Himalayan valley rice cultivated with glacial spring water. Sweet fragrance, fluffy grain texture, and wholesome nutrition.',
      price: 220.0,
      weight: '1 kg',
      mainImageUrl: '/images/products/organic-rice.jpg',
      categorySlug: 'rice-grains-flours',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Titoura / Local Snacks',
      slug: 'titoura-local-snacks-candy',
      description: 'Classic sweet, sour and spicy Himalayan fruit titaura (lapsi) roll bites. The definitive childhood mountain treat adored across Darjeeling and Kalimpong.',
      price: 180.0,
      weight: '200 g',
      mainImageUrl: '/images/products/titoura-snack.jpg',
      categorySlug: 'titoura-local-snacks',
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: 'Fermented Gundruk (Sun-Dried Greens)',
      slug: 'fermented-gundruk',
      description: 'National culinary pride of the Himalayas. Naturally fermented mustard and radish leaves, sun-dried in mountain air. Makes authentic Gundruk jhol and spicy sadeko salads.',
      price: 240.0,
      weight: '200 g',
      mainImageUrl: '/images/products/gundruk.jpg',
      categorySlug: 'himalayan-traditional-products',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Wild Himalayan Timur (Sichuan Pepper)',
      slug: 'wild-himalayan-timur',
      description: 'Wild harvested tingling mountain pepper berries from high altitude valleys. Delivers an unforgettable citrus punch and tongue-numbing aromatic zest.',
      price: 190.0,
      weight: '100 g',
      mainImageUrl: '/images/products/timur.jpg',
      categorySlug: 'spices-seasonings',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Traditional Chhurpi (Hard Yak Cheese)',
      slug: 'traditional-chhurpi',
      description: 'Artisanal high-altitude smoked yak cheese chews. Rich in protein, completely natural, prepared through centuries-old nomadic dairy traditions.',
      price: 350.0,
      weight: '250 g',
      mainImageUrl: '/images/products/chhurpi.jpg',
      categorySlug: 'dairy-products',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Rhododendron Squash (Gurash Juice)',
      slug: 'rhododendron-squash',
      description: 'Sweet and refreshing cordial made from wild red rhododendron blossoms gathered in Himalayan pine forests. Rich in antioxidants and deeply soothing.',
      price: 260.0,
      weight: '750 ml',
      mainImageUrl: '/images/products/rhododendron-squash.jpg',
      categorySlug: 'beverages-squashes',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Himalayan Buckwheat Flour (Phaper)',
      slug: 'himalayan-buckwheat-flour',
      description: 'Naturally gluten-free stone ground buckwheat flour. Excellent for wholesome pancakes, chapatis, and traditional hill porridge.',
      price: 175.0,
      weight: '1 kg',
      mainImageUrl: '/images/products/buckwheat-flour.jpg',
      categorySlug: 'rice-grains-flours',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Organic Mountain Honey',
      slug: 'organic-mountain-honey',
      description: 'Raw, unpasteurized honey harvested from wild forest bee flora in pristine mountain valleys. Dark, floral, and packed with enzymes.',
      price: 490.0,
      weight: '500 g',
      mainImageUrl: '/images/products/mountain-honey.jpg',
      categorySlug: 'organic-products',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Darjeeling First Flush Green Tea',
      slug: 'darjeeling-first-flush-green-tea',
      description: 'Hand-plucked whole-leaf spring tea from Darjeeling high-elevation organic tea gardens. Delicate floral notes and smooth muscatel finish.',
      price: 420.0,
      weight: '100 g',
      mainImageUrl: '/images/products/darjeeling-tea.jpg',
      categorySlug: 'beverages-squashes',
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: 'Handcrafted Woolen Himalayan Cap & Scarf Set',
      slug: 'woolen-himalayan-cap-scarf-set',
      description: 'Pure hill sheep wool knitted by local women artisans. Soft, warm, and styled with traditional Himalayan motif patterns.',
      price: 850.0,
      weight: '1 set',
      mainImageUrl: '/images/products/himalayan-handicraft.jpg',
      categorySlug: 'handicrafts-accessories',
      isAvailable: true,
      isFeatured: false,
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        weight: prod.weight,
        mainImageUrl: prod.mainImageUrl,
        categoryId: categoryId,
        isAvailable: prod.isAvailable,
        isFeatured: prod.isFeatured,
        isActive: true,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        weight: prod.weight,
        mainImageUrl: prod.mainImageUrl,
        categoryId: categoryId,
        isAvailable: prod.isAvailable,
        isFeatured: prod.isFeatured,
        isActive: true,
      },
    });
  }
  console.log('Products seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
