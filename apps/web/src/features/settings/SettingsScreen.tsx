'use client';

import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { PageFrame } from '@/components/ui/PageFrame';
import { useSettingsStore } from './settings-store';
import type { Settings } from './settings-store';

interface OptionsProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

const Options = <T extends string>({ label, value, options, onChange }: OptionsProps<T>) => (
  <fieldset className="flex flex-col gap-2">
    <legend className="mb-2 font-bold">{label}</legend>
    <div className="flex gap-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-sm font-bold ${
            option.value === value ? 'bg-paycheck text-surface-950' : 'bg-surface-700'
          }`}
        >
          <input
            type="radio"
            name={label}
            className="sr-only"
            checked={option.value === value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  </fieldset>
);

const SIZES: readonly { value: Settings['textSize']; label: string }[] = [
  { value: 'normal', label: 'Vừa' },
  { value: 'large', label: 'Lớn' },
];

const SPEEDS: readonly { value: Settings['textSpeed']; label: string }[] = [
  { value: 'slow', label: 'Chậm' },
  { value: 'normal', label: 'Vừa' },
  { value: 'instant', label: 'Hiện ngay' },
];

const GRAPHICS: readonly { value: Settings['graphics']; label: string }[] = [
  { value: 'auto', label: 'Tự động' },
  { value: '3d', label: 'Luôn 3D' },
  { value: '2d', label: '2D' },
];

export const SettingsScreen = () => {
  const { textSize, textSpeed, volume, ambience, graphics, change } = useSettingsStore();

  return (
    <PageFrame title="Cài đặt">
      <Options
        label="Cỡ chữ"
        value={textSize}
        options={SIZES}
        onChange={(value) => change({ textSize: value })}
      />
      <Options
        label="Tốc độ chữ"
        value={textSpeed}
        options={SPEEDS}
        onChange={(value) => change({ textSpeed: value })}
      />
      <Options
        label="Đồ họa"
        value={graphics}
        options={GRAPHICS}
        onChange={(value) => change({ graphics: value })}
      />
      <label className="flex flex-col gap-2">
        <span className="font-bold">Âm lượng</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(event) => change({ volume: Number(event.target.value) / 100 })}
          className="accent-paycheck h-11"
        />
      </label>
      <label className="flex min-h-11 items-center justify-between gap-3 font-bold">
        Tiếng đèn huỳnh quang
        <input
          type="checkbox"
          checked={ambience}
          onChange={(event) => change({ ambience: event.target.checked })}
          className="accent-paycheck size-6"
        />
      </label>
      <Link href="/" className={buttonClass('quiet')}>
        Quay lại
      </Link>
    </PageFrame>
  );
};
