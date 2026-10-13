const SESSION_KEYS = {
    EMAIL: 'userEmail',
    ROLE: 'userRole',
    NAME: 'userName',
    SPECIALIZATION: 'userSpecialization',
    COMPANY: 'userCompany'
};

const getPrefix = (role) => {
    if (!role) return '';
    return role.toUpperCase() + '_';
};

export const setSession = (role, data) => {
    const prefix = getPrefix(role);
    sessionStorage.setItem(`${prefix}${SESSION_KEYS.EMAIL}`, data.email);
    sessionStorage.setItem(`${prefix}${SESSION_KEYS.ROLE}`, role);
    sessionStorage.setItem(`${prefix}${SESSION_KEYS.NAME}`, data.name);
    if (data.specialization) sessionStorage.setItem(`${prefix}${SESSION_KEYS.SPECIALIZATION}`, data.specialization);
    if (data.company) sessionStorage.setItem(`${prefix}${SESSION_KEYS.COMPANY}`, data.company);
};

export const getSession = (role) => {
    const prefix = getPrefix(role);
    return {
        email: sessionStorage.getItem(`${prefix}${SESSION_KEYS.EMAIL}`),
        role: sessionStorage.getItem(`${prefix}${SESSION_KEYS.ROLE}`),
        name: sessionStorage.getItem(`${prefix}${SESSION_KEYS.NAME}`),
        specialization: sessionStorage.getItem(`${prefix}${SESSION_KEYS.SPECIALIZATION}`),
        company: sessionStorage.getItem(`${prefix}${SESSION_KEYS.COMPANY}`)
    };
};

export const clearSession = (role) => {
    const prefix = getPrefix(role);
    sessionStorage.removeItem(`${prefix}${SESSION_KEYS.EMAIL}`);
    sessionStorage.removeItem(`${prefix}${SESSION_KEYS.ROLE}`);
    sessionStorage.removeItem(`${prefix}${SESSION_KEYS.NAME}`);
};

// For backward compatibility or general checks if needed
export const getActiveSession = () => {
    // This looks for any valid session, but in this isolated model, 
    // components should generally know their role and use getSession(role)
    const roles = ['USER', 'AGENT', 'ADMIN'];
    for (const r of roles) {
        const session = getSession(r);
        if (session.email && session.role) return session;
    }
    return null;
};
