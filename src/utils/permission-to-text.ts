import { AdminPermission } from "@prisma/client";

export const permissionReadableText: Record<AdminPermission, string> = {
  [AdminPermission.ALL]: "All Permissions",
  [AdminPermission.UPLOAD_MUSIC]: "Upload Music",
  [AdminPermission.VIEW_TRANSACTIONS]: "View Transactions",
  // Add any other permissions here
};

// Function to get readable text for a permission
export const getReadablePermission = (permission: AdminPermission): string => {
  return permissionReadableText[permission] || permission;
};
