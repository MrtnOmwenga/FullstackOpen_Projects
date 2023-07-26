const User = require('../models/users');

const initialUsers = [
  {
    username: '_kevinlacey',
    _name: 'Kevin Lacey',
    password: 'KevinLacey123',
  },
  {
    username: '_adalovelace',
    _name: 'Ada Lovelace',
    password: 'AdaLovelace123',
  },
  {
    username: '_danabramov',
    _name: 'Dan Abramov',
    password: 'DanAbramov123',
  },
  {
    username: '_marypoppendieck',
    _name: 'Mary Poppendieck',
    password: 'MaryPoppendieck123',
  },
  {
    username: '_lewishamilton',
    _name: 'Lewis Hamilton',
    password: 'LewisHamilton123',
  }
];

const usersInDB = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

module.exports = {
  initialUsers, usersInDB
};