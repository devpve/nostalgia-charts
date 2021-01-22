const Group = require('../models/Group');
const _ = require('lodash');

const group_index = async (req, res) => {

  const displayName = req.user.displayName;
  const username = req.user.username;
  const userImg = req.user.image;
  const userId = req.user._id;

  Group.find().sort({createdAt: -1 })
  .then((result) => {
    res.render('groups', { title: 'Grupos', name: displayName, username: username, image: userImg, groups: result.filter(group => _.isEqual(group.owner, userId)) });
  })
  .catch((err) => {
    console.log(err);
  })

}

// get a string like: a, b, c, d
// return array of strings: ['a', 'b', 'c', 'd']
const getUsers = (users) => {
  
  return (users.replace(/ /g, '')).split(",");
}

const group_create = async(req, res) => {
  // creating new group
  req.body.owner = req.user;

  let users = req.body.users;
  users = getUsers(users);

  req.body.users = users;

  const group = new Group(req.body);
  group.save()
    .then(() => {
      res.redirect('/groups');
    })
    .catch((err) => {
      console.log(err);
    })
}

const group_delete = async(req, res) => {

  const id = req.params.id;

  Group.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/groups' })
    })
    .catch(err => {
      console.log(err);
    })
}

const group_edit = async (req, res) => {

  const id = req.params.id;

  Group.findById(id)
    .then(group => {
      if (req.body.name)
        group.name = req.body.name;
      if (req.body.description)
        group.description = req.body.description;
      if (req.body.users)
        group.users = getUsers(req.body.users);
      if (req.body.image)
        group.image = req.body.image;

      group.save()
        .then(() => {
          res.redirect('/groups');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
    
}

const group_member_add = async (req, res) => {

  const id = req.params.id;

  Group.findById(id)
    .then(group => {
      if (req.body.users)
        group.users = group.users.concat(getUsers(req.body.users));
      
      group.save()
        .then(() => {
          res.redirect('/groups');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err))
}

const group_member_delete = async (req, res) => {

  const id = req.params.id;
  const userToDelete = req.body.users;
  console.log(userToDelete);

  Group.findById(id) 
    .then(group => {
      group.users = group.users.filter(e => e !== userToDelete);
      group.save()
        .then(() => {
          res.redirect('/groups');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

module.exports = {
  group_index,
  group_create,
  group_delete,
  group_edit,
  group_member_add,
  group_member_delete
}