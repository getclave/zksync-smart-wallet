import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export enum Page {
    HOME,
    SEND,
    RECEIVE,
}

export const PageStore = atom<Page>({
    default: Page.HOME,
    key: 'Page.Atom',
});

export const usePage = (): Page => {
    return useRecoilValue(PageStore);
};

export const useSetPage = () => {
    return useSetRecoilState(PageStore);
};
