export const transformState = (state) => {
    switch (state) {
        case 'registered':
            return 'registrado'
        case 'approved':
            return 'aprobado'
        default:
            return 'pendiente'
    }
}
