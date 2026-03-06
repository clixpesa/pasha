import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
import { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const storage = new MMKV();

export const zustandMmkvStorage: StateStorage = {
	setItem: (name: string, value: string) => {
		return storage.set(name, value);
	},
	getItem: (name: string) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name: string) => {
		return storage.delete(name);
	},
};

export const appStorage = {
	_encrypt: async (key: string, value: string) => {
		const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
		const cipher = new aesjs.ModeOfOperation.ctr(
			encryptionKey,
			new aesjs.Counter(1),
		);
		const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
		await SecureStore.setItemAsync(
			key,
			aesjs.utils.hex.fromBytes(encryptionKey),
		);
		return aesjs.utils.hex.fromBytes(encryptedBytes);
	},

	_decrypt: async (key: string, value: string) => {
		const encryptionKeyHex = await SecureStore.getItemAsync(key);
		if (!encryptionKeyHex) {
			return encryptionKeyHex;
		}
		const cipher = new aesjs.ModeOfOperation.ctr(
			aesjs.utils.hex.toBytes(encryptionKeyHex),
			new aesjs.Counter(1),
		);
		const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
		return aesjs.utils.utf8.fromBytes(decryptedBytes);
	},

	getItem: async <T>(key: string): Promise<T | null> => {
		const enValue = storage.getString(key);
		if (!enValue) {
			return enValue ? JSON.parse(enValue) : null;
		}
		const value = await appStorage._decrypt(key, enValue);
		return value ? JSON.parse(value) : null;
	},

	setItem: async <T>(key: string, value: T): Promise<void> => {
		const enValue = await appStorage._encrypt(key, JSON.stringify(value));
		storage.set(key, enValue);
	},

	removeItem: async (key: string): Promise<void> => {
		await SecureStore.deleteItemAsync(key);
		storage.delete(key);
	},
};
