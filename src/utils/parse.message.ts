// All messages and user commands must be processed through this function
export default (msg, config) => {
  const message = msg.content; // parse the valid string into it's arguments for further processing.
  let args = message.replace(/ /g, ' ').split(/\s+/); //split message into sections based on spaces, ignore any 0 length values

  let prefix = null;
  if (message.startsWith(config.prefixPublic)) prefix = config.prefixPublic;
  if (message.startsWith(config.prefixAdmin)) prefix = config.prefixAdmin;

  args[0] = args[0].replace(prefix, ''); // purge prefix from first arg to get pure value
  if (args[0] == '') args.shift();
  let command = args.shift(); // shift command from array list and save as a command
  let modifier = args[0]; // Split modifier from array list and save as a command
  let argresult = args.join(' '); //condense array into simplified string for secondary parsing

  if (command) command = command.toLowerCase();
  if (modifier) modifier = modifier.toLowerCase();

  return {
    command,
    modifier,
    args,
    argresult,
    prefix,
    origin: msg,
  };
};
