export function sendToChannels(client: any, message: string) {
  client.guilds.forEach((guild: any) => {
    //for each guild the bot is in
    let defaultChannel: any = '';
    guild.channels.forEach((channel: any) => {
      if (channel.type == 'text' && defaultChannel == '') {
        if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
          defaultChannel = channel;
        }
      }
    });
    defaultChannel.send(message);
  });
}
