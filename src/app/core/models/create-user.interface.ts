export interface CreateUser {
    id: string;
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    group: string;
}