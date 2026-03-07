/**
 * Represents a User entity in the system.
 * Even if authentication is not yet implemented, 
 * the domain must recognize the existence of a user.
 */
export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: Date;
}