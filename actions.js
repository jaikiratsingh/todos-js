const actions = {
    NONE: {
        name: 'NONE',
        inverse: 'NONE'
    },
    ADD: {
        name: 'ADD',
        inverse: 'DELETE'
    },
    UPDATE: {
        name: 'UPDATE',
        inverse: 'UPDATE'
    },
    DELETE: {
        name: 'DELETE',
        inverse: 'ADD'
    }
};

export {actions};