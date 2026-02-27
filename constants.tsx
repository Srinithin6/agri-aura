
import { Product } from './types';

export const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Organic', 'Regional Org', 'Dairy', 'Staples', 'Beverages'];

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  color: string;
  targetCategory?: string;
  image?: string;
}

export const OFFERS: Offer[] = [
  { 
    id: '1', 
    title: 'Seasonal Veggie Feast', 
    subtitle: 'Direct from the morning harvest.',
    discount: '30% FLAT OFF', 
    code: 'VEGIE30', 
    color: 'from-emerald-900/90 to-green-600/40',
    targetCategory: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: '2', 
    title: 'Tropical Sunshine Pack', 
    subtitle: 'Nature’s candy, delivered in 60 mins.',
    discount: 'BUY 2 GET 1 FREE', 
    code: 'FRUITJOY', 
    color: 'from-orange-900/90 to-amber-500/40',
    targetCategory: 'Fruits',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: '3', 
    title: 'Heritage Organic Box', 
    subtitle: 'Pure seeds, zero chemicals, 100% taste.',
    discount: 'SAVE ₹250 NOW', 
    code: 'ORGANIC25', 
    color: 'from-purple-950/90 to-rose-600/40',
    targetCategory: 'Organic',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: '4', 
    title: 'Farm-to-Kitchen Dairy', 
    subtitle: 'Raw, untouched, and chilled for freshness.',
    discount: 'FLASH 25% OFF', 
    code: 'DAIRY25', 
    color: 'from-sky-950/90 to-blue-600/40',
    targetCategory: 'Dairy',
    image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=1200'
  },
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];

  const addCategory = (cat: Product['category'], names: string[], unsplashIds: string[], prefix: string) => {
    names.forEach((name, i) => {
      const possibleRatings = [4.5, 4.6, 4.7, 4.8, 4.9];
      const rating = possibleRatings[Math.floor(Math.random() * possibleRatings.length)];
      const imageId = unsplashIds[i % unsplashIds.length];
      
      products.push({
        id: `${prefix}${i + 1}`,
        name,
        category: cat,
        price: 35 + Math.floor(Math.random() * 250),
        unit: cat === 'Dairy' || cat === 'Beverages' ? '1L' : '1kg',
        image: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&q=85&w=600&h=600`,
        description: `Premium fresh ${name.toLowerCase()} sourced directly from local sustainable farms. Guaranteed freshness and taste.`,
        stock: 50 + i * 2,
        rating: rating,
        isFresh: i % 4 === 0
      });
    });
  };

  const vegNames = [
    'Vine-Ripened Tomatoes', 'Green Broccoli', 'Sweet Red Onions', 'Crisp Cucumber', 'Russet Potatoes',
    'Baby Carrots', 'White Cauliflower', 'Organic Spinach', 'Fresh Okra', 'Purple Eggplant',
    'Yellow Bell Pepper', 'Green Cabbage', 'Sweet Garden Peas', 'Young Ginger', 'Pearl Garlic',
    'White Radish', 'Beetroot', 'Golden Pumpkin', 'Bottle Gourd', 'Bitter Gourd',
    'Green Chilies', 'Seedless Lemon', 'Sweet Potato', 'Button Mushroom', 'Baby Corn'
  ];
  const vegIds = [
    'photo-1592924357228-91a4daadcfea', // Vine-Ripened Tomatoes
    'photo-1459411621453-7b03977f4bfc', // Green Broccoli
    'photo-1508747703725-719777637510', // Sweet Red Onions
    'photo-1449339854873-750e6df515d0', // Crisp Cucumber
    'photo-1518977676601-b53f02ac6d31', // Russet Potatoes
    'photo-1598170845058-32b9d6a5da37', // Baby Carrots
    'photo-1568584711075-3d021a7c3ec3', // White Cauliflower
    'photo-1576045057995-568f588f82fb', // Organic Spinach
    'photo-1627485750570-360fd30483a9', // Fresh Okra
    'photo-1615485500704-8e990f9900f7', // Purple Eggplant
    'photo-1567019175671-c247ee4fe655', // Yellow Bell Pepper
    'photo-1594282486512-ad58f62b75b5', // Green Cabbage
    'photo-1587996833651-06a23343b15d', // Sweet Garden Peas
    'photo-1599940824399-b87987ceb72a', // Young Ginger
    'photo-1590593162201-f67611a18b87', // Pearl Garlic
    'photo-1528113033608-d7885ac58f71', // White Radish
    'photo-1506867072417-82a337d58414', // Beetroot
    'photo-1603048297172-c92544798d5a', // Golden Pumpkin
    'photo-1583953623787-ada99d338235', // Bottle Gourd
    'photo-1588166524941-3bf61a7c41dd', // Bitter Gourd
    'photo-1585059895524-72359e061381', // Green Chilies
    'photo-1596040033229-a9821ebd058d', // Seedless Lemon
    'photo-1504674900247-0877df9cc836', // Sweet Potato
    'photo-1551754655-cd27e38d2076', // Button Mushroom
    'photo-1590590409349-036cb426c0ef'  // Baby Corn
  ];
  addCategory('Vegetables', vegNames, vegIds, 'v');

  const fruitNames = [
    'Alphonso Mango', 'Hass Avocado', 'Red Fuji Apple', 'Cavendish Banana', 'Nagpur Orange',
    'Sweet Green Grapes', 'Pomegranate', 'Ripe Papaya', 'Sugarbaby Watermelon', 'Queen Pineapple',
    'Fresh Strawberry', 'Organic Blueberry', 'Zespri Kiwi', 'Red Dragon Fruit', 'Conference Pear',
    'Pink Guava', 'Custard Apple', 'Sweet Muskmelon', 'Fresh Lychee', 'Black Jamun',
    'Juicy Peach', 'Sweet Apricot', 'Bing Cherry', 'Fresh Purple Fig', 'Tender Coconut'
  ];
  const fruitIds = [
    'photo-1553279768-865429fa0078', 'photo-1523049673857-eb18f1d7b578',
    'photo-1560806887-1e4cd0b6bcd6', 'photo-1571771894821-ad996211fdf4',
    'photo-1557800636-894a64c1696f', 'photo-1537640538966-79f369b41e8f',
    'photo-1615484477778-ca3b77940c25', 'photo-1517282003859-74002f935963',
    'photo-1587049352846-4a222e784d38', 'photo-1550258114-b1364a03f838',
    'photo-1464965911861-746a04b4bca6', 'photo-1498557850523-fd3d118b962e',
    'photo-1591735156653-f4ff50aa2cb5', 'photo-1527324688101-016748a5a854',
    'photo-1514756331096-242f390efe2a', 'photo-1536511118298-032908873913',
    'photo-1610348725531-843dff563e2c', 'photo-1595475207225-428b62bda831',
    'photo-1501746734258-30c1593be3d2', 'photo-1601004890684-d8cbf643f5f2',
    'photo-1521236575383-1f300721f3b3', 'photo-1568127442574-14444984af51',
    'photo-1528825871115-3581a5387919', 'photo-1601379327928-3f59a70216c9',
    'photo-1526318896980-cf78c088247c'
  ];
  addCategory('Fruits', fruitNames, fruitIds, 'f');

  const organicNames = [
    'Heirloom Black Rice', 'Certified Organic Quinoa', 'Raw Wildflower Honey', 'Cold-Pressed Coconut Oil', 'Organic Turmeric Powder',
    'Brown Flax Seeds', 'Organic Chia Seeds', 'Hand-Pounded Wheat Flour', 'Organic Jaggery Powder', 'Himalayan Pink Salt',
    'Organic A2 Ghee', 'Certified Organic Walnuts', 'Raw Cashew Nuts', 'Organic Peanuts', 'Cold-Pressed Sesame Oil',
    'Organic Moong Dal', 'Organic Rajma', 'Brown Chickpeas', 'Organic Sunflower Seeds', 'Pure Vanilla Extract',
    'Organic Cocoa Powder', 'Stevia Dry Leaves', 'Organic Moringa Powder', 'Tulsi Green Tea Leaves', 'Organic Amaranth Grains'
  ];
  const organicIds = [
    'photo-1550989460-0adf9ea622e2', 'photo-1512149177596-f817c7ef5d4c',
    'photo-1610348725531-843dff563e2c', 'photo-1540420773420-3366772f4999',
    'photo-1505575967455-40e256f7377c', 'photo-1599420186946-7b6fb4eaba1f',
    'photo-1515023115689-589c33041d3c', 'photo-1509358271058-acd22cc93898',
    'photo-1596040033229-a9821ebd058d', 'photo-1506484334402-40ff226935e2',
    'photo-1589927986089-35812388d1f4', 'photo-1590540179852-2110a54f813a',
    'photo-1596506306796-930e87738391', 'photo-1511067007398-7e4b90cfa4bc',
    'photo-1474979266404-7eaacbcd87c5', 'photo-1586201375761-83865001e31c',
    'photo-1505253149613-112d21d9f6a9', 'photo-1512621776951-a57141f2eefd',
    'photo-1559181567-c3190ca9959b', 'photo-1534120247760-c44c3e4a62f1',
    'photo-1599584384832-19443f986f09', 'photo-1533604133517-bb3a73ae6aa4',
    'photo-1596040033229-a9821ebd058d', 'photo-1544787210-2211d74fc119',
    'photo-1515942400420-2b989185fb43'
  ];
  addCategory('Organic', organicNames, organicIds, 'o');

  const regionalOrgNames = [
    'MDU 1 Brinjal', 'Dharapuram Brinjal', 'Vellore Spiny Brinjal', 'Bhavani Brinjal', 'Poyyur Kathari',
    'Arka Bahar Bottle Gourd', 'Pusa Summer Prolific Bottle Gourd', 'Pusa Manjari Bottle Gourd',
    'Maljal Pusani Pumpkin', 'Ash Gourd',
    'Red Amaranth Leaves', 'Green Amaranth Leaves', 'Drumstick (Moringa Pods)', 'Fresh Curry Leaves', 'Small Onions (Shallots)',
    'Country Garlic (Native)', 'Native Ridge Gourd', 'Cluster Beans', 'Broad Beans', 'Raw Banana (Plantain)'
  ];
  const regionalOrgIds = [
    'photo-1615485500704-8e990f9900f7', 'photo-1615485500704-8e990f9900f7', 'photo-1615485500704-8e990f9900f7', 'photo-1615485500704-8e990f9900f7', 'photo-1615485500704-8e990f9900f7',
    'photo-1583953623787-ada99d338235', 'photo-1583953623787-ada99d338235', 'photo-1583953623787-ada99d338235',
    'photo-1603048297172-c92544798d5a', 'photo-1583953623787-ada99d338235',
    'photo-1576045057995-568f588f82fb', 'photo-1576045057995-568f588f82fb', 'photo-1627485750570-360fd30483a9', 'photo-1627485750570-360fd30483a9', 'photo-1508747703725-719777637510',
    'photo-1590593162201-f67611a18b87', 'photo-1583953623787-ada99d338235', 'photo-1587996833651-06a23343b15d', 'photo-1587996833651-06a23343b15d', 'photo-1571771894821-ad996211fdf4'
  ];
  addCategory('Regional Org', regionalOrgNames, regionalOrgIds, 'ro');

  const dairyNames = [
    'Fresh Farm Cow Milk', 'Pure Buffalo Milk', 'Artisanal Salted Butter', 'Unsalted Farm Butter', 'Fresh Buffalo Paneer',
    'Greek Style Plain Yogurt', 'Set Curd (Clay Pot)', 'Sweet Lassi (Chilled)', 'Spiced Buttermilk', 'Low Fat Skimmed Milk',
    'Thick Dairy Cream', 'Mozzarella Cheese Blocks', 'Cheddar Cheese Slices', 'Flavored Fruit Yogurt', 'Probiotic Drink',
    'Whipping Cream', 'Condensed Milk', 'Milk Khoa (Fresh)', 'Mascarpone Cheese', 'Dairy Whitener',
    'Gouda Cheese Wedges', 'Fresh Ricotta', 'Fresh Malai Paneer', 'Ghee (Buffalo Milk)', 'Fresh Chhena'
  ];
  const dairyIds = [
    'photo-1550583724-b26cc28af5ce', 'photo-1563636619-e9150fa4ba0d', 'photo-1528498033373-3c6c08e93d79', 'photo-1589927986089-35812388d1f4',
    'photo-1628088062854-d1877146036c', 'photo-1481005221971-e977f6b92f70', 'photo-1559598467-f8b76c8155d0', 'photo-1549395156-e0c1fe6fc7a5',
    'photo-1552689486-f6773047d19f', 'photo-1563636619-e9150fa4ba0d', 'photo-1550583724-b26cc28af5ce', 'photo-1528498033373-3c6c08e93d79',
    'photo-1589927986089-35812388d1f4', 'photo-1563636619-e9150fa4ba0d', 'photo-1550583724-b26cc28af5ce', 'photo-1528498033373-3c6c08e93d79',
    'photo-1589927986089-35812388d1f4', 'photo-1563636619-e9150fa4ba0d', 'photo-1550583724-b26cc28af5ce', 'photo-1528498033373-3c6c08e93d79',
    'photo-1589927986089-35812388d1f4', 'photo-1563636619-e9150fa4ba0d', 'photo-1550583724-b26cc28af5ce', 'photo-1528498033373-3c6c08e93d79',
    'photo-1589927986089-35812388d1f4'
  ];
  addCategory('Dairy', dairyNames, dairyIds, 'd');

  const stapleNames = [
    'Premium Basmati Rice', 'Sona Masuri Rice', 'Whole Wheat Atta', 'Multi-Grain Flour', 'Toor Dal (Pigeon Peas)',
    'Masoor Dal (Red Lentils)', 'Urad Dal (Black Gram)', 'Chana Dal (Bengal Gram)', 'Kabuli Chana', 'Moong Dal (Yellow)',
    'Refined Wheat Flour', 'Semolina (Sooji)', 'Poha (Flattened Rice)', 'Vermicelli (Roasted)', 'Premium Mustard Oil',
    'Pure Sunflower Oil', 'Filtered Groundnut Oil', 'Iodized Table Salt', 'Granulated Sugar', 'Natural Brown Sugar',
    'Fenugreek Seeds', 'Whole Cumin Seeds', 'Black Pepper Pods', 'Green Cardamom Pods', 'Whole Cloves'
  ];
  const stapleIds = [
    'photo-1586201375761-83865001e31c', 'photo-1476124369491-e7addf5db371', 'photo-1596040033229-a9821ebd058d', 'photo-1515942400420-2b989185fb43',
    'photo-1512621776951-a57141f2eefd', 'photo-1626082927389-6cd097cdc6ec', 'photo-1586201375761-83865001e31c', 'photo-1476124369491-e7addf5db371',
    'photo-1596040033229-a9821ebd058d', 'photo-1515942400420-2b989185fb43', 'photo-1512621776951-a57141f2eefd', 'photo-1626082927389-6cd097cdc6ec',
    'photo-1586201375761-83865001e31c', 'photo-1476124369491-e7addf5db371', 'photo-1596040033229-a9821ebd058d', 'photo-1515942400420-2b989185fb43',
    'photo-1512621776951-a57141f2eefd', 'photo-1626082927389-6cd097cdc6ec', 'photo-1586201375761-83865001e31c', 'photo-1476124369491-e7addf5db371',
    'photo-1596040033229-a9821ebd058d', 'photo-1515942400420-2b989185fb43', 'photo-1512621776951-a57141f2eefd', 'photo-1626082927389-6cd097cdc6ec',
    'photo-1586201375761-83865001e31c'
  ];
  addCategory('Staples', stapleNames, stapleIds, 's');

  const beverageNames = [
    'Filter Coffee Powder', 'Instant Coffee Mix', 'CTC Tea Dust', 'Masala Chai Leaves', 'Green Tea Bags',
    'Tender Coconut Water', 'Fresh Orange Juice', 'Mixed Fruit Juice', 'Apple Cider (Non-Alc)', 'Lemon Mint Mojito',
    'Natural Sparkling Water', 'Almond Milk (Unsweet)', 'Soy Milk (Chocolate)', 'Mango Pulp Drink', 'Thick Tomato Juice',
    'Cold Brew Coffee', 'Ceremonial Matcha Tea', 'Chamomile Tea Leaves', 'Hibiscus Tea Mix', 'Energy Malt Drink',
    'Aloe Vera Juice', 'Pomegranate Nectar', 'Dark Cocoa Mix', 'Barley Drink', 'Spiced Tomato Juice'
  ];
  const beverageIds = [
    'photo-1600271886391-0c53d817459c', 'photo-1495474472287-4d71bcdd2085', 'photo-1594631252845-29fc4586b517', 'photo-1544787210-2211d74fc119',
    'photo-1513558161293-cdaf765ed2fd', 'photo-1523906834658-6e24ef2346f9', 'photo-1600271886391-0c53d817459c', 'photo-1495474472287-4d71bcdd2085',
    'photo-1594631252845-29fc4586b517', 'photo-1544787210-2211d74fc119', 'photo-1513558161293-cdaf765ed2fd', 'photo-1523906834658-6e24ef2346f9',
    'photo-1600271886391-0c53d817459c', 'photo-1495474472287-4d71bcdd2085', 'photo-1594631252845-29fc4586b517', 'photo-1544787210-2211d74fc119',
    'photo-1513558161293-cdaf765ed2fd', 'photo-1523906834658-6e24ef2346f9', 'photo-1600271886391-0c53d817459c', 'photo-1495474472287-4d71bcdd2085',
    'photo-1594631252845-29fc4586b517', 'photo-1544787210-2211d74fc119', 'photo-1513558161293-cdaf765ed2fd', 'photo-1523906834658-6e24ef2346f9',
    'photo-1600271886391-0c53d817459c'
  ];
  addCategory('Beverages', beverageNames, beverageIds, 'b');

  return products;
};

export const PRODUCTS = generateProducts();
