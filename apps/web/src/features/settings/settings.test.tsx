import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DialogueBox } from '@/features/dialogue/DialogueBox';
import { DEFAULT_SETTINGS, useSettingsStore } from './settings-store';
import { SettingsApplier } from './SettingsApplier';
import { SettingsScreen } from './SettingsScreen';

const KEY = 'cstar.settings';
const initial = useSettingsStore.getState();

describe('settings (SCENARIO-051)', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.setState(initial, true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts from the defaults', () => {
    useSettingsStore.getState().load();
    expect(useSettingsStore.getState().textSize).toBe(DEFAULT_SETTINGS.textSize);
  });

  it('are kept across visits', async () => {
    render(<SettingsScreen />);
    await userEvent.click(screen.getByRole('radio', { name: 'Lớn' }));
    expect(JSON.parse(localStorage.getItem(KEY) as string)).toMatchObject({ textSize: 'large' });

    useSettingsStore.setState(initial, true);
    useSettingsStore.getState().load();
    expect(useSettingsStore.getState().textSize).toBe('large');
  });

  it('ignore a damaged value', () => {
    localStorage.setItem(KEY, '{"textSize":"gigantic"}');
    useSettingsStore.getState().load();
    expect(useSettingsStore.getState().textSize).toBe('normal');
    localStorage.setItem(KEY, 'không phải json');
    useSettingsStore.getState().load();
    expect(useSettingsStore.getState().textSize).toBe('normal');
  });

  it('last the visit when the browser blocks storage', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(() => useSettingsStore.getState().change({ volume: 0.1 })).not.toThrow();
    expect(useSettingsStore.getState().volume).toBe(0.1);
  });

  it('reach the page through the text size attribute', () => {
    useSettingsStore.getState().change({ textSize: 'large' });
    render(<SettingsApplier />);
    expect(document.documentElement.dataset.textSize).toBe('large');
  });

  it('can show text at once', () => {
    useSettingsStore.getState().change({ textSpeed: 'instant' });
    render(
      <DialogueBox
        view={{
          sceneId: 's',
          nodeId: 'a',
          speaker: null,
          text: 'Một câu.',
          choices: [],
          canAdvance: true,
        }}
        onAdvance={() => {}}
        onChoose={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Đọc tiếp' })).toBeInTheDocument();
  });

  it('change the sound', async () => {
    render(<SettingsScreen />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Tiếng đèn huỳnh quang' }));
    expect(useSettingsStore.getState().ambience).toBe(false);
  });
});
