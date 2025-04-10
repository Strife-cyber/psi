import { LucideIcon } from "lucide-react";

export interface User {
    name: string,
    email: string
}

export interface BreadcrumbItem {
    title:  string;
    href:   string;
}

export interface NavGroup {
    title:  string;
    items:  NavItem[];
}

export interface NavItem {
    title:      string;
    href:       string;
    isActive?:  boolean;
    icon?:      LucideIcon | null;
}

export interface Password {
    id: number,
    value: string,
    isUnique: boolean,
    rarityScore: number,
    strengthScore: number,
    createdAt: Date,
    updatedAt: Date,
}

export interface Entry {
    id: number,
    title: string,
    description: string,
    password: number,
    createdAt: Date,
    updatedAt: Date,
    Password?: Password 
}
