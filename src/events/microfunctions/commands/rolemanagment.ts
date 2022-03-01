import JsonRW from 'jsonrw';
const devServer = '946563674858979358';
const protectedRoles = ['946568242229542966','946564758935576617','946564798823399494','946564812303900743','946785451002462208','946787183434563665','946564816414339132'];

const createRole = async (client, role, category, icon?) => {
  const categoryRole = await client.guilds.cache.get(devServer).roles.cache.get(category);
  // create role
  const newRole = await client.guilds.cache.get(devServer).roles.create({
    name: role,
    color: '#ffffff',
    position: categoryRole.position + 1,
  });
  // add role to category
  const Roles = await JsonRW.Read('src/../_roles.json');
  Roles.find((c) => c.id == categoryRole.id).roles.push({
    id: newRole.id,
    label: role,
    icon: icon,
  });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const deleteRole = async (client, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('src/../_roles.json');
  Roles.forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
  // delete role
  if(!protectedRoles.includes(role))
  await client.guilds.cache.get(devServer).roles.cache.get(role).delete();
};
const linkRole = async (client, role, category, icon?) => {
  const categoryRole = await client.guilds.cache.get(devServer).roles.cache.get(category);
  const newRole = await client.guilds.cache.get(devServer).roles.cache.get(role);
  // add role to category
  const Roles = await JsonRW.Read('src/../_roles.json');
  Roles.find((c) => c.id == categoryRole.id).roles.push({
    id: newRole.id,
    label: role,
    icon: icon,
  });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const delinkRole = async (client, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('src/../_roles.json');
  Roles.forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
};
const createCategory = async (client, category) => {
  // create category
  const newCatagory = await client.guilds.cache.get(devServer).roles.create({
    name: category,
    color: '#ffffff',
  });
  const Roles = await JsonRW.Read('src/../_roles.json');
  // TODO: Make sure category is not already in the list
    Roles.push(	{
		"label": newCatagory.name,
		"id": newCatagory.id,
		"roles": []
    });
  // add category to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const deleteCategory = async (client, category, bias?) => {
  // delete category from self roles
  const Roles: any[] = await JsonRW.Read('src/../_roles.json');  
  Roles.forEach((c,i) => {
    if (c.id == category) Roles.splice(i, 1);
  });
  // delete category
  await JsonRW.Write('./_roles.json', Roles);
  if (bias)
  if(!protectedRoles.includes(category))
  await client.guilds.cache.get(devServer).roles.cache.get(category).delete();
};

export default { createRole, deleteRole, linkRole, delinkRole, createCategory, deleteCategory };
