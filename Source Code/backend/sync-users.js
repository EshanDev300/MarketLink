const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function sync() {
  await mongoose.connect('mongodb://127.0.0.1:27017/marketlink');
  const hashAdmin = bcrypt.hashSync('admin123', 10);
  const hashFarmer = bcrypt.hashSync('farmer123', 10);
  const hashCustomer = bcrypt.hashSync('customer123', 10);

  await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@marketlink.com' },
    { $set: { password: hashAdmin, password_hash: hashAdmin } }
  );
  await mongoose.connection.db.collection('users').updateMany(
    { role: 'farmer' },
    { $set: { password: hashFarmer, password_hash: hashFarmer } }
  );
  await mongoose.connection.db.collection('users').updateMany(
    { role: 'customer' },
    { $set: { password: hashCustomer, password_hash: hashCustomer } }
  );

  console.log('User passwords successfully updated to standard credentials:');
  console.log('Admin: admin@marketlink.com / admin123');
  console.log('Farmer: greenvalley@marketlink.com / farmer123');
  console.log('Customer: priya@marketlink.com / customer123');
  process.exit(0);
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
