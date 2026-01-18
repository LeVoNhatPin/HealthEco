import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getRoleDisplayName(role: string): string {
    switch (role) {
        case 'Doctor':
            return 'Bác sĩ';
        case 'ClinicAdmin':
            return 'Quản lý phòng khám';
        case 'SystemAdmin':
            return 'Quản trị viên';
        case 'Patient':
            return 'Bệnh nhân';
        default:
            return role;
    }
}

export function getRoleBadgeColor(role: string): string {
    switch (role) {
        case 'Doctor':
            return 'bg-blue-100 text-blue-800';
        case 'ClinicAdmin':
            return 'bg-purple-100 text-purple-800';
        case 'SystemAdmin':
            return 'bg-red-100 text-red-800';
        case 'Patient':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}