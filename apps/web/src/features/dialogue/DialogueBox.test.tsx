import type { NodeView } from '@cstar/game-core';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DialogueBox } from './DialogueBox';

const line: NodeView = {
  sceneId: 's',
  nodeId: 'a',
  speaker: 'boss',
  text: 'Chúng ta là một gia đình.',
  choices: [],
  canAdvance: true,
};

const choices: NodeView = {
  ...line,
  canAdvance: false,
  choices: [
    { id: 'yes', text: 'Dạ vâng', available: true },
    { id: 'no', text: 'Lương đâu ạ?', available: false, lockedReason: 'Cần phiếu lương' },
  ],
};

const reducedMotion = (reduce: boolean) =>
  vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: reduce } as MediaQueryList);

const setup = (view: NodeView) => {
  const onAdvance = vi.fn();
  const onChoose = vi.fn();
  render(<DialogueBox view={view} onAdvance={onAdvance} onChoose={onChoose} />);
  return { onAdvance, onChoose };
};

describe('DialogueBox', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows who speaks (SCENARIO-019)', () => {
    reducedMotion(true);
    setup(line);
    expect(screen.getByRole('button', { name: 'Đọc tiếp' })).toHaveTextContent(
      'Phó GĐ Jeon Gwang-hoe',
    );
  });

  it('types the line, then a tap moves on, never both at once (SCENARIO-019)', async () => {
    reducedMotion(false);
    const { onAdvance } = setup(line);

    await userEvent.click(screen.getByRole('button', { name: 'Hiện hết câu' }));
    expect(onAdvance).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Đọc tiếp' }));
    expect(onAdvance).toHaveBeenCalledOnce();
  });

  it('finishes typing on its own', () => {
    vi.useFakeTimers();
    reducedMotion(false);
    setup(line);
    act(() => {
      for (let i = 0; i <= line.text.length; i += 1) {
        vi.advanceTimersByTime(20);
      }
    });
    expect(screen.getByRole('button', { name: 'Đọc tiếp' })).toBeInTheDocument();
  });

  it('gives screen readers the whole line and who says it, from the start', () => {
    reducedMotion(false);
    setup(line);
    expect(screen.getByRole('status')).toHaveTextContent(`Phó GĐ Jeon Gwang-hoe: ${line.text}`);
  });

  it('shows the line at once with reduced motion (SCENARIO-022)', () => {
    reducedMotion(true);
    setup(line);
    expect(screen.getByRole('button', { name: 'Đọc tiếp' })).toBeInTheDocument();
  });

  it('holds the choices back until the line is out (SCENARIO-020)', async () => {
    reducedMotion(false);
    setup(choices);
    expect(screen.queryByRole('button', { name: 'Dạ vâng' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Hiện hết câu' }));
    expect(screen.getByRole('button', { name: 'Dạ vâng' })).toBeInTheDocument();
  });

  it('takes a choice; tapping the box does nothing then (SCENARIO-020)', async () => {
    reducedMotion(true);
    const { onAdvance, onChoose } = setup(choices);
    await userEvent.click(screen.getByRole('button', { name: 'Đọc tiếp' }));
    expect(onAdvance).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Dạ vâng' }));
    expect(onChoose).toHaveBeenCalledWith('yes');
  });

  it('shows a locked choice with its reason, and it cannot be taken', () => {
    reducedMotion(true);
    setup(choices);
    expect(screen.getByRole('button', { name: 'Lương đâu ạ?' })).toBeDisabled();
    expect(screen.getByText('Cần phiếu lương')).toBeInTheDocument();
  });

  it('answers the keyboard (SCENARIO-023)', () => {
    reducedMotion(true);
    const { onAdvance } = setup(line);
    fireEvent.keyDown(window, { key: ' ' });
    expect(onAdvance).toHaveBeenCalledOnce();
  });

  it('takes number keys, and not for a locked choice (SCENARIO-023)', () => {
    reducedMotion(true);
    const { onChoose } = setup(choices);
    fireEvent.keyDown(window, { key: '2' });
    expect(onChoose).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: '1' });
    expect(onChoose).toHaveBeenCalledWith('yes');
  });

  it('ignores letter keys', () => {
    reducedMotion(true);
    const { onAdvance, onChoose } = setup(choices);
    fireEvent.keyDown(window, { key: 'a' });
    expect(onAdvance).not.toHaveBeenCalled();
    expect(onChoose).not.toHaveBeenCalled();
  });
});
