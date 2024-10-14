import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export enum ViewType {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type TodoItem = {
  id: number;
  title: string;
  done: boolean;
};

export interface State {
  view: ViewType;
  items: TodoItem[];
  setView(view: ViewType): void;
  addItem(item: TodoItem): void;
  toggleItem(item: TodoItem): void;
  removeItem(item: TodoItem): void;
  clearCompleted(): void;
}

export const useStore = create<State>()(
  persist(
    devtools((set) => ({
      view: ViewType.ALL,
      items: [],
      setView: (view: ViewType) =>
        set(() => ({
          view: view,
        }), false, 'ADD_ITEM'),
      addItem: (item: TodoItem) =>
        set((state) => ({
          items: [...state.items, item],
        }), false, 'ADD_ITEM'),
      removeItem: (item: TodoItem) =>
        set((state) => ({
          items: state.items.filter((it) => it.id !== item.id),
        }), false, 'REMOVE_ITEM'),
      toggleItem: (item: TodoItem) =>
        set((state) => ({
          items: state.items.map((it) =>
            it.id === item.id ? { ...it, done: !it.done } : it
          ),
        }), false, 'TOGGLE_ITEM'),
      clearCompleted: () =>
        set((state) => ({
          items: state.items.filter((it) => !it.done),
        }), false, 'REMOVE_COMPLETED'),
    })),
    { name: 'todolist' }
  )
);