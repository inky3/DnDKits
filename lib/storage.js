// Thin data layer: uses Firestore if configured, otherwise falls back to
// localStorage so the app is usable immediately without setup.

import { db, hasConfig } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

function localKey(collectionName) {
  return `dnd-toolkit:${collectionName}`;
}

function readLocal(collectionName) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(localKey(collectionName));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(collectionName, items) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(localKey(collectionName), JSON.stringify(items));
}

export async function listItems(collectionName) {
  if (hasConfig && db) {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return readLocal(collectionName);
}

export async function addItem(collectionName, data) {
  if (hasConfig && db) {
    const ref = await addDoc(collection(db, collectionName), data);
    return { id: ref.id, ...data };
  }
  const items = readLocal(collectionName);
  const newItem = { id: `local-${Date.now()}`, ...data };
  writeLocal(collectionName, [...items, newItem]);
  return newItem;
}

export async function updateItem(collectionName, id, data) {
  if (hasConfig && db) {
    await setDoc(doc(db, collectionName, id), data);
    return { id, ...data };
  }
  const items = readLocal(collectionName);
  const updated = { id, ...data };
  writeLocal(
    collectionName,
    items.map((i) => (i.id === id ? updated : i))
  );
  return updated;
}

export async function removeItem(collectionName, id) {
  if (hasConfig && db) {
    await deleteDoc(doc(db, collectionName, id));
    return;
  }
  const items = readLocal(collectionName);
  writeLocal(
    collectionName,
    items.filter((i) => i.id !== id)
  );
}