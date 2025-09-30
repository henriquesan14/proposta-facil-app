export interface Menu {
    title: string,
    icon: string,
    role: string,
    route: string,
    children?: ChildMenu[]
}

export interface ChildMenu {
    label: string;
    link: string;
    role: string;
}