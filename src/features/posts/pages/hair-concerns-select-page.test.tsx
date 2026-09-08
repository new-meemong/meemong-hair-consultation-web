import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { HairConcernsSelectPage } from './hair-concerns-select-page';

const state = vi.hoisted(() => ({
  saveContent: vi.fn(),
  savedContent: { step: 1, content: { hairConcerns: ['탈모', '얇은 모발', '지성두피'] } },
}));
vi.mock('@/shared/hooks/use-writing-content', () => ({ default: () => state }));
vi.mock('@/widgets/header', () => ({ SiteHeader: () => null }));
vi.mock('@/shared', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  ToggleChipGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ToggleChip: ({
    children,
    pressed,
    onPressedChange,
  }: {
    children: ReactNode;
    pressed: boolean;
    onPressedChange: () => void;
  }) => (
    <button aria-pressed={pressed} onClick={onPressedChange}>
      {children}
    </button>
  ),
}));
vi.mock('@/shared/ui/checkbox', () => ({
  default: ({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void }) => (
    <input type="checkbox" id={id} checked={checked} onChange={onChange} />
  ),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  state.savedContent.content.hairConcerns = ['탈모', '얇은 모발', '지성두피'];
});
it('restores mixed data as no concern and allows switching back to concerns', () => {
  state.savedContent.content.hairConcerns = ['탈모', '특별한 문제는 없어요'];
  render(<HairConcernsSelectPage onComplete={() => {}} onBack={() => {}} />);
  expect((screen.getByLabelText('특별한 문제는 없어요') as HTMLInputElement).checked).toBe(true);
  expect(
    screen.getByRole('button', { name: '적은 숱/가는 모발' }).getAttribute('aria-pressed'),
  ).toBe('false');
  fireEvent.click(screen.getByRole('button', { name: '컬러 얼룩' }));
  expect((screen.getByLabelText('특별한 문제는 없어요') as HTMLInputElement).checked).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: '완료' }));
  expect(state.saveContent).toHaveBeenLastCalledWith({
    step: 1,
    content: { hairConcerns: ['컬러 얼룩'] },
  });
});
it('restores merged options and saves a newly selected color concern', () => {
  const onComplete = vi.fn();
  render(<HairConcernsSelectPage onComplete={onComplete} onBack={() => {}} />);
  expect(
    screen.getByRole('button', { name: '적은 숱/가는 모발' }).getAttribute('aria-pressed'),
  ).toBe('true');
  expect(screen.queryByRole('button', { name: '탈모' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '옐로·레드 언더톤' }));
  fireEvent.click(screen.getByRole('button', { name: '완료' }));
  expect(state.saveContent).toHaveBeenCalledWith({
    step: 1,
    content: { hairConcerns: ['적은 숱/가는 모발', '두피 트러블', '옐로·레드 언더톤'] },
  });
  expect(onComplete).toHaveBeenCalledOnce();
});
it('keeps no concern exclusive and serializes its existing API value', () => {
  render(<HairConcernsSelectPage onComplete={() => {}} onBack={() => {}} />);
  fireEvent.click(screen.getByLabelText('특별한 문제는 없어요'));
  fireEvent.click(screen.getByRole('button', { name: '완료' }));
  expect(state.saveContent).toHaveBeenLastCalledWith({
    step: 1,
    content: { hairConcerns: ['특별한 문제는 없어요'] },
  });
});
