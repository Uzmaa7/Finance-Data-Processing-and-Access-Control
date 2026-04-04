export const DB_NAME = "FinanceTracker"

export const UserRoles = {
    VIEWER: "VIEWER",
    ANALYST: "ANALYST",
    ADMIN: "ADMIN"
}

export const AvailableUserRoles = Object.values(UserRoles);


export const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
}

export const AvailableUserStatus = Object.values(UserStatus);

export const Amount = {
    INCOME: "INCOME",
    EXPENSE: "EXPENSE"
}

export const AvailableAmount = Object.values(Amount)