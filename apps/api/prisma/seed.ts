import { PrismaClient, Condition, AgeGroup, MealType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const saltRounds = 10;
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@nevocore.app';
  // Generate a random password by default so no known credential ever ends
  // up committed to source control. Override with ADMIN_SEED_PASSWORD if
  // you need a specific value (e.g. for local dev).
  const password = process.env.ADMIN_SEED_PASSWORD || crypto.randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create an admin user
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log(`Created admin user: ${adminEmail}`);
  if (!process.env.ADMIN_SEED_PASSWORD) {
    console.log(`Generated admin password (save this now, it won't be shown again): ${password}`);
  }

  // Seed Diet Plans
  const dietPlans = [
    // --- DIABETES ---
    {
      condition: Condition.DIABETES,
      titleEn: '7-Day Diabetic Meal Plan',
      titleBn: '৭-দিনের ডায়াবেটিক খাবার পরিকল্পনা',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Oatmeal with berries', descriptionBn: 'জাম দিয়ে ওটমিল', calories: 300 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Grilled chicken salad', descriptionBn: 'গ্রিলড চিকেন সালাদ', calories: 450 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Baked salmon with quinoa and steamed vegetables', descriptionBn: 'বেকড স্যামন কুইনোয়া এবং স্টিমড সবজি সহ', calories: 500 },
        ],
      },
    },
    {
      condition: Condition.DIABETES,
      titleEn: 'Low-Carb Diabetic Plan',
      titleBn: 'কম-কার্ব ডায়াবেটিক পরিকল্পনা',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Scrambled eggs with spinach', descriptionBn: 'পালং শাক দিয়ে স্ক্র্যাম্বলড ডিম', calories: 250 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Tuna salad lettuce wraps', descriptionBn: 'টুনা সালাদ লেটুস মোড়ানো', calories: 400 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Beef and broccoli stir-fry', descriptionBn: 'গরুর মাংস এবং ব্রোকলি স্টার-ফ্রাই', calories: 480 },
        ],
      },
    },
    // --- CARDIAC ---
    {
      condition: Condition.CARDIAC,
      titleEn: 'Heart-Healthy Diet Plan',
      titleBn: 'হার্ট-স্বাস্থ্যকর ডায়েট প্ল্যান',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Greek yogurt with nuts and seeds', descriptionBn: 'বাদাম এবং বীজ সহ গ্রীক দই', calories: 350 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Lentil soup with whole-grain bread', descriptionBn: 'পুরো শস্যের রুটি দিয়ে মসুর ডালের স্যুপ', calories: 400 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Turkey meatballs with zucchini noodles', descriptionBn: 'জুচিনি নুডলস সহ টার্কি মিটবল', calories: 450 },
        ],
      },
    },
    {
      condition: Condition.CARDIAC,
      titleEn: 'Low-Sodium Cardiac Diet',
      titleBn: 'কম-সোডিয়াম কার্ডিয়াক ডায়েট',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Fruit smoothie with kale', descriptionBn: 'কেল দিয়ে ফলের স্মুদি', calories: 300 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Black bean burgers on a whole wheat bun', descriptionBn: 'গমের বানে ব্ল্যাক বিন বার্গার', calories: 500 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Garlic-herb baked cod with asparagus', descriptionBn: 'অ্যাসপারাগাস সহ গার্লিক-হার্ব বেকড কড', calories: 420 },
        ],
      },
    },
    // --- GENERAL ---
    {
      condition: Condition.GENERAL,
      titleEn: 'Balanced Weekly Nutrition',
      titleBn: 'সুষম সাপ্তাহিক পুষ্টি',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Whole wheat toast with avocado', descriptionBn: 'অ্যাভোকাডো সহ গমের টোস্ট', calories: 320 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Chicken and vegetable skewers', descriptionBn: 'চিকেন ও সবজির কাবাব', calories: 450 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Pasta with lean ground beef and tomato sauce', descriptionBn: 'টমেটো সস সহ চর্বিহীন গরুর মাংসের কিমা দিয়ে পাস্তা', calories: 550 },
        ],
      },
    },
    // --- CHILD (2-5) ---
    {
      condition: Condition.CHILD,
      ageGroup: AgeGroup.TWO_TO_FIVE,
      titleEn: 'Nutrition Plan for Toddlers (2-5 years)',
      titleBn: 'ছোটদের জন্য পুষ্টি পরিকল্পনা (২-৫ বছর)',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Small pancake with fruit', descriptionBn: 'ফল সহ ছোট প্যানকেক', calories: 200 },
          { mealType: MealType.SNACK, order: 2, descriptionEn: 'Apple slices with cheese', descriptionBn: 'পনির দিয়ে আপেলের টুকরো', calories: 100 },
          { mealType: MealType.LUNCH, order: 3, descriptionEn: 'Mild chicken curry with rice', descriptionBn: 'ভাত দিয়ে হালকা চিকেন কারি', calories: 300 },
          { mealType: MealType.DINNER, order: 4, descriptionEn: 'Mashed vegetables with soft fish', descriptionBn: 'নরম মাছ দিয়ে মাখানো সবজি', calories: 250 },
        ],
      },
    },
    {
      condition: Condition.CHILD,
      ageGroup: AgeGroup.TWO_TO_FIVE,
      titleEn: 'Fun & Healthy Meals for Ages 2-5',
      titleBn: '২-৫ বছর বয়সীদের জন্য মজাদার ও স্বাস্থ্যকর খাবার',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Yogurt with a smiley face made of berries', descriptionBn: 'ফলের তৈরি স্মাইলি ফেস সহ দই', calories: 180 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Animal-shaped sandwiches', descriptionBn: 'পশুর আকৃতির স্যান্ডউইচ', calories: 280 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Mini pizzas on whole wheat pita', descriptionBn: 'গমের পিঠার উপর মিনি পিজ্জা', calories: 320 },
        ],
      },
    },
    // --- CHILD (6-10) ---
    {
      condition: Condition.CHILD,
      ageGroup: AgeGroup.SIX_TO_TEN,
      titleEn: 'Growth & Energy Plan for Kids (6-10 years)',
      titleBn: 'বাচ্চাদের জন্য বৃদ্ধি ও শক্তির পরিকল্পনা (৬-১০ বছর)',
      isPublished: true,
      createdById: adminUser.id,
      meals: {
        create: [
          { mealType: MealType.BREAKFAST, order: 1, descriptionEn: 'Cereal with milk and a banana', descriptionBn: 'দুধ এবং কলা দিয়ে সিরিয়াল', calories: 350 },
          { mealType: MealType.LUNCH, order: 2, descriptionEn: 'Chicken wrap with lettuce and tomato', descriptionBn: 'লেটুস এবং টমেটো সহ চিকেন র‍্যাপ', calories: 450 },
          { mealType: MealType.DINNER, order: 3, descriptionEn: 'Spaghetti bolognese with hidden veggies', descriptionBn: 'লুকানো সবজি সহ স্প্যাগেটি বোলোগনিজ', calories: 500 },
        ],
      },
    },
  ];

  for (const planData of dietPlans) {
    const plan = await prisma.dietPlan.create({
      data: planData,
    });
    console.log(`Created plan: ${plan.titleEn}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });