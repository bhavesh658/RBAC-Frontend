import React from 'react';
import { useAuth } from '../../context/AuthContext';

const HasPermission = ({ 
  requiredPermission, 
  requireAll = false, 
  fallback = null, 
  children 
}) => {
  const { user } = useAuth();

  const storedPerms = localStorage.getItem("user_permissions");
  const permissions = storedPerms ? JSON.parse(storedPerms) : [];
  
  if (!requiredPermission) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (Array.isArray(requiredPermission)) {
    if (requireAll) {
      hasAccess = requiredPermission.every(perm => permissions.includes(perm));
    } else {
      hasAccess = requiredPermission.some(perm => permissions.includes(perm));
    }
  } else {
    hasAccess = permissions.includes(requiredPermission);
  }

  return hasAccess ? <>{children}</> : fallback;
};

export default HasPermission;