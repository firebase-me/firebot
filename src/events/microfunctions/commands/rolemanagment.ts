import JsonRW from 'jsonrw';
import { onlyEmoji } from 'emoji-aware';
const protectedRoles = [
  '946568242229542966',
  '946564758935576617',
  '946564798823399494',
  '946564812303900743',
  '946785451002462208',
  '946787183434563665',
  '946564816414339132',
];

const createRole = async (client, role, category, icon?) => {
  const categoryRole = await client.guilds.cache.get(client.guild.id).roles.cache.get(category);
  if (!categoryRole) return;
  // create role
  const newRole = await client.guilds.cache.get(client.guild.id).roles.create({
    name: role,
    color: '#ffffff',
    position: categoryRole.position + 1,
  });
  // add role to category
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[client.guild.id].find((c) => c.id == categoryRole.id).roles.push({
    id: newRole.id,
    label: role,
    icon: iconId(icon) || undefined,
  });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const listRoles = async (client, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  const list = Roles[client.guild.id].find((c) => c.id == category)?.roles.map((r) => {
    return { id: r.id, label: r.label, icon: r.icon };
  });
  return list;
};

const deleteRole = async (client, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[client.guild.id].forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
  // delete role
  if (!protectedRoles.includes(role)) await client.guilds.cache.get(client.guild.id).roles.cache.get(role).delete();
};
const linkRole = async (client, role, category, icon?) => {
  const categoryRole = await client.guilds.cache.get(client.guild.id).roles.cache.get(category);
  const newRole = await client.guilds.cache.get(client.guild.id).roles.cache.get(role);
  // add role to category
  const Roles = await JsonRW.Read('./_roles.json');
  Roles.find((c) => c.id == categoryRole.id).roles.push({
    id: newRole.id,
    label: role,
    icon: iconId(icon),
  });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const delinkRole = async (client, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[client.guild.id].forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
};
const createCategory = async (client, category) => {
  // create category
  const newCatagory = await client.guilds.cache.get(client.guild.id).roles.create({
    name: category,
    color: '#ffffff',
  });
  const Roles = await JsonRW.Read('./_roles.json');
  // TODO: Make sure category is not already in the list
  const exists = Roles.find((c) => c.id == newCatagory.id);
  if (!exists)
    Roles.push({
      label: `== ${newCatagory.name} ==`,
      id: newCatagory.id,
      roles: [],
    });
  // add category to self roles
  await JsonRW.Write('./_roles.json', Roles);
};
const listCategories = async (client) => {
  // delete category from self roles
  const Roles: any[] = await JsonRW.Read('./_roles.json');
  const list = Roles.map((i) => {
    return { label: i.label, roles: i.roles.length };
  });
  return list;
};

const deleteCategory = async (client, category, bias?) => {
  // delete category from self roles
  const Roles: any[] = await JsonRW.Read('./_roles.json');
  Roles[client.guild.id].forEach((c, i) => {
    if (c.id == category) Roles.splice(i, 1);
  });
  // delete category
  await JsonRW.Write('./_roles.json', Roles);
  if (bias) if (!protectedRoles.includes(category)) await client.guilds.cache.get(client.guild.id).roles.cache.get(category).delete();
};

const purgeRoles = async (client, confirmation) => {
  if (confirmation != 'YES') throw new Error('Invalid confirmation');
  const Roles: any[] = await JsonRW.Read('./_roles.json');
  const usedRoles = new Set();
  Roles[client.guild.id].forEach((c) => {
    usedRoles.add(c.id);
    c.roles.forEach((r) => {
      usedRoles.add(r.id);
    });
  });
  protectedRoles.forEach((r) => usedRoles.add(r));
  const roles = await client.guilds.cache.get(client.guild.id).roles.cache.filter((r) => !usedRoles.has(r.id));

  for (const role of roles.values()) {
    await role.delete().catch(() => {/* fail silently */});
  }
};

export default { createRole, listRoles, deleteRole, linkRole, delinkRole, createCategory, listCategories, deleteCategory, purgeRoles };

const iconId = (emoji) => {
  if (emoji.startsWith('<:')) {
    return emoji.split(':')[2].split('>')[0];
  }
  return onlyEmoji(emoji)[0];
};