import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
    ...defaultStatements,
    ebooks: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
    USER: ac.newRole({
        ebooks: ["read"],
    }),

    ADMIN: ac.newRole({
        ebooks: ["create", "read", "update", "delete"],
        ...adminAc.statements,
    }),
};