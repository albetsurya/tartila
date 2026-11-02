import type { FC } from "react";
import type { SvgProps } from "@/components/ui/CustomIcons";
import {
  BuahApelSvg,
  PotonganApelSvg,
  BuahSemangkaSvg,
  PotonganSemangkaSvg,
  BuahJerukSvg,
  PotonganJerukSvg,
  BuahAnggurSvg,
  PotonganAnggurSvg,
  BuahKurmaSvg,
  PotonganKurmaSvg,
  BuahPirSvg,
  PotonganPirSvg,
  BuahStroberiSvg,
  PotonganStroberiSvg,
  BuahPisangSvg,
  PotonganPisangSvg,
} from "@/components/ui/Illustrations";

export interface FruitVariant {
  id: string;
  label: string;
  FruitWhole: FC<SvgProps>;
  FruitSliced: FC<SvgProps>;
  color: string; // warna splatter
}

export const FRUIT_VARIANTS: FruitVariant[] = [
  { id: "apple", label: "Apel", FruitWhole: BuahApelSvg, FruitSliced: PotonganApelSvg, color: "#EF4444" },
  { id: "watermelon", label: "Semangka", FruitWhole: BuahSemangkaSvg, FruitSliced: PotonganSemangkaSvg, color: "#EC4899" },
  { id: "orange", label: "Jeruk", FruitWhole: BuahJerukSvg, FruitSliced: PotonganJerukSvg, color: "#F97316" },
  { id: "grape", label: "Anggur", FruitWhole: BuahAnggurSvg, FruitSliced: PotonganAnggurSvg, color: "#8B5CF6" },
  { id: "kurma", label: "Kurma", FruitWhole: BuahKurmaSvg, FruitSliced: PotonganKurmaSvg, color: "#854D0E" },
  { id: "pear", label: "Pir", FruitWhole: BuahPirSvg, FruitSliced: PotonganPirSvg, color: "#22C55E" },
  { id: "strawberry", label: "Stroberi", FruitWhole: BuahStroberiSvg, FruitSliced: PotonganStroberiSvg, color: "#F43F5E" },
  { id: "banana", label: "Pisang", FruitWhole: BuahPisangSvg, FruitSliced: PotonganPisangSvg, color: "#FDE047" },
];
