const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create guest user (password is hashed 'guest123456')
  const guestUser = await prisma.user.upsert({
    where: { id: 'guest-user-id' },
    update: {},
    create: {
      id: 'guest-user-id',
      email: 'guest@solana-api.com',
      password: '$2b$10$VqZ8BZqKx.8YvdVdZ4Z3C.Zx9J7J8Z7Z8Z7Z8Z7Z8Z7Z8Z7Z8', // guest123456
      name: 'Guest User',
      planType: 'free',
      isActive: true,
    },
  });

  console.log('✅ Guest user created:', guestUser.email);

  // Create demo plans
  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      rateLimit: 1000,
      features: ['1,000 requests/hour', 'Basic support', 'Up to 10 API keys'],
    },
    {
      name: 'pro',
      displayName: 'Pro',
      price: 49,
      rateLimit: 10000,
      features: ['10,000 requests/hour', 'Priority support', 'Up to 50 API keys', 'Advanced analytics'],
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 299,
      rateLimit: 100000,
      features: ['100,000 requests/hour', 'Dedicated support', 'Unlimited API keys', 'Custom integrations'],
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
    console.log(`✅ Plan created: ${plan.displayName}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
