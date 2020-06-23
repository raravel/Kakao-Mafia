import * as kakao from "./node-kakao";
import { Cfg } from "./plugins/config";

const client = new kakao.TalkClient('Kakao-Mafia');
const cfg = new Cfg('config.json');


client.on('message', async (chat: kakao.Chat) => {
	console.log(chat);
});

(async () => {
	try {
	await client.login(cfg.get('email'), cfg.get('passwd'), cfg.get('duuid'));
	console.log(client.ClientUser);
	} catch (err) {
		console.log(err);
	}
})();


