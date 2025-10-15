export const assignedColorWithState = (state) => {
    switch (state) {
        case 'registrado':
            return 'bg-amber-300 text-black'
        case 'aprobado':
            return 'bg-green-500 text-black'
        default:
            return 'bg-gray-500 text-black'
    }
}