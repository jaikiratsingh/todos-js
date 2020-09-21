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
    },
    ADD_BULK: {
        name: 'ADD_BULK',
        inverse: 'DELETE_BULK'
    },
    UPDATE_BULK: {
        name: 'UPDATE_BULK',
        inverse: 'UPDATE_BULK'
    },
    DELETE_BULK: {
        name: 'DELETE_BULK',
        inverse: 'ADD_BULK'
    }
};

export {actions}; 