import fs from 'fs';
import crypto from 'crypto';
import path from 'path';


const IV_LENGTH = 16;
const shaHash = (str:string, pad:number=0) => crypto.createHash('sha256').update(str).digest('hex').substring(0, (IV_LENGTH*2) - pad);


/**
 * @function getObject
 * @param {String} key
 * '.' 를 기준으로 key 하위 오브젝트를 한 번에 반환한다.
 */
const getObject = (obj: object, key: any, midx: number = 0, rtn: object = obj) => {
	if ( Array.isArray(key) ) {
		if ( rtn === undefined || key.length-midx <= 0 ) {
			if ( key.length > 0 ) {
				return {d: rtn, k: key[0]};
			}
			return rtn;
		} else {
			rtn = rtn[key.shift()];
			if ( rtn === undefined ) {
				return undefined;
			}
		}
	} else if ( typeof key === "string" ) {
		key = key.split('.');
	}
	return getObject(obj, key, midx, rtn);
};

export class Cfg {
	private cfg: object = {};
	private cfgFile: string = '';
	private hash: string = '';
	private iv: Buffer;
	private time: string = '';

	constructor(file: string) {
		this.cfgFile = file;
		this.cfg = {};

		if ( fs.existsSync(this.cfgFile) ) {
			try {
				const str = fs.readFileSync(this.cfgFile, { encoding: 'utf8' });
				let idx = 0;

				const iv_len_str = str.slice(0, 4);
				const iv_len = parseInt(iv_len_str, 10);

				idx += iv_len_str.length;

				const iv_str = str.slice(idx, idx + iv_len)
				this.iv = Buffer.from(iv_str, 'hex');

				idx += iv_str.length;

				const time_len_str = str.slice(idx, idx+4);
				const time_len = parseInt(time_len_str, 10);

				idx += time_len_str.length;

				const time = str.slice(idx, idx+time_len);
				this.time = time;
				idx += time.length;

				const cfgB64 = str.slice(idx, idx + str.length);
				this.hash = time + shaHash(path.basename(this.cfgFile), time_len);

				const cfgStr = this.__decoding(cfgB64);
				this.cfg = JSON.parse(cfgStr);
			} catch(err) {
				throw err;
			}
		} else {
			throw new Error("Not exists file. " + this.cfgFile);
		}
	}

	__encoding = (str: string) => {
		const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(this.hash, 'utf8'), this.iv);
		let result = cipher.update(str, 'utf8', 'base64');
		result += cipher.final('base64');
		return result;
	}


	__decoding = (str) => {
		const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(this.hash, 'utf8'), this.iv);
		let result = decipher.update(str, 'base64', 'utf8');
		result += decipher.final('utf8');
		return result;
	}


	save() {
		const cfgStr = JSON.stringify(this.cfg);
		const cfgB64 = this.__encoding(cfgStr);
		const ivStr = this.iv.toString('hex');
		fs.writeFileSync(
			ivStr.length.toString().padStart(4, '0') +
			ivStr +
			this.time.length.toString().padStart(4, '0') +
			this.time.toString() +
			this.cfgFile, cfgB64, { encoding: 'utf8' });
		return;
	}

	set(key: string, value: any) {
		const sk = key.split('.');
		const _set = (obj, kidx = 0) => {
			if ( sk.length-1 === kidx ) {
				obj[sk[kidx]] = value;
				return;
			}

			if ( typeof obj[sk[kidx]] === "undefined" ) {
				obj[sk[kidx]] = {};
			}

			_set(obj[sk[kidx]], kidx+1);
		}
		_set(this.cfg, 0);
	}

	overwrite(key: string, value: any) {
		const sk = key.split('.');
		const _overwrite = (obj: object, kidx: number = 0) => {
			const skey:string = sk[kidx];
			if ( sk.length-1 === kidx ) {
				const oldValue = obj[skey];

				if ( typeof oldValue === "object" && typeof value === "object" ) {
					const newKeys = Object.keys(value);
					newKeys.forEach(k => {
						oldValue[k] = value[k];
					});
				} else {
					obj[skey] = value;
				}
				return;
			}

			if ( typeof obj[skey] === "undefined" ) {
				obj[skey] = {};
			}

			_overwrite(obj[skey], kidx+1);
		}
		_overwrite(this.cfg);
	}

	get(key: string) {
		return getObject(this.cfg, key);
	}
}

