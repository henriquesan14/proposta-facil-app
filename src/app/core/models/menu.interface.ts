export interface Menu {
    title: string,
    icon: string,
    permission: string,
    route: string,
    children?: ChildMenu[]
}

export interface ChildMenu {
    label: string;
    link: string;
    permission: string;
}