import JsonRW from 'jsonrw';
import { onlyEmoji } from 'emoji-aware';
import { boolean } from 'joi';

const createRole = async (guild, role, categoryId, icon?) => {
  // Health Check - Fetch Role from cache and check if it exists as category
  console.log('Roles');
  const categoryRole = guild.roles.cache.get(categoryId);
  const Roles = await JsonRW.Read('./_roles.json');
  const catagory = Roles[guild.id].selfRoles.find((c) => c.id == categoryRole.id);
  if (!catagory) throw new Error('Invalid category: ' + categoryRole.name);

  // create role
  const newRole = await guild.roles.create({
    name: role,
    color: '#ffffff',
    position: categoryRole.position + 1,
  });
  // add role to category
  Roles[guild.id].selfRoles
    .find((c) => c.id == categoryRole.id)
    ?.roles.push({
      id: newRole.id,
      label: role,
      icon: icon ? iconId(icon) : undefined,
    });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};

const listRoles = async (guild, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  const list = Roles[guild.id].selfRoles
    .find((c) => c.id == category)
    ?.roles.map((r) => {
      return { id: r.id, label: r.label, icon: r.icon };
    });
  return list;
};

const deleteRole = async (guild, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[guild.id].selfRoles.forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
  // delete role
  if (!Roles[guild.id].protectedRoles.includes(role)) await guild.roles.cache.get(role).delete();
  else return;
};

const linkRole = async (guild, role, category, icon?) => {
  const categoryRole = await guild.roles.cache.get(category);
  const newRole = await guild.roles.cache.get(role);
  // add role to category
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[guild.id].selfRoles
    .find((c) => c.id == categoryRole.id)
    ?.roles.push({
      id: newRole.id,
      label: newRole.name,
      icon: iconId(icon),
    });
  // add role to self roles
  await JsonRW.Write('./_roles.json', Roles);
};

const delinkRole = async (guild, role, category?) => {
  // TODO: delink role from specific category
  // remove role from self roles
  const Roles = await JsonRW.Read('./_roles.json');
  Roles[guild.id].selfRoles.forEach((c) => {
    const found = c.roles.find((r) => r.id == role);
    if (found) c.roles.splice(c.roles.indexOf(found), 1);
  });
  // remove role from category
  await JsonRW.Write('./_roles.json', Roles);
};

const createCategory = async (guild, category) => {
  console.log(category);
  // create category
  const newCatagory = await guild.roles.create({
    name: `== ${category} ==`,
    color: '#ffffff',
  });
  const Roles = await JsonRW.Read('./_roles.json');
  // TODO: Make sure category is not already in the list
  const exists = Roles[guild.id].selfRoles.find((c) => c.id == newCatagory.id);
  if (!exists)
    Roles[guild.id].selfRoles.push({
      label: newCatagory.name.substring(3, newCatagory.name.length - 3),
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

const deleteCategory = async (guild, category, bias?) => {
  // delete category from self roles
  const Roles: any[] = await JsonRW.Read('./_roles.json');
  Roles[guild.id].selfRoles.forEach((c, i) => {
    if (c.id == category) delete Roles[guild.id].selfRoles[i];
  });
  Roles[guild.id].selfRoles = Roles[guild.id].selfRoles.filter(boolean);
  // delete category
  await JsonRW.Write('./_roles.json', Roles);
  if (bias) if (!Roles[guild.id].protectedRoles.includes(category)) await guild.roles.cache.get(category).delete();
};

const purgeRoles = async (guild, confirmation) => {
  if (confirmation != 'YES') throw new Error('Invalid confirmation');
  const Roles: { protectedRoles: string[]; selfRoles: any[] } = await JsonRW.Read('./_roles.json');
  const usedRoles = new Set();
  Roles[guild.id].selfRoles.forEach((c) => {
    usedRoles.add(c.id);
    c.roles.forEach((r) => {
      usedRoles.add(r.id);
    });
  });
  Roles[guild.id].protectedRoles.forEach((r) => usedRoles.add(r));
  const roles = await guild.roles.cache.filter((r) => !usedRoles.has(r.id));

  for (const role of roles.values()) {
    await role.delete().catch(() => {
      /* fail silently */
    });
  }
};

export default { createRole, listRoles, deleteRole, linkRole, delinkRole, createCategory, listCategories, deleteCategory, purgeRoles };

const iconId = (emoji) => {
  if (!emoji) return undefined;
  if (emoji.startsWith('<:')) {
    return emoji.split(':')[2].split('>')[0];
  }
  return onlyEmoji(emoji)[0];
};
