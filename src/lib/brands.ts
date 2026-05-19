// Marques de cigarettes vendues en France (prix indicatifs 2026)
// Source: prix moyens marché français — Tabac Info Service / observatoire des prix

export type Brand = {
  id: string;
  name: string;
  manufacturer?: string;
  pack_price: number;
  cigs_per_pack: number;
};

export const BRANDS: Brand[] = [
  { id: "marlboro-red", name: "Marlboro Red", manufacturer: "Philip Morris", pack_price: 12.5, cigs_per_pack: 20 },
  { id: "marlboro-gold", name: "Marlboro Gold", manufacturer: "Philip Morris", pack_price: 12.5, cigs_per_pack: 20 },
  { id: "marlboro-touch", name: "Marlboro Touch", manufacturer: "Philip Morris", pack_price: 12.7, cigs_per_pack: 20 },
  { id: "philip-morris", name: "Philip Morris", manufacturer: "Philip Morris", pack_price: 11.5, cigs_per_pack: 20 },
  { id: "camel-filter", name: "Camel Filtres", manufacturer: "JTI", pack_price: 12.3, cigs_per_pack: 20 },
  { id: "camel-blue", name: "Camel Blue", manufacturer: "JTI", pack_price: 12.3, cigs_per_pack: 20 },
  { id: "winston-red", name: "Winston Red", manufacturer: "JTI", pack_price: 12.0, cigs_per_pack: 20 },
  { id: "winston-classic", name: "Winston Classic", manufacturer: "JTI", pack_price: 12.0, cigs_per_pack: 20 },
  { id: "lucky-strike-red", name: "Lucky Strike Red", manufacturer: "BAT", pack_price: 12.2, cigs_per_pack: 20 },
  { id: "lucky-strike-original", name: "Lucky Strike Original", manufacturer: "BAT", pack_price: 12.2, cigs_per_pack: 20 },
  { id: "pall-mall-red", name: "Pall Mall Red", manufacturer: "BAT", pack_price: 11.4, cigs_per_pack: 20 },
  { id: "pall-mall-blue", name: "Pall Mall Blue", manufacturer: "BAT", pack_price: 11.4, cigs_per_pack: 20 },
  { id: "rothmans-red", name: "Rothmans Red", manufacturer: "BAT", pack_price: 11.2, cigs_per_pack: 20 },
  { id: "rothmans-blue", name: "Rothmans Blue", manufacturer: "BAT", pack_price: 11.2, cigs_per_pack: 20 },
  { id: "gauloises-blondes", name: "Gauloises Blondes", manufacturer: "Seita", pack_price: 11.8, cigs_per_pack: 20 },
  { id: "gauloises-brunes", name: "Gauloises Brunes", manufacturer: "Seita", pack_price: 11.8, cigs_per_pack: 20 },
  { id: "gitanes", name: "Gitanes", manufacturer: "Seita", pack_price: 11.5, cigs_per_pack: 20 },
  { id: "news-red", name: "News Red", manufacturer: "Seita", pack_price: 10.8, cigs_per_pack: 20 },
  { id: "news-blue", name: "News Blue", manufacturer: "Seita", pack_price: 10.8, cigs_per_pack: 20 },
  { id: "lm-red", name: "L&M Red", manufacturer: "Philip Morris", pack_price: 11.5, cigs_per_pack: 20 },
  { id: "lm-blue", name: "L&M Blue", manufacturer: "Philip Morris", pack_price: 11.5, cigs_per_pack: 20 },
  { id: "chesterfield-red", name: "Chesterfield Red", manufacturer: "Philip Morris", pack_price: 11.2, cigs_per_pack: 20 },
  { id: "chesterfield-blue", name: "Chesterfield Blue", manufacturer: "Philip Morris", pack_price: 11.2, cigs_per_pack: 20 },
  { id: "fortuna-red", name: "Fortuna Red", manufacturer: "Logista", pack_price: 10.6, cigs_per_pack: 20 },
  { id: "vogue-bleue", name: "Vogue Bleue", manufacturer: "BAT", pack_price: 12.6, cigs_per_pack: 20 },
  { id: "vogue-menthol", name: "Vogue Menthol", manufacturer: "BAT", pack_price: 12.6, cigs_per_pack: 20 },
  { id: "dunhill", name: "Dunhill", manufacturer: "BAT", pack_price: 13.2, cigs_per_pack: 20 },
  { id: "davidoff", name: "Davidoff", manufacturer: "Imperial", pack_price: 13.4, cigs_per_pack: 20 },
  { id: "richmond", name: "Richmond", manufacturer: "Imperial", pack_price: 10.9, cigs_per_pack: 20 },
  { id: "jps-red", name: "JPS Red", manufacturer: "Imperial", pack_price: 10.8, cigs_per_pack: 20 },
  { id: "jps-blue", name: "JPS Blue", manufacturer: "Imperial", pack_price: 10.8, cigs_per_pack: 20 },
  { id: "roule-amsterdamer", name: "Amsterdamer (à rouler)", manufacturer: "JTI", pack_price: 22.0, cigs_per_pack: 50 },
  { id: "roule-pueblo", name: "Pueblo (à rouler)", manufacturer: "Pueblo Tabak", pack_price: 21.0, cigs_per_pack: 50 },
  { id: "roule-marlboro", name: "Marlboro (à rouler)", manufacturer: "Philip Morris", pack_price: 21.5, cigs_per_pack: 50 },
  { id: "ovs", name: "Marque distributeur / OVS", pack_price: 10.5, cigs_per_pack: 20 },
  { id: "autre", name: "Autre / Personnalisée", pack_price: 12.0, cigs_per_pack: 20 },
];

export function findBrand(id: string | undefined | null): Brand | undefined {
  if (!id) return undefined;
  return BRANDS.find((b) => b.id === id);
}
