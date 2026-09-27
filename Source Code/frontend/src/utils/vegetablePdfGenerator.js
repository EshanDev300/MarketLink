import { jsPDF } from 'jspdf/dist/jspdf.es.min.js';

export function generateVegetablePdf() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper: draw banner header
  const drawHeader = (pageNumber) => {
    // Top emerald band
    doc.setFillColor(16, 185, 129); // #10b981
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Accent line
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 24, pageWidth, 2, 'F');

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('MarketLink  |  eGreen Basket Encyclopedia', 14, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Certified Organic Produce • TechWiz 7 Specification', 14, 19);

    // Page indicator
    doc.setFontSize(9);
    doc.text(`Page ${pageNumber}`, pageWidth - 25, 16);
  };

  // Helper: draw footer
  const drawFooter = () => {
    doc.setFillColor(6, 78, 59);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(209, 250, 229);
    doc.text('MarketLink Organic Agriculture System • Zero Middleman Logistics • Downloaded via Gemini 3.8 AI Assistant', 14, pageHeight - 5);
  };

  // --- PAGE 1: TITLE & VEGETABLES OVERVIEW ---
  drawHeader(1);

  let y = 38;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(6, 78, 59);
  doc.text('Encyclopedia & Definition of Organic Vegetables', 14, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(
    'A comprehensive reference guide detailing botanical definitions, nutritional values, peak harvest timings,',
    14,
    y
  );
  y += 5;
  doc.text(
    'and culinary applications for fresh farmstead produce listed across our local partner markets.',
    14,
    y
  );
  y += 10;

  // Key Definition Cards
  const vegDefinitions = [
    {
      name: '1. Heirloom Brandywine Tomato (Solanum lycopersicum)',
      type: 'Nightshade / Botanical Berry Fruit',
      definition: 'A legendary Amish heirloom cultivated since 1885, renowned for its potato-leaf foliage and large, pinkish-red irregular globes.',
      flavor: 'Deeply sweet, rich vinous acidity, aromatic and luscious texture with high pectin content.',
      nutrition: 'Abundant in Lycopene (potent antioxidant), Vitamin C (40% DV), Vitamin K, and Potassium.',
      culinary: 'Best enjoyed raw, sliced thick with cold-pressed olive oil, flaked sea salt, and fresh basil.'
    },
    {
      name: '2. Hydroponic Butterhead Lettuce (Lactuca sativa var. capitata)',
      type: 'Asteraceae / Leafy Salad Greens',
      definition: 'A soft-leaved heading green grown in clean nutrient-film hydroponic channels, harvested with live living roots attached.',
      flavor: 'Silky, delicate sweetness with virtually zero bitterness; tender buttery leaf folds.',
      nutrition: 'Loaded with Folate (Vitamin B9), Vitamin A, Iron, and natural hydration electrolytes (96% water).',
      culinary: 'Essential for crisp wraps, gourmet burgers, and delicate French vinaigrette salads.'
    },
    {
      name: '3. Rainbow Organic Carrots (Daucus carota subsp. sativus)',
      type: 'Apiaceae / Root Vegetable',
      definition: 'Heirloom heritage root vegetables grown in deep composted beds, presenting vivid purple, golden yellow, and deep orange hues.',
      flavor: 'Earthy, crunchy, concentrated honeyed sweetness enhanced by cool evening soils.',
      nutrition: 'High Beta-Carotene, Anthocyanins (purple varieties), Lutein, and prebiotic dietary fiber.',
      culinary: 'Spectacular roasted whole with raw wildflower honey and thyme sprigs.'
    },
    {
      name: '4. Wild Golden Chanterelle (Cantharellus cibarius)',
      type: 'Cantharellaceae / Foraged Culinary Fungi',
      definition: 'Symbiotic forest floor mushroom foraged sustainably from coastal pine and oak groves following autumn rains.',
      flavor: 'Delicate fruity apricot bouquet with a mild, peppery, meaty umami mouthfeel.',
      nutrition: 'One of the richest natural non-animal sources of Vitamin D, Copper, and Niacin (Vitamin B3).',
      culinary: 'Sautéed gently in pasture butter with garlic, tossed through pasta or folded into rustic omelets.'
    }
  ];

  vegDefinitions.forEach((veg) => {
    // Card box
    doc.setFillColor(240, 253, 244); // mint-bg
    doc.roundedRect(14, y, pageWidth - 28, 40, 3, 3, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, y, pageWidth - 28, 40, 3, 3, 'D');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text(veg.name, 18, y + 7);

    // Type badge
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`Classification: ${veg.type}`, 18, y + 13);

    // Definition
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Definition: ${veg.definition}`, 18, y + 19, { maxWidth: pageWidth - 36 });

    // Nutrition & Flavor
    doc.setFont('helvetica', 'bold');
    doc.text('Nutrition: ', 18, y + 27);
    doc.setFont('helvetica', 'normal');
    doc.text(veg.nutrition, 34, y + 27, { maxWidth: pageWidth - 52 });

    doc.setFont('helvetica', 'bold');
    doc.text('Culinary: ', 18, y + 34);
    doc.setFont('helvetica', 'normal');
    doc.text(veg.culinary, 32, y + 34, { maxWidth: pageWidth - 50 });

    y += 45;
  });

  drawFooter();

  // --- PAGE 2: EXTENDED VEGETABLE PROFILES ---
  doc.addPage();
  drawHeader(2);

  y = 36;

  const page2Veg = [
    {
      name: '5. Romanesco Fractal Cauliflower (Brassica oleracea var. botrytis)',
      type: 'Brassicaceae / Inflorescence Flower Bud',
      definition: 'A botanical marvel showcasing a logarithmic Fibonacci golden spiral of vibrant chartreuse cones.',
      flavor: 'Crisper than cauliflower, nuttier than broccoli, with a subtle sweet and earthy profile.',
      nutrition: 'Exceptional concentration of Vitamin C, Glucosinolates, Vitamin K, and Zinc.',
      culinary: 'Roasted whole florets with extra virgin olive oil, toasted pine nuts, and lemon zest.'
    },
    {
      name: '6. Crisp Organic Sugar Snap Peas (Pisum sativum var. macrocarpon)',
      type: 'Fabaceae / Legume Pod',
      definition: 'Plump, edible round pods developed by crossing snow peas with English shelling peas, picked at dawn.',
      flavor: 'Explosively juicy, sugary, sweet and tender crunch with floral pea notes.',
      nutrition: 'Rich in dietary fiber, Vitamin C, Vitamin A, and plant protein.',
      culinary: 'Raw in summer salads, stir-fried for 90 seconds, or paired with artisan goat cheese.'
    },
    {
      name: '7. Organic Baby Spinach & Wild Arugula (Spinacia oleracea / Eruca vesicaria)',
      type: 'Amaranthaceae & Brassicaceae / Tender Young Leaves',
      definition: 'Harvested under 28 days of growth when cell walls are tender, triple-washed with natural spring water.',
      flavor: 'Silky mineral richness from spinach contrasted with bold, peppery hazelnut notes from arugula.',
      nutrition: 'High in Iron, Magnesium, Lutein for eye health, and Nitrates for cardiovascular performance.',
      culinary: 'Tossed with shaved Parmigiano, toasted walnuts, and aged balsamic reduction.'
    },
    {
      name: '8. Crisp Japanese Mini Cucumbers (Cucumis sativus var. japonica)',
      type: 'Cucurbitaceae / Vine Melon Vegetable',
      definition: 'Slender, dark green cucumbers with delicate ribbed skin and tiny, unnoticeable seeds, never waxed.',
      flavor: 'Crisp, sweet, refreshing coolness with zero bitterness and intense clean cucumber aroma.',
      nutrition: 'Contains Cucurbitacin phytonutrients, Silica for skin elasticity, and high hydration content.',
      culinary: 'Smacked cucumber salads with toasted sesame oil, rice vinegar, and chili flakes.'
    }
  ];

  page2Veg.forEach((veg) => {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(14, y, pageWidth - 28, 40, 3, 3, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, y, pageWidth - 28, 40, 3, 3, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(6, 78, 59);
    doc.text(veg.name, 18, y + 7);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`Classification: ${veg.type}`, 18, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Definition: ${veg.definition}`, 18, y + 19, { maxWidth: pageWidth - 36 });

    doc.setFont('helvetica', 'bold');
    doc.text('Nutrition: ', 18, y + 27);
    doc.setFont('helvetica', 'normal');
    doc.text(veg.nutrition, 34, y + 27, { maxWidth: pageWidth - 52 });

    doc.setFont('helvetica', 'bold');
    doc.text('Culinary: ', 18, y + 34);
    doc.setFont('helvetica', 'normal');
    doc.text(veg.culinary, 32, y + 34, { maxWidth: pageWidth - 50 });

    y += 45;
  });

  // --- HARVEST & STORAGE BEST PRACTICES BOX ---
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(14, y + 2, pageWidth - 28, 26, 3, 3, 'F');
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(14, y + 2, pageWidth - 28, 26, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(6, 78, 59);
  doc.text('🌱 Storage Best Practices from Local Farmers:', 18, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('• Never refrigerate tomatoes — ambient temperature preserves essential flavor volatile esters.', 18, y + 16);
  doc.text('• Keep lettuce roots in a shallow bowl of water on the counter or crisper to maintain living freshness for 10+ days.', 18, y + 22);

  drawFooter();

  // Save document
  doc.save('MarketLink_Vegetable_Definition_Guide.pdf');
}
