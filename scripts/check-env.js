#!/usr/bin/env node

/**
 * Local Development Setup Checker
 * Run this to verify your environment is ready
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'REPLICATE_API_TOKEN',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'OPENAI_API_KEY'
];

console.log('🔍 Checking local development setup...\n');

let allGood = true;
const missing = [];
const present = [];

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    present.push(varName);
    console.log(`✅ ${varName}`);
  } else {
    missing.push(varName);
    console.log(`❌ ${varName} - MISSING`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${present.length}/${requiredEnvVars.length} variables configured\n`);

if (allGood) {
  console.log('🎉 All environment variables are set!');
  console.log('\n📝 Next steps:');
  console.log('   1. npm run dev');
  console.log('   2. Visit http://localhost:3000/api/debug');
  console.log('   3. Start generating thumbnails!\n');
} else {
  console.log('⚠️  Missing environment variables. Please add them to .env:\n');
  missing.forEach(varName => {
    console.log(`   ${varName}=your-value-here`);
  });
  console.log('\n📖 See README.md for details on getting these values.\n');
  process.exit(1);
}
