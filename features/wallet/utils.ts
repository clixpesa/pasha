import * as aes from "aes-js";
import QuickCrypto from "react-native-quick-crypto";

export const decryptMnemonic = async (
	enMnemonic: string,
	keyParams: string,
) => {
	const key = QuickCrypto.createHash("sha256").update(keyParams).digest();
	const dMnemonic = aes.utils.hex.toBytes(enMnemonic);
	const dCounter = new aes.Counter(dMnemonic.slice(0, 16));
	const decryptCipher = new aes.ModeOfOperation.ctr(key, dCounter);
	const decryptedBytes = decryptCipher.decrypt(dMnemonic.slice(16));
	return aes.utils.utf8.fromBytes(decryptedBytes);
};
